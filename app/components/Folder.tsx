'use client';

import React, { useState } from 'react';

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.floor(r * (1 - percent));
  g = Math.floor(g * (1 - percent));
  b = Math.floor(b * (1 - percent));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder: React.FC<FolderProps> = ({ color = '#5227FF', size = 1, items = [], className = '' }) => {
  const maxItems = 3;
  const papers = [...items.slice(0, maxItems)];
  while (papers.length < maxItems) papers.push(null);

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = darkenColor(color, 0.08);

  const handleClick = () => {
    setOpen(prev => !prev);
    if (open) {
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.15;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.15;

    setPaperOffsets(prev => {
      const next = [...prev];
      next[index] = { x, y };
      return next;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets(prev => {
      const next = [...prev];
      next[index] = { x: 0, y: 0 };
      return next;
    });
  };

  // FIXED: size classes removed → using inline scale instead
  const scaleStyle = { transform: `scale(${size})` };

  // FIXED: Proper open transforms per paper
  const getOpenTransform = (index: number) => {
    const { x, y } = paperOffsets[index];

    if (index === 0) return `translate(-120%, -70%) rotate(-15deg) translate(${x}px, ${y}px)`;
    if (index === 1) return `translate(10%, -70%) rotate(15deg) translate(${x}px, ${y}px)`;
    if (index === 2) return `translate(-50%, -100%) rotate(5deg) translate(${x}px, ${y}px)`;

    return '';
  };

  return (
    <div style={scaleStyle} className={className}>
      <div
        className={`group relative transition-all duration-200 ease-in cursor-pointer ${
          !open ? 'hover:-translate-y-2' : ''
        }`}
        style={{ transform: open ? 'translateY(-8px)' : undefined }}
        onClick={handleClick}
      >
        {/* Back of Folder */}
        <div
          className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          {/* Tab */}
          <span
            className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px]"
            style={{
              backgroundColor: folderBackColor,
              borderTopLeftRadius: '5px',
              borderTopRightRadius: '5px',
            }}
          ></span>

          {/* Papers */}
          {papers.map((item, i) => (
            <div
              key={i}
              onMouseMove={e => handlePaperMouseMove(e, i)}
              onMouseLeave={() => handlePaperMouseLeave(i)}
              className={`
                absolute z-20 bottom-[10%] left-1/2 
                transition-all duration-300 ease-in-out
                ${!open ? 'transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0' : 'hover:scale-110'}
              `}
              style={{
                ...(open
                  ? { transform: getOpenTransform(i) }
                  : {}),
                width: 60,
                height: 45,
                backgroundColor: '#fff',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {item && typeof item === 'string' ? (
                <img src={item} className="w-full h-full object-cover" />
              ) : (
                item
              )}
            </div>
          ))}

          {/* Front flaps */}
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ${
              !open ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]' : ''
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(15deg) scaleY(0.6)' }),
            }}
          ></div>

          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ${
              !open ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]' : ''
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(-15deg) scaleY(0.6)' }),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Folder;
