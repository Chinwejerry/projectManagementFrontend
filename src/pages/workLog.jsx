import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

const WorklogForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [spentTime, setSpentTime] = useState("");
  const [statusChange, setStatusChange] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("taskId", taskId);
      formData.append("comment", comment);
      formData.append("spentTime", spentTime);
      if (statusChange) formData.append("statusChange", statusChange);
      if (file) formData.append("file", file);

      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/worklogs",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ⬅️ اینو نگه داریم
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to add worklog");
      await res.json();

      navigate(`/taskDetail/${taskId}`);
    } catch (err) {
      console.error("❌ Error submitting worklog:", err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 ">
      <span
        className="p-4 text-cyan-50  flex items-start"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow rounded-lg p-6 w-96 flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold mb-4">Add Worklog</h1>

          <div>
            <input
              type="text"
              placeholder="Comment"
              className="border p-2 rounded w-full"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Spent Time (hours)"
              className="border p-2 rounded w-full"
              value={spentTime}
              onChange={(e) => setSpentTime(e.target.value)}
              required
            />
          </div>
          <div>
            <select
              value={statusChange}
              onChange={(e) => setStatusChange(e.target.value)}
              placeholder="Status Change (optional)"
              className="border p-2 rounded w-full"
            >
              <option value="">Select Status (optional)</option>
              <option value="pending">pending</option>
              <option value="in-progress">in-progress</option>
              <option value="completed">completed</option>
            </select>
          </div>
          <div>
            <label>Attachment (optional):</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded w-full"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Submit Worklog
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorklogForm;
