import { useState } from "react";

interface Props {
  onEmployeeCreated: () => void;
}

// Định nghĩa lớp CSS chung cho các input để dễ quản lý và nhất quán
const inputBaseClasses =
  "w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-150 ease-in-out sm:text-sm";

// Reusable InputGroup Component
interface InputGroupProps {
  id: string;
  label: string;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({
  id,
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      className={inputBaseClasses}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default function CreateEmployeeForm({ onEmployeeCreated }: Props) {
  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:4000/employees/create-with-user",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi tạo nhân viên");

      setForm({
        name: "",
        position: "",
        department: "",
        email: "",
        username: "",
        password: "",
      });

      onEmployeeCreated();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Tạo nhân viên mới
      </h2>
      {error && (
        <p className="bg-red-50 text-red-700 p-3 rounded-md text-sm font-medium">
          {error}
        </p>
      )}

      <InputGroup
        id="name"
        label="Họ tên"
        type="text"
        name="name"
        placeholder="Ví dụ: Nguyễn Văn A"
        value={form.name}
        onChange={handleChange}
        required
      />
      <InputGroup
        id="position"
        label="Chức vụ"
        type="text"
        name="position"
        placeholder="Ví dụ: Nhân viên Marketing"
        value={form.position}
        onChange={handleChange}
      />
      <InputGroup
        id="department"
        label="Phòng ban"
        type="text"
        name="department"
        placeholder="Ví dụ: Phòng Marketing"
        value={form.department}
        onChange={handleChange}
      />
      <InputGroup
        id="email"
        label="Email"
        type="email"
        name="email"
        placeholder="vidu@congty.com"
        value={form.email}
        onChange={handleChange}
      />

      <hr className="border-t border-gray-200 !my-6" />
      <h3 className="text-lg font-medium text-gray-800">Tài khoản đăng nhập</h3>

      <InputGroup
        id="username"
        label="Tên đăng nhập"
        type="text"
        name="username"
        placeholder="nguyenvana"
        value={form.username}
        onChange={handleChange}
        required
      />
      <InputGroup
        id="password"
        label="Mật khẩu"
        type="password"
        name="password"
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange}
        required
      />

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150"
        >
          Tạo nhân viên
        </button>
      </div>
    </form>
  );
}
