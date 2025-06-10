import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EmployeeTable from "../../components/employees/EmployeeTable";
import CreateEmployeeForm from "../../components/employees/CreateEmployeeForm";
import Header from "../../components/layout/Header";

interface Employee {
  _id: string;
  name: string;
  position: string;
  department: string;
  email: string;
}

export default function EmployeeListPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
  });

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError("Không thể lấy danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchEmployees();
  }, [router]);

  const openEdit = (emp: Employee) => {
    setSelected(emp);
    setForm({
      name: emp.name,
      email: emp.email,
      position: emp.position,
      department: emp.department,
    });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:4000/employees/${selected._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Cập nhật thất bại");
      setShowModal(false);
      setSelected(null);
      fetchEmployees();
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (empId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá nhân viên này?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:4000/employees/${empId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xoá thất bại");
      fetchEmployees();
    } catch {
      alert("Xoá thất bại!");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-3 mr-4">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Quản lý nhân viên
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Thêm mới và quản lý thông tin nhân viên trong hệ thống
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {employees.length}
                    </div>
                    <div className="text-sm text-gray-500">Tổng nhân viên</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        new Set(
                          employees.map((emp) => emp.department).filter(Boolean)
                        ).size
                      }
                    </div>
                    <div className="text-sm text-gray-500">Phòng ban</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-xl shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-red-400 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    Có lỗi xảy ra
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => setError("")}
                  className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <CreateEmployeeForm onEmployeeCreated={fetchEmployees} />

          <EmployeeTable
            employees={employees}
            onEdit={openEdit}
            onDelete={handleDelete}
          />

          {showModal && selected && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
                <h2 className="text-xl text-black font-bold mb-4">
                  ✏️ Cập nhật nhân viên
                </h2>
                <input
                  className="w-full border px-4 py-2 mb-2 rounded"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Họ tên"
                />
                <input
                  className="w-full border px-4 py-2 mb-2 rounded"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                />
                <input
                  className="w-full border px-4 py-2 mb-2 rounded"
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  placeholder="Chức vụ"
                />
                <input
                  className="w-full border px-4 py-2 mb-4 rounded"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  placeholder="Phòng ban"
                />

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 text-black py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Huỷ
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
