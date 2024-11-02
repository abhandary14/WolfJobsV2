const { Resend } = require("resend");
const nodemailer = require("nodemailer");
const {
  jobApplicationAcceptedTemplate,
} = require("../emails/jobApplicationAcceptedTemplate");
const {
  jobApplicationRejectionTemplate,
} = require("../emails/jobApplicationRejectionTemplate");
const { jobSelectionTemplate } = require("../emails/jobSelectionTemplate");
const User = require("../models/user");
const crypto = require("crypto");
var bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
