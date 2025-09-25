// WorklogForm.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const WorklogForm = () => {
  const { taskId } = useParams(); // taskId از route
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [spentTime, setSpentTime] = useState("");
  const [statusChange, setStatusChange] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // ثبت Worklog
      const body = { taskId, comment, spentTime, statusChange };
      const res = await fetch("http://localhost:5000/api/worklogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to add worklog");
      const newWorklog = await res.json();

      // آپلود فایل در صورت وجود
      if (file) {
        const formData = new FormData();
        formData.append("worklogId", newWorklog._id);
        formData.append("file", file);

        const fileRes = await fetch(
          "http://localhost:5000/api/attachments/upload",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!fileRes.ok) throw new Error("Failed to upload attachment");
      }

      // بازگشت به TaskDetail بعد از ثبت
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
            required
          >
            <option value="">Select Status</option>
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
