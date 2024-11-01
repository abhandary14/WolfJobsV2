import { useEffect, useState } from "react";
import { useApplicationStore } from "../../store/ApplicationStore";
import { Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const JobScreening = (props: any) => {
  const { jobData }: { jobData: Job } = props;
  const [searchParams] = useSearchParams();

  const [displayList, setDisplayList] = useState<Application[]>([]);
  const [matchPercentages, setMatchPercentages] = useState<{
    [key: string]: number;
  }>({});

  const applicationList = useApplicationStore((state) => state.applicationList);

  useEffect(() => {
    // let displayList: Application[] = [];s
    setDisplayList(
      applicationList.filter(
        (item) => item.jobid === jobData._id && item.status === "applied"
      )
    );
  }, [searchParams]);

  const handleAccept = (applicationId: string) => {
    const url = "http://localhost:8000/api/v1/users/modifyApplication";

    const body = {
      applicationId: applicationId,
      status: "screening",
    };

    axios.post(url, body).then((res) => {
      if (res.status == 200) {
        toast.success("Accepted candidate");
        location.reload();

        return;
      }
      toast.error("Failed to accept candidate");
    });
  };
  const handleReject = (applicationId: string) => {
    const url = "http://localhost:8000/api/v1/users/modifyApplication";

    const body = {
      applicationId: applicationId,
      status: "rejected",
    };

    axios.post(url, body).then((res) => {
      if (res.status == 200) {
        toast.success("Rejected candidate");
        location.reload();

        return;
      }
      toast.error("Failed to reject candidate");
    });
  };

  const handleGetMatchPercentage = async (applicantId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/resume/managerParseResume",
        { userId: applicantId, jobid: jobData._id }
      );

      if (response.data.success) {
        setMatchPercentages((prev) => ({
          ...prev,
          [applicantId]: response.data.match_percentage,
        }));
        toast.success("Match percentage calculated successfully");
      } else {
        toast.error("Failed to calculate match percentage");
      }
    } catch (error) {
      console.error("Error calculating match percentage:", error);
      toast.error("An error occurred while calculating match percentage");
    } finally {
    }
  };

  return (
    <>
      <div className="text-xl">Screening</div>
      {displayList.length === 0 && (
        <div className="text-base text-gray-500">List empty</div>
      )}
      {displayList?.map((item: Application) => (
        <div className="p-1 ">
          <div className="p-2 mx-1 my-2 bg-white rounded-lg">
            <div className="flex flex-row justify-between ">
              <div className="flex flex-col">
                <div> Name: {item.applicantname} </div>
                {!!item?.phonenumber && <div>Phone: {item.phonenumber} </div>}
                <div>Email: {item.applicantemail}</div>
                {!!item?.applicantSkills && (
                  <div>Skills: {item.applicantSkills}</div>
                )}
                <div className="flex justify-center px-2 py-1 ml-2 border border-gray-300 rounded-md">
                  <a
                    href={`/resumeviewer/${item.applicantid}`}
                    className="text-red-500"
                  >
                    View Resume
                  </a>
                </div>
                <div className="flex justify-center px-2 py-1 mr-2 border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleGetMatchPercentage(item.applicantid)}
                  >
                    Get Match %
                  </button>
                </div>
              </div>
              <div className="flex flex-row">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    return handleAccept(item._id);
                  }}
                  style={{ color: "#FF5353" }}
                >
                  Accept
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    return handleReject(item._id);
                  }}
                  style={{ color: "#FF5353" }}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default JobScreening;
