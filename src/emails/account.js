const sgMail = require("@sendgrid/mail");
const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "vivian123.cs02@gmail.com",
    subject: "thanks for joining in ",
    text: `welcome to the app ${name}`
  });
};
const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "vivian123.cs02@gmail.com",
    subject: "sorry to see you leave",
    text: `sorry to see you leave the app ${name}`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
// sgMail.send({
//   to: "vivian123.cs02@gmail.com",
//   from: "vivian123.cs02@gmail.com",
//   subject: "first test",
//   text: "thanks for attention"
// });
