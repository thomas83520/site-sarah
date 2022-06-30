const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

//Firestore init
const db = admin.firestore();

//Send grid init
const sgMail = require("@sendgrid/mail");
const API_KEY = functions.config().sendgrid.key;
const CONTACT_FORM_TEMPLATE_ID = functions.config().sendgrid.contact;
const SEND_MENU_HEBDO_TEMPLATE_ID = functions.config().sendgrid.send_menu_hebdo;
const RECU_PAIEMENT_TEMPLATE_ID = functions.config().sendgrid.recu_paiement;
const REACTIVE_ABO_TEMPLATE_ID = functions.config().sendgrid.reactive_abo;
const ECHEC_PAIEMENT_ABO_TEMPLATE_ID =
  functions.config().sendgrid.echec_paiement_abonnement;
const FICHIER_COMMAND_TEMPLATE_ID = functions.config().sendgrid.fichier_command;
const CANCEL_ABO_PERIOD_END = functions.config().sendgrid.cancel_abo_end_period;
const DEFINITIV_ABO_CANCEL_TEMPLATE_ID =
  functions.config().sendgrid.definitive_abo_cancel;
sgMail.setApiKey(API_KEY);

const path = require("path");
const os = require("os");
const fs = require("fs");

//Stripe init
const stripe = require("stripe")(functions.config().stripe.secret_key_prod);

exports.sendContactMail = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const msg = {
      to: "sarahroggi.dieteticienne@gmail.com",
      from: "contact@dietup.fr",
      templateId: CONTACT_FORM_TEMPLATE_ID,
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

exports.createOrder = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const docRef = await db
      .collection("orders")
      .add({ userId: context.auth.uid, items: data.items });
    return docRef.id;
  });

//Create stripe customer and add in firestore
exports.createStripeCustomer = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    /*const testClock = await stripe.testHelpers.testClocks.create({
      frozen_time: Math.round(new Date().getTime() / 1000),
      name: "Test clock",
    });*/
    const stripeCustomer = await stripe.customers.create({
      email: data.email,
      name: data.displayName,
    });

    await db
      .collection("customer")
      .doc(stripeCustomer.id)
      .set({ customerId: stripeCustomer.id, userId: data.userId });
    await db.collection("clients").doc(data.userId).set({
      achats: [],
      email: data.email,
      name: data.displayName,
      customerId: stripeCustomer.id,
      userId: data.userId,
    });

    return true;
  });

//Renvoie client itent to front
exports.createPaymentIntent = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    if (data.paymentType === "payment") {
      //TODO : créer payment intent et return client secret
      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.totalPrice * 100,
        currency: "eur",
        payment_method_types: ["card"],
        customer: data.user.customerId,
        metadata: data.productIds,
      });
      return { error: false, clientSecret: paymentIntent.client_secret };
    } else if (data.paymentType === "subscription") {
      const subscription = await stripe.subscriptions.create({
        customer: data.user.customerId,
        items: data.subscriptionItems,
        add_invoice_items: data.paymentItems,
        metadata: data.productIds,
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });
      //TODO : créer abonnement et return client secret
      return {
        error: false,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      };
    } else {
      return { error: true, errorMessage: "Type de paiement inconnue" };
    }
  });

