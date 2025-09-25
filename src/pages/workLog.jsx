// worklog.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

      // همه داده‌ها + فایل در یک FormData
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

      // بعد از ثبت موفق، برو به task detail
      navigate(`/taskDetail/${taskId}`);
    } catch (err) {
      console.error("❌ Error submitting worklog:", err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Worklog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Comment:</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Spent Time (h):</label>
          <input
            type="number"
            value={spentTime}
            onChange={(e) => setSpentTime(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Status Change:</label>
          <select
            value={statusChange}
            onChange={(e) => setStatusChange(e.target.value)}
            className="border p-2 w-full"
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
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Submit Worklog
        </button>
      </form>
    </div>
  );
};

export default WorklogForm;
