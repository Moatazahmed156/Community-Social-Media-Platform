const nodemailer = require("nodemailer");
const {EMAIL_HOST, EMAIL_USER, EMAIL_PASS} = require("../config/variables");

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
  rejectUnauthorized: false,
}
});

transporter.verify((error) => {
  if (error) {
    console.error("Mail connection failed:", error.message);
  } else {
    console.log("Mail server connected successfully");
  }
});

// Returns a promise so callers can await and catch mail failures
const sendMail = (email, subject, message) => {
  return transporter.sendMail({
    from: `"CommunityHub" <${EMAIL_USER}>`,
    to: email,
    subject,
    text: message,
  });
};

const sendHTMLMail = async (email, subject, message) => {
  await transporter.sendMail({
    from: `"CommunityHub" <${EMAIL_USER}>`,
    to: email,
    subject,
    html: message,
  });
};

module.exports = {
  sendMail,
  sendHTMLMail,
};