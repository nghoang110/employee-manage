import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import GroupedTaskTable from "../../components/tasks/GroupedTaskTable";

interface GroupedTask {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  assigned: { name: string }[];
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<GroupedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/tasks/my-tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Lỗi ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Lỗi không xác định");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Tiêu đề */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-1">
            📌 Công việc của tôi
          </h1>
          <p className="text-gray-600">
            Hiển thị công việc bạn được giao, bao gồm cả công việc nhóm.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 text-red-600 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Đang tải công việc...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">Bạn chưa được giao công việc nào.</p>
        ) : (
          <GroupedTaskTable groupedTasks={tasks} />
        )}
      </main>
    </div>
  );
}
