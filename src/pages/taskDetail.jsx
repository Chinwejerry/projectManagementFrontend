// taskDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TaskDetail = () => {
  const { id } = useParams(); // taskId
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [worklogs, setWorklogs] = useState([]);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://projectmanegerbackend-1.onrender.com/api/taskDetail/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch task detail");
        const data = await res.json();
        setTask(data.task || null);
        setWorklogs(data.worklogs || []);
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

      <button
        onClick={() => navigate(`/tasks/${id}/worklog`)}
        className="btn btn-primary"
      >
        Add Worklog
      </button>

      <hr />

      {/* Worklogs */}
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

            {/* Attachments */}
            {w.attachments && w.attachments.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold">Attachments:</h3>
                {w.attachments.map((a) => (
                  <div key={a._id} className="flex items-center space-x-2">
                    <span>{a.fileName}</span>
                    {/* Preview */}
                    <a
                      href={`https://projectmanegerbackend-1.onrender.com/api/attachments/preview/${a._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Preview
                    </a>
                    {/* Download */}
                    <a
                      href={`https://projectmanegerbackend-1.onrender.com/api/attachments/download/${a._id}`}
                      className="text-green-500 underline"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetail;
