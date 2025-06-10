import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import { useRouter } from "next/router";

interface LeaveRequest {
  _id: string;
  employee: { name: string; email: string };
  fromDate: string;
  toDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export default function ManageLeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchLeaves = async () => {
    try {
      const res = await fetch("http://localhost:4000/leave", {
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

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchLeaves();
  }, [router, token]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`http://localhost:4000/leave/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      fetchLeaves();
    } catch {
      alert("Không thể cập nhật trạng thái");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h1 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📋</span>
              Quản lý đơn nghỉ phép
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 m-4 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải...</div>
          ) : leaves.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Chưa có đơn nghỉ nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Nhân viên
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Thời gian
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Lý do
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {leave.employee?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {leave.employee?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="text-xs">
                          {new Date(leave.fromDate).toLocaleDateString("vi-VN")}
                          <br />
                          {new Date(leave.toDate).toLocaleDateString("vi-VN")}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                        {leave.reason}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            leave.status
                          )}`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => updateStatus(leave._id, "approved")}
                            disabled={leave.status === "approved"}
                            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => updateStatus(leave._id, "rejected")}
                            disabled={leave.status === "rejected"}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Từ chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
