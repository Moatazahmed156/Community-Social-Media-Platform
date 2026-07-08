const nodemailer = require("nodemailer");
const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = require("../config/variables");

const emailEnabled = Boolean(EMAIL_USER && EMAIL_PASS);

let transporter = null;

if (emailEnabled) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.error("Mail connection failed:", error.message);
    } else {
      console.log("Mail server connected successfully");
    }
  });
} else {
  console.warn(
    "Email is not configured (EMAIL_HOST/EMAIL_USER/EMAIL_PASS missing). " +
      "Emails will be skipped instead of sent."
  );
}


const sendMail = (email, subject, message) => {
  if (!emailEnabled) return Promise.resolve();
  return transporter.sendMail({
    from: `"Hive" <${EMAIL_USER}>`,
    to: email,
    subject,
    text: message,
  });
};

const sendHTMLMail = async (email, subject, message) => {
  if (!emailEnabled) return;
  await transporter.sendMail({
    from: `"Hive" <${EMAIL_USER}>`,
    to: email,
    subject,
    html: message,
  });
};

module.exports = {
  sendMail,
  sendHTMLMail,
};
