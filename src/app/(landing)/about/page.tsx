'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale } from '@/hooks/useLocale';
import Image from 'next/image';
import { renderText } from '@/utils/renderText';
import { aboutContent } from '@/data/about';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const { language } = useLocale();
  const content = aboutContent;

  // Hero Section Refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Values Section Refs
  const valuesSectionRef = useRef<HTMLElement>(null);
  const valuesNumbersRef = useRef<HTMLDivElement>(null);

  // Life Section Refs
  const lifeSectionRef = useRef<HTMLElement>(null);
  const lifeHeaderRef = useRef<HTMLHeadingElement>(null);
  const lifeImagesRef = useRef<HTMLDivElement>(null);

  // Core Values Section Refs
  const coreSectionRef = useRef<HTMLElement>(null);
  const coreNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const text = titleRef.current.textContent || '';
      titleRef.current.textContent = '';

      const words = text.split(' ').map((word, i) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.marginRight = '0.3em';
        wordSpan.style.whiteSpace = 'nowrap';

        const chars = word.split('').map((char) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          wordSpan.appendChild(span);
          return span;
        });

        if (i !== text.split(' ').length - 1) {
          wordSpan.appendChild(document.createTextNode(' '));
        }

        titleRef.current?.appendChild(wordSpan);
        return chars;
      });

      const chars = words.flat();
      let valuesAnimation: gsap.core.Tween;
      let coreAnimation: gsap.core.Tween;
      let lifeTimeline: gsap.core.Timeline;

      const titleAnimation = gsap.fromTo(
        chars,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
        }
      );

      const contentAnimation = gsap.fromTo(
        [descriptionRef.current, imageRef.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.in',
          stagger: 0.3,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top center+=100',
            once: true,
          },
        }
      );

      if (valuesSectionRef.current && valuesNumbersRef.current) {
        valuesAnimation = gsap.fromTo(
          '.values-number',
          {
            opacity: 0,
            y: 40,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.2,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: valuesSectionRef.current,
              start: 'top center+=100',
              once: true,
            },
          }
        );
      }

      if (lifeSectionRef.current) {
        lifeTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: lifeSectionRef.current,
            start: 'top center+=100',
            once: true,
          },
        });

        lifeTimeline
          .fromTo(
            lifeHeaderRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.5 }
          )
          .fromTo(
            lifeImagesRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.2'
          );
      }

      if (coreSectionRef.current) {
        coreAnimation = gsap.fromTo(
          '.core-number',
          {
            opacity: 0,
            y: 40,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.2,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: coreSectionRef.current,
              start: 'top center+=100',
              once: true,
            },
          }
        );
      }

      // Cleanup
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        titleAnimation.kill();
        contentAnimation.kill();
        valuesAnimation?.kill();
        coreAnimation?.kill();
        lifeTimeline?.kill();
      };
    }
  }, []);

  return (
    <main className="flex w-full flex-col items-center pt-32">
      {/* Hero Section */}
      <section className="w-full container px-6 sm:px-8 md:px-16 lg:px-32 2xl:items-center flex flex-col lg:flex-row justify-between gap-8 sm:gap-12">
        <div className="flex flex-col items-center sm:items-start gap-6 sm:gap-8 lg:w-3/5">
          <Image
            ref={imageRef}
            src={'/images/about/profile.webp'}
            alt="About Image"
            width={0}
            height={0}
            sizes="100vw"
            className="md:hidden cursor-pointer h-auto rounded-xl w-[60%] object-cover hover:brightness-90 transition-all duration-300"
          />
          <h1
            ref={titleRef}
            className="text-center sm:text-left text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter leading-tight text-green-900"
          >
            {content.hero.title[language]}
          </h1>
          <div ref={descriptionRef} className="flex flex-col gap-6">
            <p className="text-base sm:text-lg text-green-900 leading-relaxed max-w-3xl sm:text-balance break-keep">
              {renderText(content.hero.description[language])}
            </p>
            <div className="flex flex-col gap-4 text-pretty break-keep">
              <div className="flex gap-1 text-sm sm:text-base font-medium text-green-900/70">
                <span>
                  <span className="font-semibold">CURRENTLY</span> :{' '}
                  {renderText(content.hero.status.current[language])}
                </span>
              </div>
              <div className="flex gap-1 text-sm sm:text-base font-medium text-green-900/70">
                <span>
                  <span className="font-semibold">PREVIOUSLY</span> :{' '}
                  {renderText(content.hero.status.previous[language])}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Image
          ref={imageRef}
          src={'/images/about/profile.webp'}
          alt="About Image"
          width={0}
          height={0}
          sizes="100vw"
          className="hidden md:block cursor-pointer opacity-0 h-auto rounded-xl w-full lg:w-2/5 object-cover hover:brightness-90 transition-all duration-300"
        />
      </section>

      {/* Values Section */}
      <section
        ref={valuesSectionRef}
        className="w-full container px-6 sm:px-8 md:px-16 lg:px-32 py-16 sm:py-24"
      >
        <div
          ref={valuesNumbersRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-y-2 border-green-900 py-16 sm:py-24"
        >
          {content.values.items.map((item, index) => (
            <div key={index} className="flex gap-4 sm:gap-6">
              <h2 className="values-number text-3xl sm:text-4xl font-semibold text-green-900/70">
                {String(index + 1).padStart(2, '0')}
              </h2>
              <div className="flex flex-col gap-4 pt-1">
                <h3 className="text-2xl font-semibold text-green-900">
                  {item.title[language]}
                </h3>
                <p className="text-base sm:text-lg text-green-900/80 leading-relaxed text-balance break-keep">
                  {renderText(item.description[language])}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Section */}
      <section
        ref={lifeSectionRef}
        className="w-full container px-6 sm:px-8 md:px-16 lg:px-32 pb-16 sm:pb-24"
      >
        <h2
          ref={lifeHeaderRef}
          className="text-2xl sm:text-3xl font-semibold text-green-900 mb-8 sm:mb-12 flex items-center gap-2"
        >
          <Image
            src={'/images/icon/about-01.png'}
            alt="coffee"
            width={0}
            height={0}
            sizes="100vw"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          {content.life.title[language]}
        </h2>
        <div
          ref={lifeImagesRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pb-16 sm:pb-24 border-b-2 border-green-900"
        >
          {content.life.images.map((image, index) => (
            <div
              key={index}
              className="aspect-auto cursor-pointer border group relative border-green-900/20 overflow-hidden"
            >
              <Image
                src={`/images/about/life-0${index + 1}.webp`}
                alt={image.description[language]}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-90 transition-transform duration-300"
              />
              <span className="text-white font-medium text-center break-keep hidden group-hover:block text-xs sm:text-sm absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                {image.description[language]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section
        ref={coreSectionRef}
        className="w-full container px-6 sm:px-8 md:px-16 lg:px-32 pb-24 sm:pb-32"
      >
        <div
          ref={coreNumbersRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {content.core.sections.map((item, index) => (
            <div key={index} className="flex gap-4">
              <h2 className="core-number text-3xl sm:text-4xl font-semibold text-green-900/70">
                {String(index + 1).padStart(2, '0')}
              </h2>
              <div className="flex flex-col gap-4 sm:gap-6 pt-1">
                <h3 className="text-2xl font-semibold text-green-900">
                  {item.title[language]}
                </h3>
                <ul className="flex flex-col gap-3 sm:gap-4 break-keep">
                  {item.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-base flex items-center gap-2 sm:text-lg text-green-900/80 font-medium"
                    >
                      <p className="sm:hidden w-1 h-1 bg-green-900 rounded-full" />
                      {item.text[language]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
