
import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import PageBanner from '../components/PageBanner';
import BlogList from '../components/BlogList';

const BlogPage: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { blog } = appData.pages;
  const visiblePosts = blog.posts.filter(post => post.enabled);

  return (
    <div className="pt-20 bg-[var(--color-dark-bg)]">
      <PageBanner 
        title={blog.pageBanner.title} 
        subtitle={blog.pageBanner.subtitle}
        backgroundImage={blog.pageBanner.backgroundImage}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {visiblePosts.length > 0 ? (
             <BlogList posts={visiblePosts} />
        ) : (
            <div className="text-center py-20">
                <h3 className="text-2xl text-[var(--color-muted-text)]">No blog posts available at the moment.</h3>
            </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