//Handle webhook from stripe
exports.recurringPayment = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    const type = req.body.type;

    const sig = req.headers["stripe-signature"];
    const endpointSecret = functions.config().stripe.webhooktest;
    const data = req.body.data.object;

    let event;
    /*try {
      event = stripe.webhooks.constructEvent(req.body.rawBody, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }*/

    if (!data) throw new Error("missing data");

    switch (type) {
      case "invoice.payment_succeeded":
        if (data.amount_due === 0) {
          return res.status(200).send(`successfully handled`);
        }
        var customerDoc= await db
          .collection("customer")
          .doc(data.customer)
          .get();
        const subscriptionId = data.subscription;
        const payment_intent_id = data.payment_intent;
        const payment_intent = await stripe.paymentIntents.retrieve(
          payment_intent_id
        );

        await stripe.subscriptions.update(subscriptionId, {
          default_payment_method: payment_intent.payment_method,
        });

        if (data.billing_reason === "subscription_create") {
          //If billing_reason is created : handle commande
          await handleFirstCommand(
            data.lines.data,
            true,
            customerDoc,
            data.subscription
          );
        }
        //if billing_reason is cycle, rien faire;
        break;

      case "invoice.payment_failed":
        const result = await db
          .collection("boutiqueItems")
          .doc(data.lines.data[0].plan.product)
          .get();
        var customerDoc = await db
          .collection("customer")
          .doc(data.customer)
          .get();

        var userDoc = await db
          .collection("clients")
          .doc(customerDoc.data().userId)
          .get();

        await sendMail(
          userDoc.data().email,
          ECHEC_PAIEMENT_ABO_TEMPLATE_ID,
          [],
          {
            montant: data.amount_due / 100,
            datePaiement: new Date(data.created * 1000).toLocaleDateString(
              "fr"
            ),
            url: data.hosted_invoice_url,
            abonnementName: result.data().productName,
          }
        );
        break;

      case "payment_intent.succeeded":
        var customerDoc = await db
          .collection("customer")
          .doc(data.customer)
          .get();
        await stripe.customers.update(data.customer, {
          invoice_settings: { default_payment_method: data.payment_method },
        });
        var userDoc = await db
          .collection("clients")
          .doc(customerDoc.data().userId)
          .get();
        await sendMail(userDoc.data().email, RECU_PAIEMENT_TEMPLATE_ID, [], {
          montant: data.amount / 100,
          datePaiement: new Date(data.created * 1000).toLocaleDateString("fr"),
          url : data.charges.data[0].receipt_url,
        });
        const receiptUrl = data.charges.data[0].receipt_url;
        if (!data.invoice) {
          await handleFirstCommand(data.metadata, false, customerDoc, null);
        }
        functions.logger.log("payment intent succeeded");
        break;

      case "customer.subscription.updated":
        functions.logger.log("updated");
        const previousData = req.body.data.previous_attributes;
        var customerDoc = await db
          .collection("customer")
          .doc(data.customer)
          .get();
        if (previousData.hasOwnProperty("status")) {
          const productDoc = await db
            .collection("boutiqueItems")
            .doc(data.plan.product)
            .get();

          await changeSubscriptionStatus(productDoc, customerDoc, data.status);
        }
        if (previousData.hasOwnProperty("current_period_end")) {
          //check if interval_count > duree restante ? setDureeMaxAbonnement sur client : cancelAtPeriodEnd
          await checkNeedCancelPeriodEnd(data, true);
        }
        if (previousData.hasOwnProperty("cancel_at_period_end")) {
          await handleCancelAtPeriodEnd(data);
        }
        break;

      case "customer.subscription.created":
        //check if interval_count > duree max ? setDureeMaxAbonnement sur client : cancelAtPeriodEnd
        functions.logger.log("created");
        await checkNeedCancelPeriodEnd(data, false);
        break;

      case "customer.subscription.deleted":
        var customerDoc = await db
          .collection("customer")
          .doc(data.customer)
          .get();
        const productDoc = await db
          .collection("boutiqueItems")
          .doc(data.plan.product)
          .get();
        var userDoc = await db
          .collection("clients")
          .doc(customerDoc.data().userId)
          .get();

        await changeSubscriptionStatus(productDoc, customerDoc, data.status);
        await sendMail(
          userDoc.data().email,
          DEFINITIV_ABO_CANCEL_TEMPLATE_ID,
          [],
          { abonnementName: productDoc.data().productName }
        );
        break;
    }

    return res.status(200).send(`successfully handled`);
  });

handleCancelAtPeriodEnd = async (data) => {
  const result = await db
    .collection("boutiqueItems")
    .doc(data.plan.product)
    .get();
  const customerDoc = await db.collection("customer").doc(data.customer).get();

  const userDoc = await db.collection("clients").doc(customerDoc.data().userId).get();
  //Send mail changement status
  if (data.cancel_at_period_end)
    await sendMail(userDoc.data().email, CANCEL_ABO_PERIOD_END, [], {
      abonnementName: result.data().productName,
      dateFin: new Date(data.cancel_at * 1000).toLocaleDateString("fr"),
    });
  else
    await sendMail(userDoc.data().email, REACTIVE_ABO_TEMPLATE_ID, [], {
      abonnementName: result.data().productName,
    });
};

