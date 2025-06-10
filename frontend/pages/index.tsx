import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/layout/Header";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    const decoded: any = parseJwt(token);
    setUsername(decoded?.username || "Người dùng");
    setRole(decoded?.role || "");
    setLoading(false);
  }, [router]);

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const menuItems = [
    {
      title: "Danh sách nhân viên",
      description: "Xem và quản lý thông tin nhân viên",
      icon: "👥",
      route: "/employees",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      visible: role === "admin",
      adminOnly: true,
    },
    {
      title: "Quản lý công việc",
      description: "Phân công và theo dõi tiến độ công việc",
      icon: "📋",
      route: "/tasks",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700",
      visible: role === "admin",
      adminOnly: true,
    },
    {
      title: "Công việc của tôi",
      description: "Xem và cập nhật công việc được giao",
      icon: "✅",
      route: "/tasks/my",
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
      visible: true,
    },
    {
      title: "Điểm danh",
      description: "Check-in/Check-out hàng ngày",
      icon: "🕒",
      route: "/attendance/checkin",
      gradient: "from-orange-500 to-orange-600",
      hoverGradient: "from-orange-600 to-orange-700",
      visible: true,
    },
    {
      title: "Báo cáo điểm danh",
      description: "Xem báo cáo và thống kê điểm danh",
      icon: "📊",
      route: "/attendance",
      gradient: "from-teal-500 to-teal-600",
      hoverGradient: "from-teal-600 to-teal-700",
      visible: role === "admin",
      adminOnly: true,
    },
    {
      title: "Đơn xin nghỉ phép",
      description: "Nộp và quản lý đơn xin nghỉ phép",
      icon: "📝",
      route: "/leave/apply",
      gradient: "from-teal-500 to-teal-600",
      hoverGradient: "from-teal-600 to-teal-700",
      visible: true,
      // adminOnly: true,
    },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg
                className="animate-spin w-8 h-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Đang tải...</h3>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full -mr-16 -mt-16 opacity-10"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 mr-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3M7 19h10"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Xin chào,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {username}
                    </span>
                    ! 👋
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">
                    Chào mừng bạn đến với hệ thống quản lý doanh nghiệp
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Vai trò</p>
                      <p className="text-xl font-bold capitalize">
                        {role === "admin" ? "Quản trị viên" : "Nhân viên"}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Trạng thái</p>
                      <p className="text-xl font-bold">Hoạt động</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Hôm nay</p>
                      <p className="text-xl font-bold">
                        {new Date().toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {menuItems
              .filter((item) => item.visible)
              .map((item, index) => (
                <div
                  key={index}
                  onClick={() => router.push(item.route)}
                  className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group relative overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  ></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`bg-gradient-to-r ${item.gradient} rounded-lg p-3 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      {item.adminOnly && (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="text-sm">Truy cập</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Logout Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-lg p-3 mr-4">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Đăng xuất khỏi hệ thống
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Kết thúc phiên làm việc hiện tại
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
