// controllers/resume_controller.js
const Resume = require("../models/resume");
const User = require("../models/user");
const pdfParse = require("pdf-parse");

const multer = require("multer");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Job = require("../models/job");

require("dotenv").config();

const GenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = GenAI.getGenerativeModel({ model: "gemini-pro" });

const INPUT_PROMPT_USER = `
  You are an ATS (Applicant Tracking System) scanner specializing in university dining and campus enterprise operations. Evaluate the candidate's resume.

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
      return cb(new Error("Please upload a PDF file"));
    }
    cb(undefined, true);
  },
});

module.exports.parseResume = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(201).json({
        success: false,
        message: "User does not exist.",
      });
    }

    const resumeId = user.resumeId;

    // Fetch the resume from the database using the provided resume ID
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).send({ error: "Resume not found" });
    }

    // Parse the PDF buffer data to extract text
    try {
      const data = await pdfParse(resume.fileData);
      const text = data.text;

      const prompt = `${INPUT_PROMPT_USER}\nResume: ${text}`;

      const generationResult = await model.generateContent(prompt);
      const response = await generationResult.response;
      const responseText = response.text();
      console.log("type", typeof responseText);

      console.log("Raw response:", responseText);
      console.log(JSON.parse(responseText) || "Not solved");

      let ats_score;
      try {
        ats_score = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return res.status(500).send({
          error: "Failed to parse AI response",
          details: responseText,
        });
      }

      if (!ats_score || typeof ats_score.ats_score !== "number") {
        console.error("Invalid ATS score format:", ats_score);
        return res
          .status(500)
          .send({ error: "Invalid ATS score format", details: ats_score });
      }

      // Update the resume document with the ATS score
      resume.atsScore = ats_score.ats_score;
      await resume.save();

      console.log("ATS Score:", ats_score.ats_score);
      res.status(200).send({ success: true, ats_score: ats_score.ats_score });
    } catch (error) {
      console.error("Error processing resume:", error);
      res.status(500).send({
        error: "An error occurred while processing the resume",
        details: error.message,
      });
    }
  } catch (error) {
    console.error("Error parsing resume:", error);
    res
      .status(500)
      .send({ error: "Failed to parse resume", details: error.message });
  }
};

// Resume upload handler
exports.uploadResume = async (req, res) => {
  // first look for a resume with the same applicantId
  const existingResume = await Resume.findOne({
    applicantId: req.body.id,
  });

  if (existingResume) {
    // delete the existing resume
    existingResume.remove();
  }

  // find the user and add the resume
  let user = await User.findOne({ _id: req.body.id });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  try {
    const resume = new Resume({
      applicantId: user._id, // Assuming the user is authenticated
      fileName: req.file.originalname,
      fileData: req.file.buffer,
      contentType: "application/pdf",
    });
    await resume.save();

    // update the user's resumeId
    user.resumeId = resume._id;
    user.resume = resume.fileName;
    await user.save();

    res.status(201).send({ message: "Resume uploaded successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ applicantId: req.params.id });
    if (!resume) {
      return res.status(404).send({ error: "Resume not found" });
    }
    res.set("Content-Type", "application/pdf");
    // send file name
    res.set("Content-Disposition", `inline; filename=${resume.fileName}`);
    res.send(resume.fileData);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Make sure to export the multer upload as well
exports.upload = upload;

exports.ping = (req, res) => {
  res.send({ message: "Pong" });
};
