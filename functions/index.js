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

    const snapshot = await db.collection("customers").doc(data.customer).get();
    const userId = snapshot.data().userId;
    if (
      hook === "checkout.session.completed" &&
      data.payment_status === "paid"
    ) {
      await db.collection("checkout").add({ data: data });
      if (data.mode === "subscription") {
        const dt = new Date();
        const nextyear = Math.floor(
          new Date(
            new Date().setFullYear(
              new Date().getFullYear() + 1,
              new Date().getMonth(),
              new Date().getDay() - 1
            )
          ).getTime() / 1000
        );
        functions.logger.log(nextyear.toString());
        const subscription = await stripe.subscriptions.update(
          data.subscription,
          { cancel_at: nextyear }
        );
        await db.collection("subscription").add({ subscription: subscription });
      }
      handleCheckoutEnd(data.metadata.orderId, data.customer_details.email);
    } else if (hook === "invoice.payment_succeeded") {
      //User :
      //abonnement ON
      //bool : engagement ?
      //fin engagement
      //période payer
      //orderId[]
      await db
        .collection("customers")
        .doc(data.customer)
        .collection("invoice_succeeded")
        .add({ data });
    } else if (hook === "invoice.payment_failed") {
      //sendMail abonnement fail
      //abonnement en attente
      //1 semaine après finir abonnement ( date rejet puis functions planifié)
      await db
        .collection("customers")
        .doc(data.customer)
        .collection("invoice_failed")
        .add({ data });
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
