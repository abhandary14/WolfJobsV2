// controllers/resume_controller.js
const Resume = require('../models/resume');
const User = require('../models/user');
const pdfParse = require("pdf-parse");

const multer = require('multer');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Job = require("../models/job");

require("dotenv").config();

const GenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = GenAI.getGenerativeModel({
  model: "gemini-pro", generationConfig: {
    responseMimeType: "application/json",
  }
});

const INPUT_PROMPT_APPLICANT = `
  You are an ATS (Applicant Tracking System) scanner specializing in university dining and campus enterprise operations.

  Important Considerations:
  - Prior dining/campus operations experience is not expected from students
  - Good academic standing is crucial
  - Leadership experience is highly valued

  Evaluation Process:
  1. Calculate the total ATS score out of 400 points

  Output Format:
  Provide the final ATS score in pure JSON format as follows, I only want this JSON response as an output:

  {
    "ats_score": [Insert total score here]
  }

  Note: Be objective and thorough in your assessment.
`;

const upload = multer({
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Please upload a PDF file'));
    }
    cb(undefined, true);
  }
});


module.exports.parseResume = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist." });
    }

    const resumeId = user.resumeId;

    // Fetch the resume from the database using the provided resume ID
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).send({ error: "Resume not found" });
    }

    // Parsing the PDF from the database using the provided resume ID
    try {
      const data = await pdfParse(resume.fileData);
      const text = data.text;
      return res.status(200).json({ success: true, message: "PDF parsed successfully", data: text });
    } catch (error) {
      console.error("Error processing resume:", error);
      res.status(500).send({
        error: "An error occurred while processing the resume",
        details: error.message,
      });
    }
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).json({ success: false, message: "Error parsing PDF", error: error.message });
  }
};


// Resume upload handler
exports.uploadResume = async (req, res) => {
  // first look for a resume with the same applicantId
  const existingResume = await Resume.findOne({
    applicantId: req.body.id
  });

  if (existingResume) {
    // delete the existing resume
    existingResume.remove();
  }

  // find the user and add the resume
  let user = await User.findOne({ _id: req.body.id });

  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  try {
    const resume = new Resume({
      applicantId: user._id, // Assuming the user is authenticated
      fileName: req.file.originalname,
      fileData: req.file.buffer,
      contentType: 'application/pdf'
    });
    await resume.save();

    // update the user's resumeId
    user.resumeId = resume._id;
    user.resume = resume.fileName
    await user.save();

    res.status(201).send({ message: 'Resume uploaded successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ applicantId: req.params.id });
    if (!resume) {
      return res.status(404).send({ error: 'Resume not found' });
    }
    res.set('Content-Type', 'application/pdf');
    // send file name 
    res.set('Content-Disposition', `inline; filename=${resume.fileName}`);
    res.send(resume.fileData);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

// Make sure to export the multer upload as well
exports.upload = upload;

exports.ping = (req, res) => {
  res.send({ message: 'Pong' });
};