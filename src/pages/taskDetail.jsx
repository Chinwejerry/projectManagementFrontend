// taskDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TaskDetail = () => {
  const { id } = useParams(); // taskId از route
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [worklogs, setWorklogs] = useState([]);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/taskDetail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch task detail");
        const data = await res.json();
        setTask(data.task || null);
        setWorklogs(data.worklogs || []);
        setAttachments(data.attachments || []);
      } catch (err) {
        console.error("❌ Error fetching task detail:", err);
      }
    };
    if (id) fetchTaskDetail();
  }, [id]);

  if (!task) return <p>Loading task...</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p>{task.description}</p>
      <p>
        Assigned To:{" "}
        {task.assignedTo
          ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
          : "Unassigned"}{" "}
        | Status: {task.status} | Priority: {task.priority}
      </p>
      <p>Project: {task.projectId?.name || "No project"}</p>

      <hr />

      {/* دکمه رفتن به صفحه ثبت Worklog */}
      <button
        onClick={() => navigate(`/tasks/${id}/worklog`)}
        className="btn btn-primary"
      >
        Add Worklog
      </button>

      <hr />

      {/* نمایش Worklogهای ثبت شده */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Worklogs</h2>
        {worklogs.length === 0 && <p>No worklogs yet.</p>}
        {worklogs.map((w) => (
          <div key={w._id} className="border p-2 mb-2">
            <p>
              <strong>
                {w.user
                  ? `${w.user.firstName} ${w.user.lastName}`
                  : "Unknown User"}
              </strong>{" "}
              ({w.user?.email || "No email"})
            </p>
            <p>Comment: {w.comment}</p>
            <p>
              Spent Time: {w.spentTime}h | Status: {w.statusChange}
            </p>
          </div>
        ))}
      </div>

      <hr />

      {/* نمایش Attachments */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Attachments</h2>
        {attachments.length === 0 && <p>No attachments yet.</p>}
        {attachments.map((a) => (
          <div key={a._id} className="border p-2 mb-2">
            <p>
              <strong>
                {a.uploadedBy
                  ? `${a.uploadedBy.firstName} ${a.uploadedBy.lastName}`
                  : "Unknown"}
              </strong>{" "}
              ({a.uploadedBy?.email || "No email"})
            </p>
            <a href={a.fileUrl} target="_blank" rel="noopener noreferrer">
              {a.fileName}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetail;
