const { Resend } = require("resend");
const {
  jobApplicationAcceptedTemplate,
} = require("../emails/jobApplicationAcceptedTemplate");
const {
  jobApplicationRejectionTemplate,
} = require("../emails/jobApplicationRejectionTemplate");

const resend = new Resend(process.env.RESEND_API_KEY || "");

module.exports.sendJobAcceptanceEmail = async (req, res) => {
  const {
    applicantEmail,
    applicantName,
    jobTitle,
    companyName,
    applicationDate,
    contactEmail,
    nextSteps,
  } = req.body;

  const emailHtml = jobApplicationAcceptedTemplate({
    applicantName,
    jobTitle,
    companyName,
    applicationDate,
    contactEmail,
    nextSteps,
  });

  try {
    const data = await resend.emails.send({
      from: `${WolfJobs} onboarding@resend.dev`,
      to: [applicantEmail],
      subject: `Your Application for ${jobTitle} has been Accepted`,
      html: emailHtml,
    });

    res.json({
      success: true,
      message: "Application accepted and email sent.",
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
    applicantName,
    jobTitle,
    companyName,
    contactEmail,
  });

  try {
    // Send the email using Resend SDK
    const data = await resend.emails.send({
      from: `${WolfJobs} onboarding@resend.dev`,
      to: [applicantEmail],
      subject: `Update on your application for ${jobTitle}`,
      html: emailHtml,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
