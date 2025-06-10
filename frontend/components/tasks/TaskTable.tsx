interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  assignedTo?: {
    name: string;
  };
}

interface Props {
  tasks: Task[];
  showAssignedTo?: boolean;
}

export default function TaskTable({ tasks, showAssignedTo = true }: Props) {
  const getDeadlineStatus = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return {
        status: "overdue",
        text: "Quá hạn",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "⚠️",
      };
    if (diffDays === 0)
      return {
        status: "today",
        text: "Hôm nay",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: "🔥",
      };
    if (diffDays <= 3)
      return {
        status: "urgent",
        text: `${diffDays} ngày`,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏰",
      };
    return {
      status: "normal",
      text: `${diffDays} ngày`,
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "✅",
    };
  };

  const getPriorityColor = (deadline: string) => {
    const status = getDeadlineStatus(deadline);
    switch (status.status) {
      case "overdue":
        return "border-l-red-500";
      case "today":
        return "border-l-orange-500";
      case "urgent":
        return "border-l-yellow-500";
      default:
        return "border-l-green-500";
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có công việc nào
          </h3>
          <p className="text-gray-500">
            Các công việc sẽ hiển thị ở đây khi được tạo
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>Tên công việc</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  <span>Mô tả</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Deadline</span>
                </div>
              </th>
              {showAssignedTo && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Người nhận</span>
                  </div>
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
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
                  <span>Trạng thái</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => {
              const deadlineInfo = getDeadlineStatus(task.deadline);
              return (
                <tr
                  key={task._id}
                  className={`hover:bg-gray-50 transition-all duration-200 border-l-4 ${getPriorityColor(
                    task.deadline
                  )}`}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 mb-1">
                      {task.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-600 max-w-xs truncate"
                      title={task.description}
                    >
                      {task.description || (
                        <span className="text-gray-400 italic">
                          Không có mô tả
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(task.deadline).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(task.deadline).toLocaleDateString("vi-VN", {
                        weekday: "long",
                      })}
                    </div>
                  </td>
                  {showAssignedTo && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-sm">
                            {task.assignedTo?.name?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {task.assignedTo?.name || "Không rõ"}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${deadlineInfo.color}`}
                    >
                      <span className="mr-1">{deadlineInfo.icon}</span>
                      {deadlineInfo.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700">
            {tasks.length} công việc
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => {
            const deadlineInfo = getDeadlineStatus(task.deadline);
            return (
              <div
                key={task._id}
                className={`p-4 border-l-4 ${getPriorityColor(
                  task.deadline
                )} hover:bg-gray-50 transition-colors duration-200`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900 flex-1 mr-3">
                    {task.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${deadlineInfo.color}`}
                  >
                    <span className="mr-1">{deadlineInfo.icon}</span>
                    {deadlineInfo.text}
                  </span>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">
                      {new Date(task.deadline).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {showAssignedTo && (
                    <div className="flex items-center">
                      <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                        <span className="text-blue-600 font-semibold text-xs">
                          {task.assignedTo?.name?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm">
                        {task.assignedTo?.name || "Không rõ"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
