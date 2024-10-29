import * as React from "react";

interface JobApplicationAcceptedEmailProps {
  applicantName: string;
  jobTitle: string;
  companyName: string;
  applicationDate: string;
  contactEmail: string;
  nextSteps: string;
}

export const JobApplicationAcceptedEmail: React.FC<
  JobApplicationAcceptedEmailProps
> = ({
  applicantName,
  jobTitle,
  companyName,
  applicationDate,
  contactEmail,
  nextSteps,
}) => (
  <div
    style={{ fontFamily: "Arial, sans-serif", color: "#333", padding: "20px" }}
  >
    <h1 style={{ color: "#0B5394" }}>Application Accepted</h1>
    <p>Dear {applicantName},</p>
    <p>
      We are excited to inform you that your application for the position of{" "}
      <strong>{jobTitle}</strong> at <strong>{companyName}</strong> has been
      accepted as of {applicationDate}.
    </p>
    <p>
      We were impressed by your skills and experience, and we believe you would
      be an excellent fit for our team.
    </p>
    <p>{nextSteps}</p>
    <p>
      Should you have any questions, please don't hesitate to reach out to us at{" "}
      <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
    </p>
    <p>Best regards,</p>
    <p>The {companyName} Recruitment Team</p>
  </div>
);
