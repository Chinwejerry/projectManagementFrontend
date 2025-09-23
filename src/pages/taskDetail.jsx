import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TaskDetail = () => {
  const { id } = useParams(); // گرفتن taskId از route
  const [task, setTask] = useState(null);
  const [worklogs, setWorklogs] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [statusChange, setStatusChange] = useState("");
  const [spentTime, setSpentTime] = useState("");

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
        setAttachments(data.attachments || []);
      } catch (err) {
        console.error("❌ Error fetching task detail:", err);
      }
    };

    if (id) fetchTaskDetail(); // مطمئن شدن که id تعریف شده
  }, [id]);

  const handleAddWorklog = async () => {
    try {
      const token = localStorage.getItem("token");
      const body = { taskId: id, comment, statusChange, spentTime };
      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/worklogs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error("Failed to add worklog");
      const newWorklog = await res.json();
      setWorklogs([newWorklog, ...worklogs]);
      setComment("");
      setSpentTime("");
      setStatusChange("");
    } catch (err) {
      console.error("❌ Error adding worklog:", err);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("worklogId", worklogs[0]?._id || "");
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/attachments/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to upload attachment");
      const newAttachment = await res.json();
      setAttachments([newAttachment, ...attachments]);
      setFile(null);
    } catch (err) {
      console.error("❌ Error uploading file:", err);
    }
  };

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

      {/* --- Add Worklog --- */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Add Worklog</h2>
        <input
          type="text"
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-1 mr-2"
        />
        <input
          type="number"
          placeholder="Spent time (h)"
          value={spentTime}
          onChange={(e) => setSpentTime(e.target.value)}
          className="border p-1 mr-2 w-24"
        />
        <select
          value={statusChange}
          onChange={(e) => setStatusChange(e.target.value)}
          className="border p-1 mr-2"
        >
          <option value="">Status Change</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={handleAddWorklog} className="btn btn-primary">
          Add Worklog
        </button>
      </div>

      <hr />

      {/* --- Worklogs --- */}
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

      {/* --- Attachments --- */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Attachments</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleFileUpload} className="btn btn-secondary ml-2">
          Upload
        </button>
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
