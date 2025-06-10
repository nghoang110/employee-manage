// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Header from "@/components/layout/Header";

// export default function DashboardPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }

//     const decoded: any = parseJwt(token);
//     setUsername(decoded?.username || "Người dùng");
//   }, [router]);

//   const parseJwt = (token: string) => {
//     try {
//       return JSON.parse(atob(token.split(".")[1]));
//     } catch (e) {
//       return null;
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     router.push("/auth/login");
//   };

//   return (
//     <>
//       <Header />
//       <div style={{ padding: 40 }}>
//         <h1>Chào, {username}!</h1>
//         <p>Chào mừng bạn đến với hệ thống quản lý nhân viên.</p>

//         <div style={{ marginTop: 20 }}>
//           <button onClick={() => router.push("/employees")}>
//             Quản lý nhân viên
//           </button>
//           <br />
//           <br />
//           <button onClick={() => router.push("/tasks")}>
//             Quản lý công việc (Admin)
//           </button>
//           <br />
//           <br />
//           <button onClick={() => router.push("/tasks/my")}>
//             Công việc của tôi
//           </button>
//           <br />
//           <br />
//           <button onClick={() => router.push("/attendance/checkin")}>
//             Điểm danh
//           </button>
//           <br />
//           <br />
//           <button onClick={() => router.push("/attendance")}>
//             Xem điểm danh (Admin)
//           </button>
//           <br />
//           <br />
//           <button onClick={handleLogout}>Đăng xuất</button>
//         </div>
//       </div>
//     </>
//   );
// }
