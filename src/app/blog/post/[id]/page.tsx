'use client';

import { useGetPostByIdQuery } from '@/store/api';
import CommentSection from '@/components/blog/commentsection';
import type { Post } from '@/app/types';
import Link from 'next/link';

export default function Post({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: post, isLoading, isError, error } = useGetPostByIdQuery(id);

  if (isLoading) return <div className="container mx-auto p-4">Loading...</div>;
  if (isError) return <div className="container mx-auto p-4">Error: {JSON.stringify(error)}</div>;
  if (!post) return <div className="container mx-auto p-4">Post not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Link href="/blog" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Blog
      </Link>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.content}</p>
      <p className="text-sm text-gray-500 mb-4">
        By {post.author.user.username} | Updated: {new Date(post.updated_at).toLocaleDateString()}
      </p>
      <div className="mt-4">
        <button
          onClick={() => navigator.share({ title: post.title, url: window.location.href })}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Share
        </button>
      </div>
      <CommentSection postId={id} comments={post.comments} />
    </div>
  );
}