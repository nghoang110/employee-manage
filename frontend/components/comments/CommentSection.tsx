import { useEffect, useState } from "react";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  userId: {
    username: string;
    role: string;
  };
}

interface Props {
  taskId: string;
}

export default function CommentSection({ taskId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const fetchComments = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/comments/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setComments(Array.isArray(data) ? data : []);
  };

  const sendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:4000/comments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");

      setContent("");
      fetchComments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "text-purple-600 bg-purple-50";
      case "manager":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 flex items-center">
          <span className="mr-2">💬</span>
          Bình luận ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            Chưa có bình luận nào
          </div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="border-l-3 border-blue-200 pl-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-900">
                    {c.userId.username}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(
                      c.userId.role
                    )}`}
                  >
                    {c.userId.role}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <div className="border-t pt-3">
        <form onSubmit={sendComment} className="space-y-3">
          <div className="flex space-x-2">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Thêm bình luận..."
              className="flex-1 text-sm border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Gửi
            </button>
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-2 rounded">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
