import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi đăng ký");

      router.push("/auth/login"); // ← cập nhật đường dẫn mới
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 flex flex-col items-center justify-center p-4 selection:bg-teal-300 selection:text-white">
      {/* Optional: Placeholder for a logo */}
      {/* <div className="text-center mb-6">
        <span className="text-5xl font-extrabold text-white tracking-tight filter drop-shadow-lg">
          YourLogo
        </span>
      </div> */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 sm:p-10">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 mb-10">
          Đăng ký
        </h1>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="usernameReg" className="sr-only">
              Tài khoản
            </label>
            <input
              id="usernameReg"
              type="text"
              placeholder="Tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 ease-in-out"
              required
            />
          </div>

          <div>
            <label htmlFor="passwordReg" className="sr-only">
              Mật khẩu
            </label>
            <input
              id="passwordReg"
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 ease-in-out"
              required
            />
          </div>

          <div>
            <label htmlFor="roleReg" className="sr-only">
              Vai trò
            </label>
            <select
              id="roleReg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 ease-in-out appearance-none" // appearance-none để có thể tùy chỉnh thêm mũi tên nếu muốn
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {/* Để tùy chỉnh mũi tên cho select, bạn có thể cần thêm một div bọc và một SVG icon */}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Đăng ký
          </button>

          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm transition-all duration-300 ease-in-out"
              role="alert"
            >
              <p className="font-semibold">Lỗi</p>
              <p>{error}</p>
            </div>
          )}
        </form>
        <p className="text-center text-sm text-gray-500 mt-8">
          Đã có tài khoản?{" "}
          <a
            href="/auth/login"
            className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-300"
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
