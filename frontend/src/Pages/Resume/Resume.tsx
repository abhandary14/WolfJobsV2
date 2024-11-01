import React, { useState } from "react";
import axios from "axios";
import ResumeDropzone from "../../components/Resume/ResumeDropzone";
import { useUserStore } from "../../store/UserStore";
import { toast } from "react-toastify";

const Resume: React.FC = () => {
  // State to store the uploaded file
  const [file, setFile] = useState<File | null>(null);

  const [atsScore, setAtsScore] = useState<string | null>(null);


  // The current resume data
  const resumeName = useUserStore((state) => state.resume);
  const userId = useUserStore((state) => state.id);
  const updateResume = useUserStore((state) => state.updateResume);
  const updateResumeId = useUserStore((state) => state.updateResumeId)

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("id", userId);

      try {
        const response = await axios.post(
          "http://localhost:8000/users/uploadresume",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          console.log("Resume uploaded successfully");
          toast.success("Resume Uploaded Successfully. Sign out and sign back in to see changes!");
        }
      } catch (error) {
        console.error("Error uploading the resume", error);
        toast.error("Resume could not be uploaded");
      }
    }
  };

  const handleATSChecker = async () => {
    try {
      console.log(userId);
      const response = await axios.post("http://localhost:8000/resume/parseResume", { userId: userId });
      console.log(response.data);

      if (response.data.success) {
        setAtsScore(response.data.text);
        toast.success("PDF parsed successfully!!!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Parsing PDF");
    } finally {
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-1/3">
          <ResumeDropzone
            onFileUpload={(acceptedFiles) => setFile(acceptedFiles[0])}
          />
          <div className="flex flex-row">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded"
            >
              Upload Resume
            </button>
          </div>

          {resumeName && (
            <>
              <div className="mt-4">
                <p>Current Resume: {resumeName}</p>
                <div className="flex space-x-4">
                  <a
                    href={`/resumeviewer/${userId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 font-bold text-white bg-red-500 rounded"
                  >
                    View
                  </a>
                  <button
                    onClick={handleATSChecker}
                    className="inline-block px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                  >
                  </button>
                </div>
              </div>
            </>
          )}
          {atsScore !== null && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">ATS Score</h3>
              <div className="flex items-center">
                {atsScore}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Resume;
