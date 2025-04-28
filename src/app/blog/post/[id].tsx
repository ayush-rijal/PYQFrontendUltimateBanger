"use client";
import { useRouter } from 'next/router';
import { useGetPostByIdQuery } from '@/store/api';
import CommentSection from '@/components/blog/commentsection';
import type { Post } from '@/app/types';

export default function Post() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: post, isLoading } = useGetPostByIdQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.content}</p>
      <p className="text-sm text-gray-500">
        By {post.author.user.username} | Updated: {new Date(post.updated_at).toLocaleDateString()}
      </p>
      <div className="mt-4">
        <button
          onClick={() => navigator.share({ title: post.title, url: window.location.href })}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Share
        </button>
      </div>
      <CommentSection postId={id} comments={post.comments} />
    </div>
  );
}