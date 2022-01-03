const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

const sgMail = require("@sendgrid/mail");

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

exports.sendContactMail = functions
  .region("europe-west1")
  .https.onCall(async(data, context) => {
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
        motif: data.motif
      },
    };

    await sgMail.send(msg);

    return { succes: true };
  });