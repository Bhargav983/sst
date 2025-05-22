
"use client";

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Slide {
  id: number;
  imageUrl: string;
  dataAiHint: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroSliderProps {
  slides: Slide[];
  autoPlayInterval?: number; // in milliseconds
}

export const HeroSlider: FC<HeroSliderProps> = ({ slides, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (autoPlayInterval > 0 && slides.length > 1) {
      const timer = setTimeout(goToNext, autoPlayInterval);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, goToNext, autoPlayInterval, slides.length]);

  if (!slides || slides.length === 0) {
    return null; 
  }

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group rounded-lg shadow-xl mb-12">
      {/* Slides Container */}
      <div className="w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={index === 0} 
              className="object-cover"
              data-ai-hint={slide.dataAiHint}
              sizes="(max-width: 768px) 100vw, 100vw"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Text Content & CTA */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-down">
          {currentSlide.title}
        </h1>
        <p className="text-md md:text-lg lg:text-xl text-gray-200 mb-8 max-w-xl mx-auto animate-fade-in-up">
          {currentSlide.description}
        </p>
        <Link href={currentSlide.buttonLink}>
          <Button size="lg" className="animate-fade-in-up animation-delay-200">
            {currentSlide.buttonText}
          </Button>
        </Link>
      </div>

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-colors duration-300 ${
                currentIndex === index ? 'bg-primary' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 z-20 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black/50 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 z-20 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black/50 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* CSS for animations - Tailwind doesn't have these by default. 
          Ideally, add to tailwind.config.js or globals.css.
          For this context, embedded style is acceptable. */}
      <style jsx global>{`
        .animate-fade-in-down {
          animation: fadeInDownSutra 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUpSutra 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        @keyframes fadeInDownSutra {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUpSutra {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
