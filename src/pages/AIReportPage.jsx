import { useState } from "react";

export default function AIReport() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateReport = async () => {
    setLoading(true);
    setError("");
    setReport("");

    const token = localStorage.getItem("token"); // توکن JWT برای احراز هویت یوزر

    try {
      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/ai/report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // فقط برای بک‌اند
          },
        }
      );

      if (!res.ok) throw new Error("Failed to generate report");

      const data = await res.json();
      setReport(data.report || "No report returned");
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI report. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">AI Report</h1>

      <button
        onClick={generateReport}
        disabled={loading}
        className="px-4 py-2 bg-sky-600 rounded hover:bg-sky-500 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate AI Report"}
      </button>

      {error && <div className="mt-4 p-3 bg-red-600 rounded">{error}</div>}

      {report && (
        <div className="mt-6 bg-slate-900 p-4 rounded-xl shadow max-h-[70vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Report:</h2>
          <pre className="whitespace-pre-wrap">{report}</pre>
        </div>
      )}
    </div>
  );
}
