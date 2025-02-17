import { useState, useEffect } from "react";
import { Comment, CommentProps } from "../types";
import axiosInstance from "../utils/axiosSetup";

const Comments: React.FC<CommentProps> = ({ postId, token, userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    username: string;
  } | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    // 只有当所有必要的参数都存在时才获取评论
    if (postId && token && userId) {
      fetchComments();
    }
  }, [postId, token, userId]);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comments/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(JSON.stringify(response.data));
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/comments",
        {
          content: commentContent,
          postId,
          parentCommentId: replyTo?.commentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setComments((prev) =>
        replyTo
          ? prev.map((comment) =>
              comment._id === replyTo.commentId
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), response.data],
                  }
                : comment
            )
          : [...prev, response.data]
      );

      setCommentContent("");
      setReplyTo(null);
      setCommentError(null);
    } catch (error) {
      setCommentError("发表评论失败，请重试" + error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await axiosInstance.post(
        `/comments/${commentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? response.data : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const renderComment = (comment: Comment) => (
    <div key={comment._id} className="border-b py-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          {comment.author?.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">
              {comment.author?.username}
            </h4>
            <time className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </time>
          </div>
          <p className="mt-1 text-gray-700">
            {comment.parentComment && (
              <span className="text-orange-500">
                @{comment.parentComment.author?.username}:{" "}
              </span>
            )}
            {comment.content}
          </p>
          <div className="mt-2 flex items-center space-x-4 text-sm">
            <button
              onClick={() => handleLikeComment(comment._id)}
              className={`flex items-center space-x-1 ${
                comment.likes.some((like) => like._id === userId)
                  ? "text-orange-500"
                  : "text-gray-500"
              }`}
            >
              <span>👍</span>
              <span>{comment.likeCount}</span>
            </button>
            <button
              onClick={() =>
                setReplyTo({
                  commentId: comment._id,
                  username: comment.author?.username,
                })
              }
              className="text-gray-500 hover:text-gray-700"
            >
              回复
            </button>
            {comment.author._id === userId && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-500 hover:text-red-700"
              >
                删除
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // 如果缺少必要参数，不渲染评论区
  if (!postId || !token || !userId) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">💬</span>
        评论区
      </h3>

      <form onSubmit={handleCommentSubmit} className="mb-6">
        {replyTo && (
          <div className="mb-2 text-sm text-gray-600">
            回复 @{replyTo.username}{" "}
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              取消回复
            </button>
          </div>
        )}
        <div className="flex items-start space-x-3">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="写下你的评论..."
            className="flex-1 border rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            发表评论
          </button>
        </div>
        {commentError && (
          <p className="mt-2 text-red-500 text-sm">{commentError}</p>
        )}
      </form>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <>
              {renderComment(comment)}
              {comment.replies?.map((reply) => renderComment(reply))}
            </>
          ))
        ) : (
          <div className="text-center text-gray-500">暂无评论</div>
        )}
      </div>
    </div>
  );
};

export default Comments;