checkNeedCancelPeriodEnd = async (data, asStarted) => {
  const productId = data.plan.product;
  const prodDoc = await db.collection("boutiqueItems").doc(productId).get();
  var dureePeriod = 0;
  var dureeMax = 0;
  var nomFormule = "Mensuel";
  var isCancel = false;
  const customerDoc = await db.collection("customer").doc(data.customer).get();
  const userAboDoc = await db
    .collection("clients")
    .doc(customerDoc.data().userId)
    .collection("achats")
    .doc(productId)
    .get();
  if (prodDoc.data().asDureeMax) {
    if (asStarted) {
      dureeMax = userAboDoc.data()["dureeRestante"];
      isCancel = userAboDoc.data().isCancel;
    } else {
      dureeMax = prodDoc.data().dureeMax;
    }
    if (data.plan.interval === "year") {
      dureePeriod = data.plan.interval_count * 12;
      nomFormule = "Annuel";
    } else {
      dureePeriod = data.plan.interval_count;
      if (data.plan.interval_count === 6) nomFormule = "Formule 6 mois";
    }
    functions.logger.log("duree", dureeMax, "period", dureePeriod);
    const dureeRestante = dureeMax - dureePeriod;
    if (dureeRestante > 0) {
      setIfsubscriptionCancelable(
        customerDoc.data().userId,
        productId,
        true,
        dureeRestante,
        data.current_period_end,
        nomFormule,
        isCancel
      );
    } else {
      await stripe.subscriptions.update(data.id, {
        cancel_at_period_end: true,
      });
      //empeche réactivation depuis espace client
      setIfsubscriptionCancelable(
        customerDoc.data().userId,
        productId,
        false,
        dureeRestante,
        data.current_period_end,
        nomFormule,
        isCancel
      );
    }
  } else return;
};

setIfsubscriptionCancelable = async (
  userId,
  productId,
  value,
  dureeRestante,
  stripeTimeStamp,
  nomFormule,
  isCancel
) => {
  var usersUpdate = {};
  usersUpdate["canCancel"] = value;
  usersUpdate["dureeRestante"] = dureeRestante;
  usersUpdate["nextPeriod"] = new Date(stripeTimeStamp * 1000);
  usersUpdate["nomFormule"] = nomFormule;
  usersUpdate["isCancel"] = isCancel;
  await db
    .collection("clients")
    .doc(userId)
    .collection("achats")
    .doc(productId)
    .set(usersUpdate, { merge: true });
};

handleFirstCommand = async (
  metadata,
  isInvoice,
  customerDoc,
  subscriptionId
) => {
  var attachedDoc = [];
  const bucket = admin.storage().bucket();
  const tempFilePath = path.join(os.tmpdir(), "fileName");
  for (const item in metadata) {
    const productId = isInvoice ? metadata[item].price.product : metadata[item];
    //Ajoute produit aux achats du clients
    await db
      .collection("clients")
      .doc(customerDoc.data().userId)
      .update({
        achats: admin.firestore.FieldValue.arrayUnion(productId),
      });
    const productDoc = await db
      .collection("boutiqueItems")
      .doc(productId)
      .get();
    if (productDoc.data().asAbonnement) {
      await db
        .collection("clients")
        .doc(customerDoc.data().userId)
        .collection("achats")
        .doc(productId)
        .set(
          { name: productDoc.data().productName, subscriptionId },
          { merge: true }
        );
    } else {
      await db
        .collection("clients")
        .doc(customerDoc.data().userId)
        .collection("achats")
        .doc("oneTimePurchase")
        .set({ itemCount: admin.firestore.FieldValue.increment(1) });
      await db
        .collection("clients")
        .doc(customerDoc.data().userId)
        .collection("achats")
        .doc("oneTimePurchase")
        .collection("docs")
        .add({
          productId,
          productUrl: productDoc.data().url,
          name: productDoc.data().productName,
          imageCouverture: productDoc.data().imageCouverture,
        });
    }

    //Download doc à envoyer
    const itemDoc = await db.collection("boutiqueItems").doc(productId).get();
    await bucket
      .file(itemDoc.data().path)
      .download({ destination: tempFilePath });
    attachment = fs.readFileSync(tempFilePath).toString("base64");
    attachedDoc.push({
      content: attachment,
      filename: itemDoc.data().name,
      type: "application/pdf",
      disposition: "attachment",
    });
    fs.unlinkSync(tempFilePath);
  }

  const userDoc = await db.collection("clients").doc(customerDoc.data().userId).get();
  await sendMail(
    userDoc.data().email,
    FICHIER_COMMAND_TEMPLATE_ID,
    attachedDoc,
    {}
  );
};

changeSubscriptionStatus = async (productDoc, customerDoc, status) => {
  const line = productDoc.data().abonnementField;
  var usersUpdate = {};
  usersUpdate[`status`] = status;
  await db
    .collection("clients")
    .doc(customerDoc.data().userId)
    .collection("achats")
    .doc(productDoc.id)
    .set(usersUpdate, { merge: true });
  var statusUpdate = {};
  statusUpdate[`${line}`] = status;
  await db
    .collection("clients")
    .doc(customerDoc.data().userId)
    .update(statusUpdate);
};

