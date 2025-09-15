
'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';

export function ParallaxCityscape() {
  const { scrollY } = useScroll();

  // Use a simpler transform for the background image
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
            className="relative w-full h-full"
            style={{ y }}
        >
            <Image
                src="https://i.pinimg.com/736x/5c/c8/4a/5cc84aea3a9772c9587fa73680d721a4.jpg"
                alt="City background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
            />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
