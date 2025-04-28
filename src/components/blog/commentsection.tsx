import { useState } from 'react';
import { useCreateCommentMutation } from '@/store/api';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Comment } from '@/app/types';
interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const [content, setContent] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [createComment, { isLoading: isCommentLoading }] = useCreateCommentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await createComment({ post: parseInt(postId), content }).unwrap();
      setContent('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setContent((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="border-t py-2">
            <p className="text-gray-800">{comment.content}</p>
            <p className="text-sm text-gray-500">
              By {comment.user.username} | {new Date(comment.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-start space-x-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a comment..."
            rows={4}
          />
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-xl p-2 hover:bg-gray-100 rounded"
            >
              😊
            </button>
            <button
              type="submit"
              disabled={isCommentLoading || !content.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition"
            >
              {isCommentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
        {showEmojiPicker && (
          <div className="mt-2">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </form>
    </div>
  );
}