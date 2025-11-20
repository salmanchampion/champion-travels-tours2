
import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import PageBanner from '../components/PageBanner';

interface BlogPostPageProps {
    postId: string | null;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId }) => {
  const { appData } = useContext(DataContext);
  const { blog } = appData.pages;
  
  const post = blog.posts.find(p => p.id === postId);

  if (!post) {
      return (
          <div className="pt-20 min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)]">
              <div className="text-center">
                  <h2 className="text-3xl font-display text-white mb-4">Post Not Found</h2>
                  <a href="#blog" className="text-[var(--color-primary)] hover:underline">Return to Blog</a>
              </div>
          </div>
      );
  }

  return (
    <div className="pt-20 bg-[var(--color-dark-bg)]">
        {/* We use the post image as the banner if available, otherwise default blog banner */}
      <PageBanner 
        title={post.title} 
        subtitle="" // No subtitle needed for single post banner
        backgroundImage={post.image || blog.pageBanner.backgroundImage}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] shadow-xl p-6 md:p-12">
            <div className="flex justify-between items-center text-sm text-[var(--color-muted-text)] mb-8 pb-4 border-b border-gray-700">
                <span>By <span className="text-[var(--color-primary)] font-semibold">{post.author}</span></span>
                <span>{post.date}</span>
            </div>
            
            <div 
                className="prose prose-invert lg:prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                <a href="#blog" className="inline-block bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-all duration-300">
                    Back to All Posts
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
