"use client";

import { useEffect, useState, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "motion/react";
import React, { JSX } from "react";
import { FiCode, FiDatabase, FiMonitor, FiLayers } from "react-icons/fi";

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactNode;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  { title: "Programming Languages", description: "Java, Python, SQL, HTML, CSS, JavaScript, C++", id: 1, icon: <FiCode className="h-6 w-6 text-white" /> },
  { title: "Frameworks & Tools", description: "Android Studio, XAMPP, FastAPI, VS Code, JWT Auth, API Integration", id: 2, icon: <FiLayers className="h-6 w-6 text-white" /> },
  { title: "Database Management", description: "MySQL, SQLite (Room Database)", id: 3, icon: <FiDatabase className="h-6 w-6 text-white" /> },
  { title: "Web Development Basics", description: "Next.js (Beginner Level)", id: 4, icon: <FiMonitor className="h-6 w-6 text-white" /> },
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = true,
  autoplayDelay = 4000,
  pauseOnHover = true,
  round = false,
}: CarouselProps): JSX.Element {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Pause on hover
  useEffect(() => {
    if (!pauseOnHover || !containerRef.current) return;
    const el = containerRef.current;
    const enter = () => setIsHovered(true);
    const leave = () => setIsHovered(false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [pauseOnHover]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || (pauseOnHover && isHovered)) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => Math.min(prev + 1, items.length - 1));
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, items.length, pauseOnHover]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex(prev => Math.min(prev + 1, items.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const dragProps = {
    dragConstraints: { left: -trackItemOffset * (items.length - 1), right: 0 },
  };

  // Rotate transforms for 3D effect
  const rotateTransforms = items.map((_, index) => {
    const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
    const output = [90, 0, -90];
    return useTransform(x, range, output, { clamp: false });
  });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 ${round ? "rounded-full border border-white bg-[#060010]" : "rounded-[24px] border border-[#666] bg-[#222]"}`}
      style={{
        width: `${baseWidth}px`,
        height: `${baseWidth * 0.8}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Skills</h2>

      <motion.div
        className="flex flex-1 items-center"
        drag="x"
        {...dragProps}
        style={{ width: "100%", gap: `${GAP}px`, perspective: 1000, x }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`relative shrink-0 flex flex-col justify-between p-5 ${round ? "items-center text-center bg-[#060010]" : "bg-[#333] border border-[#666] rounded-[12px]"}`}
            style={{
              width: itemWidth,
              minHeight: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              rotateY: rotateTransforms[index],
              ...(round && { borderRadius: "50%" }),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center mb-2">
              <span className="flex h-15 w-15 items-center justify-center rounded-full bg-[#060010] mr-3">{item.icon}</span>
              <span className="font-bold text-white text-lg">{item.title}</span>
            </div>
            <p className="text-white text-sm">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Dots */}
      <div className="flex w-full justify-center mt-6">
        {items.map((_, index) => (
          <motion.div
            key={index}
            className={`h-3 w-3 rounded-full cursor-pointer ${currentIndex === index ? "bg-white" : "bg-[rgba(255,255,255,0.3)]"}`}
            animate={{ scale: currentIndex === index ? 1.4 : 1 }}
            onClick={() => setCurrentIndex(index)}
            transition={{ duration: 0.15 }}
            style={{ margin: "0 6px" }}
          />
        ))}
      </div>
    </div>
  );
}
