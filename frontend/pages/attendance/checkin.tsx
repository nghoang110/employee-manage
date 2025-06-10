import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/layout/Header";

export default function CheckInPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:4000/attendance/check-in", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Lỗi điểm danh");

      setStatus("✅ Điểm danh thành công!");
    } catch (err: any) {
      setStatus("❌ " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Điểm danh hôm nay
          </h1>
          <p className="text-gray-600">
            Thực hiện điểm danh để ghi nhận thời gian làm việc của bạn
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Time Display */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
              <div className="mb-4">
                <div className="text-5xl font-bold mb-2">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xl opacity-90">
                  {formatDate(currentTime)}
                </div>
              </div>

              {/* Clock Icon */}
              <div className="flex justify-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Check-in Section */}
            <div className="p-8">
              {/* Check-in Button */}
              <div className="text-center mb-6">
                <button
                  onClick={handleCheckIn}
                  disabled={isLoading}
                  className={`
                    inline-flex items-center justify-center space-x-3 
                    px-8 py-4 rounded-xl text-lg font-semibold
                    transition-all duration-200 transform hover:scale-105
                    ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl"
                    }
                    text-white
                  `}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Bấm để điểm danh</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Message */}
              {status && (
                <div className="text-center">
                  <div
                    className={`
                      inline-flex items-center space-x-2 px-6 py-3 rounded-lg
                      ${
                        status.includes("✅")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }
                    `}
                  >
                    <span className="text-lg font-medium">{status}</span>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Hướng dẫn điểm danh
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    Nhấn nút "Bấm để điểm danh" để ghi nhận thời gian hiện tại
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    Mỗi ngày chỉ được điểm danh một lần
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    System sẽ tự động ghi nhận thời gian chính xác
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
