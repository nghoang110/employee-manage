import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import { useRouter } from "next/router";

interface LeaveRequest {
  _id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function MyLeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchLeaves = async () => {
      try {
        const res = await fetch("http://localhost:4000/leave/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data : []);
      } catch {
        setError("Không thể tải danh sách đơn nghỉ");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [router]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          📄 Đơn nghỉ đã gửi
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : leaves.length === 0 ? (
          <p className="text-gray-600">Bạn chưa gửi đơn nghỉ nào.</p>
        ) : (
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-900 text-left">
              <tr>
                <th className="px-4 py-2 border-b">📅 Từ ngày</th>
                <th className="px-4 py-2 border-b">📅 Đến ngày</th>
                <th className="px-4 py-2 border-b">📝 Lý do</th>
                <th className="px-4 py-2 border-b">📌 Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50 text-gray-900">
                  <td className="px-4 py-2 border-b">
                    {new Date(leave.fromDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {new Date(leave.toDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-2 border-b">{leave.reason}</td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        leave.status
                      )}`}
                    >
                      {leave.status === "pending"
                        ? "⏳ Đang chờ"
                        : leave.status === "approved"
                        ? "✅ Đã duyệt"
                        : "❌ Từ chối"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
