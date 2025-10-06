import { useState, useEffect } from "react";

const AIAssistantPage = () => {
  const [step, setStep] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [report, setReport] = useState("");
  const [riskText, setRiskText] = useState("");
  const [riskTasks, setRiskTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, userRes, taskRes] = await Promise.all([
          fetch("https://projectmanegerbackend-1.onrender.com/api/projects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://projectmanegerbackend-1.onrender.com/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://projectmanegerbackend-1.onrender.com/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProjects(await projRes.json());
        setUsers(await userRes.json());
        setTasks(await taskRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const handleFeatureSelect = async (feature) => {
    setSelectedFeature(feature);
    setStep(1);
    setSelectedProject("");
    setSelectedUser("");
    setAiResponse("");
    setReport("");
    setRiskText("");
    setRiskTasks([]);

    if (feature === "managementOverview") {
      // تولید گزارش Management Overview
      setLoading(true);
      try {
        const res = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/ai/report",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to generate report");
        const data = await res.json();
        setReport(data.report || "No report returned");
        setStep(2);
      } catch (err) {
        console.error(err);
        setAiResponse("Failed to generate Management Overview report.");
        setStep(2);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSend = async () => {
    if (
      !selectedProject &&
      ["suggestTasks", "projectRisk", "userStatus"].includes(selectedFeature)
    )
      return alert("Please select a project");
    if (!selectedUser && selectedFeature === "userStatus")
      return alert("Please select a user");

    let message = "";
    switch (selectedFeature) {
      case "suggestTasks":
        message = `Suggest tasks for project "${selectedProject}" with recommended assignments.`;
        break;
      case "projectRisk":
        message = `Analyze project risk for project "${selectedProject}" and highlight tasks at risk.`;
        break;
      case "userStatus":
        const userObj = users.find((u) => u._id === selectedUser);
        message = `Show workload and assigned tasks for ${userObj.firstName} ${userObj.lastName} in project "${selectedProject}".`;
        break;
      default:
        message = "";
    }

    setLoading(true);
    setAiResponse("");
    setReport("");
    setRiskText("");
    setRiskTasks([]);

    try {
      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/ai/assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userMessage: message,
            projectName: selectedProject,
            userId: selectedUser || null,
          }),
        }
      );

      const data = await res.json();
      const responseText =
        data.suggestedTasksText || data.message || "No response";

      if (selectedFeature === "projectRisk") {
        const parts = responseText.split("TASKS:");
        setRiskText(parts[0]?.replace("TEXT_EXPLANATION:", "").trim() || "");
        setRiskTasks(
          parts[1]
            ?.trim()
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean) || []
        );
      } else {
        setAiResponse(responseText);
      }

      setStep(2);
    } catch (err) {
      console.error(err);
      setAiResponse("Error contacting AI assistant.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover text-cyan-50">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>

      {/* Step 0: Feature Selection */}
      {step === 0 && (
        <div className="flex flex-col gap-3 max-w-md">
          <button
            onClick={() => handleFeatureSelect("managementOverview")}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            Generate Management Overview
          </button>
          <button
            onClick={() => handleFeatureSelect("suggestTasks")}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            Suggest New Tasks
          </button>
          <button
            onClick={() => handleFeatureSelect("projectRisk")}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            Analyze Project Risk
          </button>
          <button
            onClick={() => handleFeatureSelect("userStatus")}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            Show user Worklogs
          </button>
        </div>
      )}

      {/* Step 1: Select project/user */}
      {step === 1 && (
        <div className="flex flex-col gap-3 max-w-md">
          {["suggestTasks", "projectRisk", "userStatus"].includes(
            selectedFeature
          ) && (
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="p-2 rounded text-black"
            >
              <option value="">--Select Project--</option>
              {projects.map((p) => (
                <option key={p._id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          {selectedFeature === "userStatus" && (
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="p-2 rounded text-black"
            >
              <option value="">--Select User--</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleSend}
            className="px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:bg-gray-400"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      )}

      {/* Step 2: Show AI Response or Report */}
      {step === 2 && (
        <div className="space-y-4 max-w-3xl">
          {/* Management Overview */}
          {report && (
            <div className="space-y-3">
              {report.split("\n\n").map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white p-4 rounded-xl shadow-md w-full text-left"
                >
                  <pre className="whitespace-pre-wrap">{item}</pre>
                </div>
              ))}
            </div>
          )}

          {/* Project Risk */}
          {selectedFeature === "projectRisk" && (
            <div className="space-y-3">
              {riskText && (
                <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white p-4 rounded-xl shadow-md w-full text-left">
                  <pre className="whitespace-pre-wrap">{riskText}</pre>
                </div>
              )}
              {riskTasks.length > 0 &&
                riskTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white p-4 rounded-xl shadow-md w-full text-left"
                  >
                    <pre className="whitespace-pre-wrap">{task}</pre>
                  </div>
                ))}
            </div>
          )}

          {/* Suggested Tasks & User Worklogs */}
          {["suggestTasks", "userStatus"].includes(selectedFeature) &&
            aiResponse && (
              <div className="space-y-3">
                {aiResponse.split("\n\n").map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white p-4 rounded-xl shadow-md w-full text-left"
                  >
                    <pre className="whitespace-pre-wrap">{item}</pre>
                  </div>
                ))}
              </div>
            )}

          <button
            onClick={() => setStep(0)}
            className="px-4 py-2 bg-sky-500 rounded text-white"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;
