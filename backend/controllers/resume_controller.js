// controllers/resume_controller.js
const Resume = require('../models/resume');
const User = require('../models/user');
const pdfParse = require('pdf-parse');

const multer = require('multer');


const INPUT_PROMPT = ``;


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
      return res.status(201).json({
        success: false,
        message: "User does not exist."
      })
    }

    const resumeId = user.resumeId;

    // Fetch the resume from the database using the provided resume ID
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).send({ error: 'Resume not found' });
    }

    // Parse the PDF buffer data to extract text
    const data = await pdfParse(resume.fileData);
    const text = data.text

    ats_score = model.get_response()

    // Send the extracted text as JSON response
    res.status(200).send({ success: true, text: ats_score });
  } catch (error) {
    console.error("Error parsing resume:", error);
    res.status(500).send({ error: 'Failed to parse resume' });
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