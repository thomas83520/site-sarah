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
    });

    return {
      id: session.id,
    };
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
    if (hook === "payment_intent.succeeded")
      await db
        .collection("customers")
        .doc(data.customer)
        .collection("succeed")
        .add({
          customer: data.customer,
          id: data.id,
          amount: data.amount,
          currency: data.currency,
          charges: data.charges,
          data: data,
        });
    else if (
      hook === "checkout.session.completed" &&
      data.payment_status === "paid"
    ) {
      await db
        .collection("customers")
        .doc(data.customer)
        .collection("sessionCompleted")
        .add({
          data: data,
        });
      const completedSession = await stripe.checkout.sessions.listLineItems(
        data.id
      );
      await db
        .collection("customers")
        .doc(data.customer)
        .collection("sessionCompleted")
        .doc("listItem")
        .set({
          data: completedSession,
        });
      completedSession.data.forEach(async (element) => {
        const product = await stripe.products.retrieve(element.price.product);
        functions.logger.log("description",element.description);
        if (element.description === "Ebook") {
          sendEbook(data.customer_details.email);
        }
        if(element.description === "La boite à menus de Sarah")
        {
          functions.logger.log("boites à menus");
          let weekNumber = getWeek(new Date());
          functions.logger.log("week number",weekNumber);
          //TODO:Add menus to storage 
          //Get menus de la semaine
          //Envoyé par mail le premier menu
        }
      });
    } else
      await db
        .collection("customers")
        .doc(data.customer)
        .collection("other")
        .add({ hook: hook, data: data });


    //TODO: Ajouter les webhook pour les abonnements



    return res.status(200).send(`successfully handled ${hook}`);
  });

async function sendEbook(email) {
  functions.logger.log("email", email);
  const bucket = admin.storage().bucket();
  const tempFilePath = path.join(os.tmpdir(), "fileName");
  await bucket.file("ebook.pdf").download({ destination: tempFilePath });
  functions.logger.log("Image downloaded locally to", tempFilePath);
  attachment = fs.readFileSync(tempFilePath).toString("base64");
  const msg = {
    to: email,
    from: "contact@dietup.fr", //TODO : change email
    templateId: SEND_EBOOK_TEMPLATE_ID,
    attachments: [
      {
        content: attachment,
        filename: "ebookhiver.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };
  await sgMail.send(msg).catch((err) => {
    console.log(err);
  });
}

function getWeek(dateTime) {
  var oneJan = new Date(dateTime.getFullYear(), 0, 1);
  var numberOfDays = Math.floor((dateTime - oneJan) / (24 * 60 * 60 * 1000));
  var result = Math.ceil((dateTime.getDay() + 1 + numberOfDays) / 7);
  return result;
}
