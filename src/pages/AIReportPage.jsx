import { useState } from "react";
import { ArrowBigLeft } from "lucide-react";

export default function AIReport() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateReport = async () => {
    setLoading(true);
    setError("");
    setReport("");

    const token = localStorage.getItem("token");

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
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI report. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800">
      <span
        className="p-4 text-cyan-50 flex items-start"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="flex justify-center flex-col space-y-3 items-center min-h-screen bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">AI Report</h1>

        <button
          onClick={generateReport}
          disabled={loading}
          className="px-4 py-2 bg-sky-600 rounded hover:bg-sky-500 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate AI Report"}
        </button>

        {error && <div className="mt-4 p-3 bg-red-600 rounded">{error}</div>}

        {report && (
          <div className="mt-6 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 rounded-xl shadow max-h-[70vh] overflow-y-auto text-sky-100">
            <h2 className="text-lg font-semibold mb-2">Report:</h2>
            <pre className="whitespace-pre-wrap">{report}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
