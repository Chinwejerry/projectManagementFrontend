import { useState, useEffect } from "react";

const AIAssistantPage = () => {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [createdTasks, setCreatedTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          fetch("https://projectmanegerbackend-1.onrender.com/api/projects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://projectmanegerbackend-1.onrender.com/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProjects(await projectsRes.json());
        setUsers(await usersRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjectsAndUsers();
  }, [token]);

  const handleSend = async () => {
    if (!userMessage.trim()) return;
    setLoading(true);
    setAiResponse("");
    setCreatedTasks([]);

    try {
      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/ai/assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userMessage }),
        }
      );
      const data = await res.json();
      setAiResponse(data.message);

      const tasksWithNames = data.createdTasks.map((task) => {
        const user = users.find((u) => u._id === task.assignedTo);
        const project = projects.find((p) => p._id === task.projectId);
        return {
          ...task,
          assignedUserName: user
            ? `${user.firstName} ${user.lastName}`
            : "Unassigned",
          projectName: project ? project.name : "Unknown Project",
        };
      });
      setCreatedTasks(tasksWithNames);
    } catch (err) {
      console.error(err);
      setAiResponse("Error contacting AI assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover text-cyan-50">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>

      <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 rounded-lg shadow flex flex-col gap-4 max-w-3xl">
        <textarea
          rows={4}
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask AI to suggest tasks, answer questions, or recommend resource allocation..."
          className="p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-100 text-black w-full"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="self-start px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>

      {aiResponse && (
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-4 rounded-lg shadow max-w-3xl">
          <h2 className="text-lg font-semibold mb-2 text-cyan-900">
            AI Response
          </h2>
          <pre className="whitespace-pre-wrap text-black">{aiResponse}</pre>
        </div>
      )}

      {createdTasks.length > 0 && (
        <div className="flex flex-col gap-4 max-w-3xl">
          <h2 className="text-xl font-semibold text-cyan-900">
            Suggested/Created Tasks
          </h2>
          {createdTasks.map((task) => (
            <div
              key={task._id}
              className="bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300 p-4 rounded-lg shadow"
            >
              <p>
                <strong>Title:</strong> {task.title}
              </p>
              <p>
                <strong>Project:</strong> {task.projectName}
              </p>
              <p>
                <strong>Assigned To:</strong> {task.assignedUserName}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Estimated Hours:</strong> {task.estimatedDurationHours}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;
