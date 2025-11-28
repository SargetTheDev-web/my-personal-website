'use client';

import React, { useRef, useEffect, useState } from 'react';

interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');

        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);

        requestAnimationFrame(() => {
          element.classList.add('active');
        });

        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch { }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const left = pos.left - containerRect.left;
    const top = pos.top - containerRect.top;

    filterRef.current.style.left = `${left}px`;
    filterRef.current.style.top = `${top}px`;
    filterRef.current.style.width = `${pos.width}px`;
    filterRef.current.style.height = `${pos.height}px`;

    textRef.current.style.left = `${left}px`;
    textRef.current.style.top = `${top}px`;
    textRef.current.style.width = `${pos.width}px`;
    textRef.current.style.height = `${pos.height}px`;

    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const aEl = e.currentTarget;
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(aEl);

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current!.removeChild(p));
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) makeParticles(filterRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const aEl = e.currentTarget;
      handleClick({ currentTarget: aEl } as React.MouseEvent<HTMLAnchorElement>, index);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;

    const updateInitial = () => {
      const activeA = navRef.current?.querySelectorAll('a')[activeIndex] as HTMLElement;
      if (activeA) {
        updateEffectPosition(activeA);

        // Reset old particles
        if (filterRef.current) {
          const particles = filterRef.current.querySelectorAll('.particle');
          particles.forEach(p => filterRef.current!.removeChild(p));
        }

        // Trigger initial animation cleanly
        if (textRef.current) {
          textRef.current.classList.remove('active');
          void textRef.current.offsetWidth;
          textRef.current.classList.add('active');
        }

        if (filterRef.current) makeParticles(filterRef.current);
      }
    };

    // ---- RUN ON PAGE LOAD ----
    setTimeout(updateInitial, 10);

    // ---- RUN ON WINDOW RESIZE ----
    const resizeObserver = new ResizeObserver(() => {
      const activeA = navRef.current?.querySelectorAll('a')[activeIndex] as HTMLElement;
      if (activeA) updateEffectPosition(activeA);
    });
    resizeObserver.observe(containerRef.current);

    // ---- RUN ON SCROLL ----
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      items.forEach((item, index) => {
        const section = document.querySelector(item.href);
        if (section) {
          const top = section.getBoundingClientRect().top + window.scrollY;
          const bottom = top + section.clientHeight;

          if (scrollPos >= top && scrollPos < bottom) {
            if (activeIndex !== index) {
              setActiveIndex(index);

              const aEl = navRef.current?.querySelectorAll('a')[index] as HTMLElement;
              if (aEl) {
                updateEffectPosition(aEl);

                if (filterRef.current) {
                  const particles = filterRef.current.querySelectorAll('.particle');
                  particles.forEach(p => filterRef.current!.removeChild(p));
                  makeParticles(filterRef.current);
                }

                if (textRef.current) {
                  textRef.current.classList.remove('active');
                  void textRef.current.offsetWidth;
                  textRef.current.classList.add('active');
                }
              }
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex, items]);


  return (
    <>
      <style>{`
        .effect { position:absolute; opacity:1; pointer-events:none; display:grid; place-items:center; z-index:1; }
        .effect.text { color:white; transition:color 0.3s ease; }
        .effect.text.active { color:black; }
        .effect.filter { filter: blur(7px) contrast(100) blur(0); mix-blend-mode: lighten; }
        .effect.filter::after { content:""; position:absolute; inset:0; background:white; transform:scale(0); opacity:0; z-index:-1; border-radius:9999px; }
        .effect.active::after { animation: pill 0.3s ease both; }
        @keyframes pill { to { transform: scale(1); opacity:1; } }
        .particle, .point { display:block; opacity:0; width:20px; height:20px; border-radius:9999px; transform-origin:center; }
        .particle { --time:5s; position:absolute; top:calc(50% - 8px); left:calc(50% - 8px); animation: particle calc(var(--time)) ease 1 -350ms; }
        .point { background:var(--color); opacity:1; animation: point calc(var(--time)) ease 1 -350ms; }
        @keyframes particle {
          0% { transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y))); opacity:1; animation-timing-function:cubic-bezier(0.55,0,1,0.45); }
          70% { transform: rotate(calc(var(--rotate)*0.5)) translate(calc(var(--end-x)*1.2), calc(var(--end-y)*1.2)); opacity:1; animation-timing-function:ease; }
          85% { transform: rotate(calc(var(--rotate)*0.66)) translate(calc(var(--end-x)), calc(var(--end-y))); opacity:1; }
          100% { transform: rotate(calc(var(--rotate)*1.2)) translate(calc(var(--end-x)*0.5), calc(var(--end-y)*0.5)); opacity:1; }
        }
        @keyframes point {
          0% { transform: scale(0); opacity:0; animation-timing-function:cubic-bezier(0.55,0,1,0.45); }
          25% { transform: scale(calc(var(--scale)*0.25)); }
          38% { opacity:1; }
          65% { transform: scale(var(--scale)); opacity:1; animation-timing-function:ease; }
          85% { transform: scale(var(--scale)); opacity:1; }
          100% { transform: scale(0); opacity:0; }
        }
        li.active a { color:black; }
        li a { position:relative; display:inline-block; text-decoration:none; color:white; transition:all 0.3s ease; }
      `}</style>

      <div className="relative" ref={containerRef}>
        <nav className="flex relative">
          <ul ref={navRef} className="flex gap-4 sm:gap-6 list-none p-0 m-0 relative z-[3]">
            {items.map((item, index) => (
              <li key={index} className={`relative cursor-pointer ${activeIndex === index ? 'active' : ''}`}>
                <a
                  href={item.href}
                  onClick={e => handleClick(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base outline-none"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  );
};

export default GooeyNav;
