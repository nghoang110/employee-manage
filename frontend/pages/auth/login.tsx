import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi đăng nhập");

      localStorage.setItem("token", data.token);
      router.push("/"); // chuyển sang trang chính
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-4 selection:bg-purple-300 selection:text-white">
      {/* Optional: Placeholder for a logo */}
      {/* <div className="text-center mb-6">
        <span className="text-5xl font-extrabold text-white tracking-tight filter drop-shadow-lg">
          YourLogo
        </span>
      </div> */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 sm:p-10">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-10">
          Đăng nhập
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">
              Tài khoản
            </label>
            <input
              id="username"
              type="text"
              placeholder="Tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Đăng nhập
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
          Chưa có tài khoản?{" "}
          <a
            href="/auth/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
