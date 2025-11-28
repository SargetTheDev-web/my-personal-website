"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BounceCardsProps {
  className?: string;
  images: string[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
}

export default function BounceCards({
  className = '',
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [],
  enableHover = false
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out empty/falsy images
  const validImages = images.filter(Boolean);
  // Ensure transformStyles aligns with images
  const transforms = validImages.map((_, i) => transformStyles[i] || 'none');

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll<HTMLDivElement>('.card');

    gsap.fromTo(
      cards,
      { scale: 0 },
      { scale: 1, stagger: animationStagger, ease: easeType, delay: animationDelay }
    );
  }, [animationDelay, animationStagger, easeType, validImages]);

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLDivElement>('.card');
    const offsetAmount = containerWidth / (validImages.length + 1); // dynamic spacing

    cards.forEach((card, i) => {
      gsap.killTweensOf(card);

      if (i === hoveredIdx) {
        const newTransform = transforms[i].replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
        gsap.to(card, { transform: newTransform, duration: 0.4, ease: 'back.out(1.4)', overwrite: 'auto' });
        card.style.zIndex = '10';
      } else {
        const offsetX = i < hoveredIdx ? -offsetAmount : offsetAmount;
        const pushedTransform = transforms[i] === 'none' ? `translate(${offsetX}px)` : `${transforms[i]} translate(${offsetX}px)`;
        const delay = Math.abs(i - hoveredIdx) * 0.05;

        gsap.to(card, { transform: pushedTransform, duration: 0.4, ease: 'back.out(1.4)', delay, overwrite: 'auto' });
        card.style.zIndex = '0';
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLDivElement>('.card');
    cards.forEach((card, i) => {
      gsap.killTweensOf(card);
      gsap.to(card, { transform: transforms[i], duration: 0.4, ease: 'back.out(1.4)', overwrite: 'auto' });
      card.style.zIndex = '0';
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {validImages.map((src, idx) => (
        <div
          key={idx}
          className={`card absolute w-[200px] aspect-square border-8 border-white rounded-[30px] overflow-hidden`}
          style={{
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transform: transforms[idx]
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
        >
          <img className="w-full h-full object-cover" src={src} alt={`card-${idx}`} />
        </div>
      ))}
    </div>
  );
}