function getWeek(dateTime) {
  var oneJan = new Date(dateTime.getFullYear(), 0, 1);
  var numberOfDays = Math.floor((dateTime - oneJan) / (24 * 60 * 60 * 1000));
  var result = Math.ceil((dateTime.getDay() + 1 + numberOfDays) / 7);
  return result == 53 ? 1 : result;
}

sendMail = async (email, templateId, attachedDoc, data) => {
  const msg = {
    to: email,
    from: { email: "sarahroggi.dieteticienne@gmail.com", name: "Sarah Roggi - diététicienne" },
    templateId,
    dynamic_template_data: data,
    attachments: attachedDoc,
  };
  await sgMail.send(msg).catch((err) => {
    functions.logger.log("erreur", err);
  });
};

//TODO : template email menusEveryWeek
exports.sendMenusEveryWeek = functions
  .region("europe-west1")
  .pubsub.schedule("every Thursday 17:30")
  .timeZone("Europe/Paris")
  .onRun(async (context) => {
    const snapshot = await db
      .collection("clients")
      .where("boiteMenuSubscription", "==", "active")
      .get();
    if (snapshot.empty) {
      functions.logger.log("empty");
      return;
    }
    const productId = "prod_LxWDDyE08dAZ7A";
    const productDoc = await db
      .collection("boutiqueItems")
      .doc(productId)
      .get();
    let email = [];
    const bucket = admin.storage().bucket();
    const tempFilePath = path.join(os.tmpdir(), "fileName");
    const bucketFileName = "BoiteMenu/" + getWeek(new Date()) + ".pdf";
    const fileName = "menu_semaine_" + getWeek(new Date()) + ".pdf";
    const file = bucket.file(bucketFileName);
    for (let doc of snapshot.docs) {
      await db
        .collection("clients")
        .doc(doc.id)
        .collection("achats")
        .doc(productId)
        .collection("docs")
        .add({
          fileName,
          bucketFileName,
          imageCouverture: productDoc.data().imageCouverture,
        });
      email.push(doc.data().email);
    }
    functions.logger.log("email", email);
    await file.download({ destination: tempFilePath });
    attachment = fs.readFileSync(tempFilePath).toString("base64");
    fs.unlinkSync(tempFilePath);

    const msg = {
      to: email,
      from: { email: "sarahroggi.dieteticienne@gmail.com", name: "Sarah Roggi - diététicienne" }, //TODO : change email
      templateId: SEND_MENU_HEBDO_TEMPLATE_ID,
      attachments: [
        {
          content: attachment,
          filename: fileName,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };
    await sgMail.sendMultiple(msg).catch((err) => {});
  });

exports.getFactures = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const receipt = [];
    const paymentIntents = await stripe.paymentIntents.list({
      customer: data.customerId,
    });
    paymentIntents.data.forEach((intent) => {
      if (intent.status === "succeeded")
        receipt.push({
          receipt_url: intent.charges.data[0].receipt_url,
          amount: intent.amount,
          created: intent.created,
          id: intent.id,
          description: intent.charges.data[0].description,
          paid: intent.charges.data[0].paid,
        });
    });
    return receipt;
  });

exports.switchAbonnementCancelStatus = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    try {
      await stripe.subscriptions.update(data.subscriptionId, {
        cancel_at_period_end: data.value,
      });
      const productId = data.productId;
      const value = data.value;

      await db
        .collection("clients")
        .doc(data.userId)
        .collection("achats")
        .doc(productId)
        .update({ isCancel: value });
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  });

exports.getPaymentsMethods = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    return await stripe.customers.listPaymentMethods(data.customerId, {
      type: "card",
    });
  });

exports.getFingerprint = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    return await stripe.paymentMethods.retrieve(data.paymentMethod);
  });

exports.getCustomerPaymentMethod = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const customer = await stripe.customers.retrieve(data.customerId);
    try {
      const result = await stripe.paymentMethods.retrieve(
        customer.invoice_settings.default_payment_method
      );
      return result;
    } catch (e) {
      return { error: true };
    }
  });

exports.attachNewCard = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    try {
      await stripe.paymentMethods.attach(data.payment_method, {
        customer: data.customer,
      });
      await stripe.customers.update(data.customer, {
        invoice_settings: { default_payment_method: data.payment_method },
      });
    } catch (e) {
      return { error: true };
    }
  });
