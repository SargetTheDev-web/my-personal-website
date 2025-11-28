"use client";

import { useEffect, useState, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform, Transition } from "motion/react";
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
  loop?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    title: "Programming Languages",
    description: "Java, Python, SQL, HTML, CSS, JavaScript, C++",
    id: 1,
    icon: <FiCode className="h-6 w-6 text-white" />,
  },
  {
    title: "Frameworks & Tools",
    description: "Android Studio, XAMPP, FastAPI, VS Code, JWT Auth, API Integration",
    id: 2,
    icon: <FiLayers className="h-6 w-6 text-white" />,
  },
  {
    title: "Database Management",
    description: "MySQL, SQLite (Room Database)",
    id: 3,
    icon: <FiDatabase className="h-6 w-6 text-white" />,
  },
  {
    title: "Web Development Basics",
    description: "Next.js (Beginner Level)",
    id: 4,
    icon: <FiMonitor className="h-6 w-6 text-white" />,
  },
  {
    title: "Prompt Engineer",
    description: "Can work with AIs efficiently making the work faster",
    id: 5,
    icon: <FiMonitor className="h-6 w-6 text-white" />,
  },
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS: Transition = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = true,
  autoplayDelay = 4000,
  pauseOnHover = true,
  loop = true,
  round = false,
}: CarouselProps): JSX.Element {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Pause on hover
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  // Autoplay
  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === items.length - 1 && loop) return prev + 1;
          if (prev === carouselItems.length - 1) return loop ? 0 : prev;
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, items.length, carouselItems.length, pauseOnHover]);

  const effectiveTransition: Transition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const dragProps = loop
    ? {}
    : {
      dragConstraints: { left: -trackItemOffset * (carouselItems.length - 1), right: 0 },
    };

  // Prepare rotate transforms outside the map
  const rotateTransforms = carouselItems.map((_, index) => {
    const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
    const outputRange = [90, 0, -90];
    return useTransform(x, range, outputRange, { clamp: false });
  });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 ${round
        ? "rounded-full border border-white bg-[#060010]"
        : "rounded-[24px] border border-[#666] bg-[#222]"
        }`}
      style={{
        width: `${baseWidth}px`,
        height: `${baseWidth * 0.8}px`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Skills
      </h2>

      {/* Carousel Items */}
      <motion.div
        className="flex flex-1 items-center"
        drag="x"
        {...dragProps}
        style={{
          width: "100%",
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => (
          <motion.div
            key={index}
            className={`relative shrink-0 flex flex-col justify-between items-start p-5 ${round
              ? "items-center text-center bg-[#060010] border-0"
              : "bg-[#333] border border-[#666] rounded-[12px]"
              }`}
            style={{
              width: itemWidth,
              height: "100%",
              rotateY: rotateTransforms[index],
              ...(round && { borderRadius: "50%" }),
            }}
            transition={effectiveTransition}
          >
            <div className="flex items-center mb-2">
              <span className="flex h-15 w-15 items-center justify-center rounded-full bg-[#060010] mr-3">
                {item.icon}
              </span>
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
            className={`h-3 w-3 rounded-full cursor-pointer transition-colors duration-150 ${currentIndex % items.length === index
                ? "bg-white"
                : "bg-[rgba(255,255,255,0.3)]"
              }`}
            animate={{ scale: currentIndex % items.length === index ? 1.4 : 1 }}
            onClick={() => setCurrentIndex(index)}
            transition={{ duration: 0.15 }}
            style={{ margin: "0 6px" }}
          />
        ))}
      </div>
    </div>
  );
}
