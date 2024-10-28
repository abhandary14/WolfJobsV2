const express = require("express");
const { parseResume } = require("../controllers/resume_controller");

const router = express.Router();


router.post("/parseResume", parseResume);


module.exports = router;
