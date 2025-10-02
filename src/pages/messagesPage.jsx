import { useState, useEffect } from "react";
import Modal from "react-modal";
import { ArrowBigLeft } from "lucide-react";

Modal.setAppElement("#root");

const MessagePage = () => {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox");
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("direct");
  const [content, setContent] = useState("");
  const [projectId, setProjectId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [role] = useState(localStorage.getItem("role") || "");
  const token = localStorage.getItem("token");

  // Fetch inbox & sent messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const inboxRes = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/messages/inbox",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!inboxRes.ok)
        throw new Error(`Inbox fetch failed: ${inboxRes.status}`);
      const inboxData = await inboxRes.json();
      setInbox(Array.isArray(inboxData) ? inboxData : []);

      if (role === "admin") {
        const sentRes = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/messages/sent",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!sentRes.ok)
          throw new Error(`Sent fetch failed: ${sentRes.status}`);
        const sentData = await sentRes.json();
        setSent(Array.isArray(sentData) ? sentData : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects and users for modal
  const fetchProjectsAndUsers = async () => {
    try {
      if (role === "admin") {
        const projectsRes = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/projects",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const projectsData = projectsRes.ok ? await projectsRes.json() : [];
        setProjects(Array.isArray(projectsData) ? projectsData : []);

        const usersRes = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const usersData = usersRes.ok ? await usersRes.json() : [];
        setUsers(Array.isArray(usersData) ? usersData : []);
      } else {
        const usersRes = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/users/onlyUsers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const usersData = usersRes.ok ? await usersRes.json() : [];
        setUsers(Array.isArray(usersData) ? usersData : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchProjectsAndUsers();
  }, []);

  async function handleSendMessage(e) {
    e.preventDefault();
    try {
      if (role === "user") return;

      let url = "https://projectmanegerbackend-1.onrender.com/api/messages/";
      const body = { content };

      if (messageType === "general") url += "general";
      else if (messageType === "project") {
        url += "project";
        body.projectId = projectId;
      } else if (messageType === "direct") {
        url += "direct";
        body.recipientId = recipientId;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setContent("");
      setProjectId("");
      setRecipientId("");
      setModalOpen(false);
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800">
      <span
        className="p-4 text-cyan-50 flex items-start"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="flex justify-center flex-col space-y-3 items-center min-h-screen bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover p-4">
        <h1 className="text-2xl font-bold mb-4 text-sky-700">Messages</h1>

        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "inbox" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("inbox")}
          >
            Inbox
          </button>
          {role === "admin" && (
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "sent" ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
              onClick={() => setActiveTab("sent")}
            >
              Sent Messages
            </button>
          )}
          {role === "admin" && (
            <button
              className="px-4 py-2 rounded bg-green-600 text-white"
              onClick={() => setModalOpen(true)}
            >
              Create Message
            </button>
          )}
        </div>

        {/* Inbox */}
        {activeTab === "inbox" &&
          (inbox.length ? (
            <ul className="space-y-2">
              {inbox.map((msg) => (
                <li key={msg._id} className="border p-2 rounded">
                  <strong>From:</strong> {msg.sender?.firstName || "Unknown"}{" "}
                  {msg.sender?.lastName || ""} <br />
                  <strong>Type:</strong> {msg.type} <br />
                  <strong>Content:</strong> {msg.content} <br />
                  {msg.type === "project" && (
                    <small>
                      Project:{" "}
                      {msg.project?.name ||
                        projects.find(
                          (p) => p._id === (msg.project?._id || msg.project)
                        )?.name ||
                        "Unknown"}
                    </small>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No inbox messages</p>
          ))}

        {/* Sent */}
        {activeTab === "sent" &&
          role === "admin" &&
          (sent.length ? (
            <ul className="space-y-2">
              {sent.map((msg) => {
                const recipientName = msg.recipient
                  ? `${msg.recipient?.firstName || ""} ${
                      msg.recipient?.lastName || ""
                    }`.trim()
                  : "Unknown";

                const projectName =
                  msg.project?.name ||
                  projects.find(
                    (p) => p._id === (msg.project?._id || msg.project)
                  )?.name ||
                  "Unknown";

                let toDisplay = "All Users";
                if (msg.type === "direct") toDisplay = recipientName;
                else if (msg.type === "project")
                  toDisplay = `Project: ${projectName}`;

                return (
                  <li key={msg._id} className="border p-2 rounded">
                    <strong>To:</strong> {toDisplay} <br />
                    <strong>Type:</strong> {msg.type} <br />
                    <strong>Content:</strong> {msg.content}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No sent messages</p>
          ))}

        {/* Modal */}
        {role === "admin" && (
          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            className="p-6 rounded shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
          >
            <h2 className="text-xl font-bold mb-4 text-white">New Message</h2>
            <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
              <select
                className="border p-2 rounded"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
              >
                <option value="general">General</option>
                <option value="project">Project</option>
                <option value="direct">Direct</option>
              </select>

              {messageType === "project" && (
                <select
                  className="border p-2 rounded"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                >
                  <option value="">-- Select Project --</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}

              {messageType === "direct" && (
                <select
                  className="border p-2 rounded"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  required
                >
                  <option value="">-- Select User --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </select>
              )}

              <textarea
                className="border p-2 rounded"
                placeholder="Message content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded"
              >
                Send Message
              </button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
