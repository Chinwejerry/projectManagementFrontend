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

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const inboxRes = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/messages/inbox",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const inboxData = await inboxRes.json();
      setInbox(Array.isArray(inboxData) ? inboxData : []);

      if (role === "admin") {
        const sentRes = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/messages/sent",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sentData = await sentRes.json();
        setSent(Array.isArray(sentData) ? sentData : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSendMessage = async (e) => {
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
  };

  if (loading) return <p className="p-4 text-white">Loading messages...</p>;

  return (
    <div>
      <span
        className="p-4 w-screen text-cyan-50 flex items-start cursor-pointer bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover p-4 min-h-screen text-cyan-50">
        <h1 className="text-3xl font-bold text-sky-800 mb-4">Messages</h1>

        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "inbox" ? "bg-sky-700 text-white" : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("inbox")}
          >
            Inbox
          </button>
          {role === "admin" && (
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "sent" ? "bg-sky-600 text-white" : "bg-gray-300"
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
              New Message
            </button>
          )}
        </div>
        {/* Inbox */}
        {activeTab === "inbox" && (
          <ul className="space-y-3">
            {inbox.length ? (
              inbox.map((msg) => (
                <li
                  key={msg._id}
                  className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white p-4 rounded-xl shadow-md w-full text-left"
                >
                  <p>
                    <strong>From:</strong> {msg.sender?.firstName || "Unknown"}{" "}
                    {msg.sender?.lastName || ""}
                  </p>
                  <p>
                    <strong>Type:</strong> {msg.type}
                  </p>
                  <p>
                    <strong>Content:</strong> {msg.content}
                  </p>
                  {msg.type === "project" && (
                    <p>
                      <strong>Project:</strong>{" "}
                      {projects.find(
                        (p) =>
                          p._id ===
                          (msg.project?._id ||
                            (typeof msg.project === "string"
                              ? msg.project
                              : ""))
                      )?.name || "Unknown"}
                    </p>
                  )}
                </li>
              ))
            ) : (
              <p className="text-white">No inbox messages</p>
            )}
          </ul>
        )}

        {/* Sent */}
        {activeTab === "sent" && role === "admin" && (
          <ul className="space-y-3">
            {sent.length ? (
              sent.map((msg) => {
                let toDisplay = "Unknown";
                if (msg.type === "direct" && msg.recipient) {
                  toDisplay = `${msg.recipient.firstName || ""} ${
                    msg.recipient.lastName || ""
                  }`.trim();
                } else if (msg.type === "project") {
                  toDisplay =
                    projects.find(
                      (p) =>
                        p._id ===
                        (msg.project?._id ||
                          (typeof msg.project === "string" ? msg.project : ""))
                    )?.name || "Unknown";
                } else if (msg.type === "general") {
                  toDisplay = "All Users";
                }

                return (
                  <li
                    key={msg._id}
                    className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white p-4 rounded-xl shadow-md w-full text-left"
                  >
                    <p>
                      <strong>To:</strong> {toDisplay}
                    </p>
                    <p>
                      <strong>Type:</strong> {msg.type}
                    </p>
                    <p>
                      <strong>Content:</strong> {msg.content}
                    </p>
                  </li>
                );
              })
            ) : (
              <p className="text-white">No sent messages</p>
            )}
          </ul>
        )}

        {/* Modal */}
        {role === "admin" && (
          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow-lg rounded-lg p-6 w-80 mx-auto mt-20 flex flex-col gap-4 text-left"
            overlayClassName="fixed inset-0 bg-opacity-50 bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover flex justify-start items-start"
          >
            <h2 className="text-2xl font-bold text-white mb-4">New Message</h2>
            <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
              <select
                className="border border-white text-white bg-transparent p-2 rounded"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
              >
                <option value="general">General</option>
                <option value="project">Project</option>
                <option value="direct">Direct</option>
              </select>

              {messageType === "project" && (
                <select
                  className="border border-white text-white bg-transparent p-2 rounded"
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
                <div className="flex flex-col max-h-40 overflow-y-auto border p-2 rounded bg-white text-black">
                  {users.map((u) => (
                    <label key={u._id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="recipient"
                        value={u._id}
                        checked={recipientId === u._id}
                        onChange={() => setRecipientId(u._id)}
                      />
                      {u.firstName} {u.lastName}
                    </label>
                  ))}
                </div>
              )}

              <textarea
                className="border border-white p-2 rounded bg-white text-black h-32 resize-none"
                placeholder="Message content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />

              <button
                type="submit"
                className="bg-sky-700 text-white py-2 rounded hover:bg-blue-700"
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
//edit
