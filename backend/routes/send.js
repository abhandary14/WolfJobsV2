const express = require("express");

const router = express.Router();

const { sendJobAcceptanceEmail } = require("../controllers/email_controller");

router.post("/send-job-acceptance-email", sendJobAcceptanceEmail);

module.exports = router;
