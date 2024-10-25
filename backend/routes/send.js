const express = require("express");

const router = express.Router();

const {
  sendJobAcceptanceEmail,
  sendJobRejectionEmail,
} = require("../controllers/email_controller");

router.post("/send-job-acceptance-email", sendJobAcceptanceEmail);
router.post("/send-job-rejection-email", sendJobRejectionEmail);

module.exports = router;
