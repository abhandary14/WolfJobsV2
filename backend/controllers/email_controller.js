const { Resend } = require("resend");
const nodemailer = require("nodemailer");
const {
  jobApplicationAcceptedTemplate,
} = require("../emails/jobApplicationAcceptedTemplate");
const {
  jobApplicationRejectionTemplate,
} = require("../emails/jobApplicationRejectionTemplate");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const resend = new Resend(process.env.RESEND_API_KEY || "");

module.exports.sendJobAcceptanceEmail = async (req, res) => {
  const {
    applicationId,
    jobid,
    emailType,
    applicantEmail,
    applicantName,
    jobTitle,
    companyName,
    contactEmail,
  } = req.body;

  console.log(
    applicationId,
    jobid,
    emailType,
    applicantEmail,
    applicantName,
    jobTitle,
    companyName,
    contactEmail
  );

  const emailHtml = jobApplicationAcceptedTemplate({
    applicantName: applicantName,
    jobTitle: jobTitle,
    companyName: companyName,
    contactEmail: contactEmail,
    applicationDate: new Date().toLocaleDateString(),
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: applicantEmail, // list of receivers
      subject: `Your Application for ${jobTitle} has been Accepted`, // Subject line
      html: emailHtml, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return res.status(201).json({
      success: true,
      message: "Application accepted and email sent.",
      data: info,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.sendJobRejectionEmail = async (req, res) => {
  const { applicantEmail, applicantName, jobTitle, companyName, contactEmail } =
    req.body;

  // Generate the email HTML content
  const emailHtml = jobApplicationRejectionTemplate({
    applicantName: applicantName,
    jobTitle: jobTitle,
    companyName: companyName,
    contactEmail: contactEmail,
    applicationDate: new Date().toLocaleDateString(),
  });

  try {
    // Send the email using Resend SDK
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: applicantEmail, // list of receivers
      subject: `Update on your application for ${jobTitle}`,
      html: emailHtml, // html body
    });

    console.log("Message sent: %s", info.messageId);

    res
      .status(200)
      .json({ success: true, data: info, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
