import { useState } from 'react';
import { useGetPostsQuery, useGetPostsByUpdatedQuery } from '@/store/api';
import PostCard from '@/components/blog/postcard';
import { Post } from '../types';

export default function Posts() {
  const [sortBy, setSortBy] = useState<'created' | 'updated'>('created');
  const { data: createdPosts, isLoading: isLoadingCreated } = useGetPostsQuery();
  const { data: updatedPosts, isLoading: isLoadingUpdated } = useGetPostsByUpdatedQuery();

  const posts = sortBy === 'created' ? createdPosts : updatedPosts;
  const isLoading = sortBy === 'created' ? isLoadingCreated : isLoadingUpdated;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>
      <div className="mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'created' | 'updated')}
          className="border p-2 rounded"
        >
          <option value="created">Created At</option>
          <option value="updated">Updated At</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts?.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}