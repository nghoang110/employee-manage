import { useState } from "react";
import CommentSection from "../comments/CommentSection";

interface GroupedTask {
  title: string;
  description: string;
  deadline: string;
  assigned: { name: string }[];
  _id?: string; // để gán vào modal nếu cần
}

interface Props {
  groupedTasks: GroupedTask[];
}

export default function GroupedTaskTable({ groupedTasks }: Props) {
  const [selected, setSelected] = useState<GroupedTask | null>(null);

  return (
    <>
      <table className="w-full border rounded overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="bg-green-100 text-blue-500 text-sm font-semibold px-3 py-1 rounded-full mr-1 text-left">
              📝 Tên công việc
            </th>
            <th className="bg-green-100 text-blue-500 text-sm font-semibold px-3 py-1 rounded-full mr-1 text-left">
              📅 Deadline
            </th>
            <th className="bg-green-100 text-blue-500 text-sm font-semibold px-3 py-1 rounded-full mr-1 text-left">
              👥 Người nhận
            </th>
            <th className="bg-green-100 text-blue-500 text-sm font-semibold px-3 py-1 rounded-full mr-1 text-left">
              Bình luận
            </th>
          </tr>
        </thead>
        <tbody>
          {groupedTasks.map((task, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border font-semibold text-gray-900 mb-1">
                {task.title}
              </td>

              <td className="px-4 py-2 border text-gray-600">
                {new Date(task.deadline).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-4 py-2 border">
                {task.assigned.map((user, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-red-200 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mr-1"
                  >
                    {user.name}
                  </span>
                ))}
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => setSelected(task)}
                  className="inline-flex mr-1 items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition ease-in-out duration-150"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal hiển thị bình luận */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-xl relative">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📝 {selected.title}
            </h2>
            <p className=" font-semibold text-gray-400  mb-2">
              Deadline:{" "}
              {new Date(selected.deadline).toLocaleDateString("vi-VN")}
            </p>
            {selected._id ? (
              <CommentSection taskId={selected._id} />
            ) : (
              <p className="text-gray-400 italic">
                Không thể bình luận vì thiếu ID.
              </p>
            )}

            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
