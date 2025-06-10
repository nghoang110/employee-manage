import { useState } from "react";
import Header from "../../components/layout/Header";
import { useRouter } from "next/router";

export default function ApplyLeavePage() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) return router.push("/auth/login");

    try {
      const res = await fetch("http://localhost:4000/leave", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromDate, toDate, reason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi đơn thất bại");

      setMessage("🎉 Gửi đơn xin nghỉ thành công!");
      setFromDate("");
      setToDate("");
      setReason("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <main className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          📝 Gửi đơn xin nghỉ
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Từ ngày
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
              className="mt-1 w-full border px-3 py-2 rounded shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Đến ngày
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
              className="mt-1 w-full border px-3 py-2 rounded shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lý do nghỉ
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="mt-1 w-full border px-3 py-2 rounded shadow-sm"
              placeholder="Nhập lý do xin nghỉ phép..."
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Gửi đơn
          </button>
        </form>
      </main>
    </div>
  );
}
