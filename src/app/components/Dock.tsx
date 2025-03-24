"use client";

import React, { useState, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

interface DockItemProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  panelHeight: number;
  baseItemSize: number;
  magnification: number;
  mouseX: number | null;
  position: number;
}

// Memoize the DockItem to prevent unnecessary re-renders
const DockItem = memo(({
  icon,
  label,
  onClick,
  panelHeight,
  baseItemSize,
  magnification,
  mouseX,
  position
}: DockItemProps) => {

  // Calculate the size based on distance from mouse
  const size = mouseX !== null
    ? Math.max(
        baseItemSize,
        baseItemSize + (magnification - baseItemSize) * (1 - Math.min(Math.abs(mouseX - position) / 50, 1))
      )
    : baseItemSize;

  return (
    <motion.div
      className="flex flex-col items-center justify-end px-2 transition-opacity duration-200 ease-in-out cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      style={{ height: panelHeight }}
      animate={{ 
        width: size,
        height: size
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5
      }}
    >
      <div 
        className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-filter backdrop-blur-lg w-full h-full shadow-lg border border-white/10 overflow-hidden"
      >
        <motion.div 
          className="text-white"
          animate={{ scale: mouseX !== null && Math.abs(mouseX - position) < 30 ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {icon}
        </motion.div>
      </div>
      {label && mouseX !== null && Math.abs(mouseX - position) < 30 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute bottom-full mb-2 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs rounded-lg font-medium border border-white/10 pointer-events-none"
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
});

DockItem.displayName = 'DockItem';

interface DockProps {
  items: {
    icon: React.ReactNode;
    label?: string;
    onClick?: () => void;
  }[];
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
}

const Dock = ({
  items,
  panelHeight = 60,
  baseItemSize = 50,
  magnification = 60
}: DockProps) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  // Optimize mouse move handler with useCallback
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setMouseX(x);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  return (
    <motion.div
      ref={dockRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex items-end px-3 py-2 rounded-2xl bg-black/20 backdrop-filter backdrop-blur-md border border-white/10 shadow-xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {items.map((item, index) => {
        // Calculate the center position of each item for magnification
        const position = (index + 0.5) * (baseItemSize + 16); // 16px = 2 * padding of DockItem
        
        return (
          <DockItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
            panelHeight={panelHeight}
            baseItemSize={baseItemSize}
            magnification={magnification}
            mouseX={mouseX}
            position={position}
          />
        );
      })}
    </motion.div>
  );
};

// Export a memoized version of the component
export default memo(Dock);
