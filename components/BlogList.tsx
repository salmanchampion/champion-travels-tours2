
import React from 'react';
import { BlogPost } from '../data';

interface BlogListProps {
  posts: BlogPost[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <div key={post.id} className="bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] overflow-hidden flex flex-col transition-transform hover:-translate-y-2 duration-300">
          {post.image && (
            <div className="relative h-56">
                <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                     <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">{post.date}</span>
                </div>
            </div>
          )}
          <div className="p-6 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-white font-display mb-3 hover:text-[var(--color-primary)] transition-colors">
                <a href={`#blog-post?id=${post.id}`}>{post.title}</a>
            </h3>
            <p className="text-[var(--color-muted-text)] mb-4 text-sm flex-grow line-clamp-3">
              {post.excerpt}
            </p>
             <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                <span className="text-xs text-gray-400">By {post.author}</span>
                <a 
                    href={`#blog-post?id=${post.id}`} 
                    className="text-sm font-bold text-[var(--color-primary)] hover:underline"
                >
                    Read More &rarr;
                </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
