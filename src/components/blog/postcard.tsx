import Link from 'next/link';
import { Post } from '@/app/types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <Link href={`/post/${post.id}`}>
        <h2 className="text-xl font-bold">{post.title}</h2>
      </Link>
      <p className="text-gray-600">{post.content.substring(0, 100)}...</p>
      <p className="text-sm text-gray-500">
        By {post.author.user.username} | Updated: {new Date(post.updated_at).toLocaleDateString()}
      </p>
    </div>
  );
}