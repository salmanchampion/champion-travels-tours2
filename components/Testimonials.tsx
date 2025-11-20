
import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  avatar: string;
  delay: number;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex text-[var(--color-primary)]">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-5 h-5 ${i < rating ? 'fill-current' : 'text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
    ))}
  </div>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, title, avatar, delay }) => (
  <div 
    data-aos="fade-up"
    data-aos-delay={delay}
    className="bg-[var(--color-light-bg)] p-8 rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex-grow mb-4">
      <svg className="w-10 h-10 text-[var(--color-primary)] mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9.333 22.583c0 2.221-1.203 4.286-3.053 5.466-1.12 1.13-2.583.56-2.583-1.13v-5.69c0-2.827 2.278-5.105 5.105-5.105h.531c-.133 1.638-.531 3.208-.531 4.286zm16 0c0 2.221-1.203 4.286-3.053 5.466-1.12 1.13-2.583.56-2.583-1.13v-5.69c0-2.827 2.278-5.105 5.105-5.105h.531c-.133 1.638-.531 3.208-.531 4.286z"></path>
      </svg>
      <p className="text-[var(--color-light-text)] italic">"{quote}"</p>
    </div>
    <div className="flex items-center mt-auto">
      <img className="w-12 h-12 rounded-full mr-4 object-cover" src={avatar} alt={name} />
      <div>
        <div className="font-bold text-white">{name}</div>
        <div className="text-sm text-[var(--color-muted-text)]">{title}</div>
      </div>
      <div className="ml-auto">
        <StarRating rating={5} />
      </div>
    </div>
  </div>
);

interface TestimonialsProps {
  showTitle?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({ showTitle = true }) => {
  const { appData } = useContext(DataContext);
  const homePageData = appData.pages.home.sections.testimonials;
  const testimonialsPageData = appData.pages.testimonials;

  const data = showTitle ? homePageData : testimonialsPageData.pageBanner;
  const testimonials = testimonialsPageData.list.filter(t => t.enabled);

  return (
    <section className={`${showTitle ? 'py-20' : 'pb-20'} bg-[var(--color-light-bg)]`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
            <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)]" data-aos="fade-up">{data.title}</h2>
            <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">{data.subtitle}</p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
