const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

//Firestore init
const db = admin.firestore();

//Send grid init
const sgMail = require("@sendgrid/mail");
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
const SEND_EBOOK_TEMPLATE_ID =
  functions.config().sendgrid.send_ebook_template_id;
sgMail.setApiKey(API_KEY);

const path = require("path");
const os = require("os");
const fs = require("fs");

//Stripe init
const stripe = require("stripe")(functions.config().stripe.secret_key);

exports.sendContactMail = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const msg = {
      to: "sarahroggi.dieteticienne@gmail.com",
      from: "contact@dietup.fr",
      templateId: TEMPLATE_ID,
      dynamic_template_data: {
        completeName: data.completeName,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        motif: data.motif,
      },
    };

    await sgMail.send(msg);

    return { succes: true };
  });

exports.createStripeCheckout = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const snapshot = await db.collection("users").doc(context.auth.uid).get();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: data.paymentMode,
      customer: snapshot.data().customerId,
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      line_items: data.line_items,
      metadata: data.metadata,
    });

    return {
      id: session.id,
    };
  });

exports.createOrder = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const docRef = await db
      .collection("orders")
      .add({ userId: context.auth.uid, items: data.items });
    return docRef.id;
  });

exports.createStripeCustomers = functions
  .region("europe-west1")
  .auth.user()
  .onCreate(async (user) => {
    return stripe.customers
      .create({ email: user.email })
      .then(async (customer) => {
        await db
          .collection("users")
          .doc(user.uid)
          .set(
            { userId: user.uid, email: user.email, customerId: customer.id },
            { merge: true }
          );
        await db
          .collection("customers")
          .doc(customer.id)
          .set({ userId: user.uid, customerId: customer.id }, { merge: true });
      });
  });

//Handle webhook from stripe
exports.recurringPayment = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = functions.config().stripe.webhooktest;
    const hook = req.body.type;
    const data = req.body.data.object;

    let event;
    /*try {
      event = stripe.webhooks.constructEvent(req.body.rawBody, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }*/

    if (!data) throw new Error("missing data");

    //Get user ID from customer id
    const snapshot = await db.collection("customers").doc(data.customer).get();
    const userId = snapshot.data().userId;

    //Checkout end and paid
    if (
      hook === "checkout.session.completed" &&
      data.payment_status === "paid"
    ) {
      await db.collection("checkout").add({ data: data });
      if (data.mode === "subscription") {
        const nextyear = Math.floor(
          new Date(
            new Date().setFullYear(
              new Date().getFullYear() + 1,
              new Date().getMonth(),
              new Date().getDate() - 1
            )
          ).getTime() / 1000
        );
        await stripe.subscriptions.update(data.subscription, {
          cancel_at: nextyear,
        });
        setSubscriptionToUser(data.metadata.orderId);
      }else{
        setSubscriptionIfNecessary(data.metadata.orderId);
      }
      handleCheckoutEnd(data.metadata.orderId, data.customer_details.email);
    }
    // subscription payment paied
    else if (hook === "invoice.payment_succeeded") {
      //Set abonnement to "paid" -> in case it was fail
      await db.collection("users").doc(userId).set(
        {
          abonnement: "paid",
          subscriptionAsFailed: false,
        },
        { merge: true }
      );
    }
    //Subscription payment failed
    else if (hook === "invoice.payment_failed") {
      //set abonnement to
      await db
        .collection("users")
        .doc(userId)
        .set(
          {
            abonnement: "failed",
            failedDate: admin.firestore.FieldValue.arrayUnion(
              admin.firestore.Timestamp.fromDate(new Date())
            ),
          },
          { merge: true }
        );
      //sendMail Fail
    }
    //Subscription updated : cancel_at_period_end
    else if (hook === "customer.subscription.updated") {
      const snapshot = await db
        .collection("customers")
        .doc(data.customer)
        .get();
      if (!data.cancel_at_period_end) {
        await db
          .collection("users")
          .doc(snapshot.data().userId)
          .set(
            { abonnement: "paid", canceledDateSet: false, finAbonnement: "" },
            { merge: true }
          );
      } else {
        await db
          .collection("users")
          .doc(snapshot.data().userId)
          .set(
            {
              abonnement: "canceled",
              canceledDateSet: true,
              finAbonnement: admin.firestore.Timestamp.fromDate(
                new Date(data.current_period_end * 1000)
              ),
            },
            { merge: true }
          );
      }
    }
    return res.status(200).send(`successfully handled ${hook}`);
  });

async function sendBuyedItem(items, email) {
  functions.logger.log("sendbuyeditem");
  const bucket = admin.storage().bucket();
  const tempFilePath = path.join(os.tmpdir(), "fileName");
  let attachedDoc = [];

  for (const item of items) {
    if (item.nom.includes("Ebook")) {
      await bucket.file("ebook.pdf").download({ destination: tempFilePath });
      attachment = fs.readFileSync(tempFilePath).toString("base64");
      fs.unlinkSync(tempFilePath);
      attachedDoc.push({
        content: attachment,
        filename: "ebookhiver.pdf",
        type: "application/pdf",
        disposition: "attachment",
      });
    } else if (item.nom.includes("boite à menus")) {
      await bucket
        .file("BoiteMenu/" + getWeek(new Date()) + ".pdf")
        .download({ destination: tempFilePath });
      attachment = fs.readFileSync(tempFilePath).toString("base64");
      fs.unlinkSync(tempFilePath);
      attachedDoc.push({
        content: attachment,
        filename: "Boite à menu.pdf",
        type: "application/pdf",
        disposition: "attachment",
      });
    }
  }

  const msg = {
    to: email,
    from: "contact@dietup.fr", //TODO : change email
    templateId: SEND_EBOOK_TEMPLATE_ID,
    attachments: attachedDoc,
  };
  await sgMail.send(msg).catch((err) => {
    console.log("erreur", err);
  });
}

async function sendConfirmationEmail(email) {
  functions.logger.log("sendconfirmationEmail");
  const msg = {
    to: email,
    from: "contact@dietup.fr", //TODO : change email
    templateId: SEND_EBOOK_TEMPLATE_ID,
  };
  sgMail.send(msg).catch((err) => {
    console.log("erreur", err);
  });
}

function getWeek(dateTime) {
  var oneJan = new Date(dateTime.getFullYear(), 0, 1);
  var numberOfDays = Math.floor((dateTime - oneJan) / (24 * 60 * 60 * 1000));
  var result = Math.ceil((dateTime.getDay() + 1 + numberOfDays) / 7);
  return result;
}

async function handleCheckoutEnd(orderId, customerEmail) {
  const snapshot = await db.collection("orders").doc(orderId).get();
  const userId = snapshot.data().userId;

  sendConfirmationEmail(customerEmail);

  //sendBuyedItem(snapshot.data().items, customerEmail);
}

async function setSubscriptionToUser(orderId) {
  const orderSnapshot = await db.collection("orders").doc(orderId).get();
  let metadata = {};
  for (const item of orderSnapshot.data().items) {
    if (item.paymentMode === "subscription") {
      metadata = item.metadata;
      break;
    }
  }
  await db
    .collection("users")
    .doc(orderSnapshot.data().userId)
    .set(
      {
        abonnementIsActive: true,
        subscriptionAsFailed: false,
        abonnement: "paid",
        asEngagement: metadata.asEngagement,
        finEngagement: admin.firestore.Timestamp.fromDate(
          new Date(
            new Date().setFullYear(
              new Date().getFullYear(),
              new Date().getMonth() + metadata.engagementDuree,
              new Date().getDate()
            )
          )
        ),
        periodePaye: metadata.periodePaye,
        subscriptionStart: admin.firestore.Timestamp.fromDate(new Date()),
        orderId: admin.firestore.FieldValue.arrayUnion(orderId),
        subscriptionEnd: admin.firestore.Timestamp.fromDate(
          new Date(
            new Date().setFullYear(
              new Date().getFullYear() + 1,
              new Date().getMonth(),
              new Date().getDate()
            )
          )
        ),
      },
      { merge: true }
    );
}
async function setSubscriptionIfNecessary(orderId) {
  const orderSnapshot = await db.collection("orders").doc(orderId).get();
  let metadata = {};
  for (const item of orderSnapshot.data().items) {
    if (item.nom.includes("boite à menus")) {
      metadata = item.metadata;
      break;
    }
  }
  await db
    .collection("users")
    .doc(orderSnapshot.data().userId)
    .set(
      {
        abonnementIsActive: true,
        subscriptionAsFailed: false,
        abonnement: "paid",
        asEngagement: metadata.asEngagement,
        finEngagement: admin.firestore.Timestamp.fromDate(
          new Date(
            new Date().setFullYear(
              new Date().getFullYear(),
              new Date().getMonth() + metadata.engagementDuree,
              new Date().getDate()
            )
          )
        ),
        periodePaye: metadata.periodePaye,
        subscriptionStart: admin.firestore.Timestamp.fromDate(new Date()),
        orderId: admin.firestore.FieldValue.arrayUnion(orderId),
        subscriptionEnd: admin.firestore.Timestamp.fromDate(
          new Date(
            new Date().setFullYear(
              new Date().getFullYear() + 1,
              new Date().getMonth(),
              new Date().getDate()
            )
          )
        ),
      },
      { merge: true }
    );
}

exports.createPortalSession = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const snapshot = await db.collection("users").doc(context.auth.uid).get();
    const configuration = await stripe.billingPortal.configurations.create({
      features: {
        customer_update: {
          allowed_updates: ["email", "tax_id"],
          enabled: true,
        },
        invoice_history: { enabled: true },
        subscription_cancel: {
          enabled: !snapshot.data().asEngagement,
          mode: "at_period_end",
        },
        payment_method_update: { enabled: true },
      },
      business_profile: {
        privacy_policy_url: "https://example.com/privacy",
        terms_of_service_url: "https://example.com/terms",
      },
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: snapshot.data().customerId,
      return_url: "http://localhost:3000/",
      configuration: configuration.id,
    });
    return { url: session.url };
  });
