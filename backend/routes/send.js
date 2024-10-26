const express = require("express");

const router = express.Router();

const {
  sendJobAcceptanceEmail,
  sendJobRejectionEmail,
  sendJobSelectionEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/email_controller");

router.post("/send-job-acceptance-email", sendJobAcceptanceEmail);
router.post("/send-job-rejection-email", sendJobRejectionEmail);
router.post("/selection-email", sendJobSelectionEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
