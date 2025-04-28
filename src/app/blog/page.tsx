'use client';

import { useGetPostsQuery } from '@/store/api';
import PostCard from "@/components/blog/postcard";
import { Post } from '../types';

export default function Home() {
  const { data: posts, isLoading, isError, error } = useGetPostsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts?.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}