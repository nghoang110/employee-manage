import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import GroupedTaskTable from "../../components/tasks/GroupedTaskTable";

type GroupedTask = {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  assigned: { _id?: string; name: string }[];
};

export default function GroupedTasksPage() {
  const [groupedTasks, setGroupedTasks] = useState<GroupedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "urgent" | "normal" | "overdue">(
    "all"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/tasks/grouped", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) =>
        res.ok ? res.json() : res.json().then((err) => Promise.reject(err))
      )
      .then((data) => {
        setGroupedTasks(Array.isArray(data) ? data : data.tasks || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Không thể tải danh sách công việc");
        setLoading(false);
      });
  }, []);

  const getStatus = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days < 0 ? "overdue" : days <= 3 ? "urgent" : "normal";
  };

  const filtered = groupedTasks.filter((task) => {
    const matchSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.assigned.some((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    const matchFilter = filter === "all" || getStatus(task.deadline) === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: groupedTasks.length,
    urgent: groupedTasks.filter((t) => getStatus(t.deadline) === "urgent")
      .length,
    normal: groupedTasks.filter((t) => getStatus(t.deadline) === "normal")
      .length,
    overdue: groupedTasks.filter((t) => getStatus(t.deadline) === "overdue")
      .length,
  };

  const filters = [
    { key: "all", label: "Tất cả", emoji: "📋", count: counts.all },
    { key: "urgent", label: "Gấp", emoji: "⚡", count: counts.urgent },
    { key: "normal", label: "Bình thường", emoji: "✅", count: counts.normal },
    { key: "overdue", label: "Quá hạn", emoji: "⏰", count: counts.overdue },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Công việc đã giao
                </h1>
                <p className="text-gray-600">
                  Quản lý và theo dõi tiến độ công việc
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              {filters.slice(0, 3).map((f) => (
                <div
                  key={f.key}
                  className="bg-white rounded-lg px-3 py-2 shadow-sm border"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        f.key === "all"
                          ? "bg-blue-500"
                          : f.key === "urgent"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600">{f.label}</span>
                    <span
                      className={`font-bold ${
                        f.key === "all"
                          ? "text-blue-600"
                          : f.key === "urgent"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {f.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Filter */}
          {!loading && !error && groupedTasks.length > 0 && (
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm công việc hoặc người thực hiện..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  {filters.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key as any)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === f.key
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {f.emoji} {f.label} {f.count > 0 && `(${f.count})`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đang tải...
              </h3>
              <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔄 Thử lại
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {search || filter !== "all"
                  ? "Không tìm thấy kết quả"
                  : "Chưa có công việc"}
              </h3>
              <p className="text-gray-500 mb-4">
                {search || filter !== "all"
                  ? "Thử thay đổi từ khóa hoặc bộ lọc"
                  : "Các công việc sẽ xuất hiện khi được tạo"}
              </p>
              {(search || filter !== "all") && (
                <div className="flex gap-2 justify-center">
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="px-3 py-2 bg-gray-100 rounded-lg text-sm"
                    >
                      🔍 Xóa tìm kiếm
                    </button>
                  )}
                  {filter !== "all" && (
                    <button
                      onClick={() => setFilter("all")}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm"
                    >
                      📋 Xem tất cả
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <GroupedTaskTable groupedTasks={filtered} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
