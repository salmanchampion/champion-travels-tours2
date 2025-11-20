import React from 'react';
import PageBanner from '../components/PageBanner';
import { CustomPage as CustomPageData, ContentBlock } from '../data';

interface CustomPageProps {
  pageData: CustomPageData;
}

const CustomPage: React.FC<CustomPageProps> = ({ pageData }) => {
  
  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'html':
        return (
          <div
            key={index}
            className="prose prose-invert lg:prose-xl max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      case 'image':
        return (
          <div key={index} className="my-8 text-center">
            <img 
              src={block.src} 
              alt={block.alt} 
              className="max-w-full h-auto mx-auto rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)]" 
            />
          </div>
        );
      case 'button':
        return (
          <div key={index} className="my-8 text-center">
            <a 
              href={block.href}
              className="inline-block bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-md hover:shadow-lg text-lg"
            >
              {block.text}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-20">
      <PageBanner title={pageData.title} subtitle={pageData.bannerSubtitle} />
      <div className="bg-dark-bg py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {pageData.contentBlocks?.map((block, index) => renderBlock(block, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPage;