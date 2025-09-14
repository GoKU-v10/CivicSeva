
'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export function ParallaxCityscape() {
  const { scrollYProgress } = useScroll();

  // Sky and sun
  const skyOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const sunY = useTransform(scrollYProgress, [0, 0.25], [100, 0]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  // City layers
  const cityBgY = useTransform(scrollYProgress, [0, 0.25], [100, 0]);
  const cityMidY = useTransform(scrollYProgress, [0, 0.25], [200, 0]);
  const cityFgY = useTransform(scrollYProgress, [0, 0.25], [300, 0]);

  // Transformation elements
  const smartCityOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const treesOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const solarPanelsY = useTransform(scrollYProgress, [0.35, 0.6], [100, 0]);


  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
        {/* Base Color */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-cyan-200" />
      
        {/* Sky and Sun */}
        <motion.div style={{ opacity: skyOpacity }} className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-600" />
        <motion.div style={{ y: sunY, opacity: sunOpacity }} className="absolute top-10 right-1/4 w-32 h-32 bg-yellow-300 rounded-full blur-xl" />

        {/* Basic City Layers */}
        <motion.div style={{ y: cityBgY, opacity: scrollYProgress }} className="absolute bottom-0 w-full h-3/4">
            <Image src="https://i.pinimg.com/originals/a2/a7/62/a2a762095819853907106093437c3555.png" alt="Background City" layout="fill" objectFit="cover" objectPosition="bottom" data-ai-hint="city silhouette" />
        </motion.div>
        <motion.div style={{ y: cityMidY, opacity: scrollYProgress }} className="absolute bottom-0 w-full h-3/4">
             <Image src="https://i.pinimg.com/originals/24/30/7c/24307c87028913c5443659424e1e3b8a.png" alt="Midground City" layout="fill" objectFit="cover" objectPosition="bottom" data-ai-hint="city buildings" />
        </motion.div>

        {/* Transforming "Smart City" layers */}
        <motion.div style={{ opacity: smartCityOpacity, y: cityMidY }} className="absolute bottom-0 w-full h-[80%]">
             <Image src="https://i.pinimg.com/originals/e8/38/c2/e838c2303a25a47761dc486799011e3b.png" alt="Smart City" layout="fill" objectFit="cover" objectPosition="bottom" data-ai-hint="futuristic city" />
        </motion.div>

        <motion.div style={{ opacity: treesOpacity, y: cityFgY }} className="absolute bottom-0 w-full h-1/2">
             <Image src="https://i.pinimg.com/originals/44/ac/55/44ac559495c3b0f5539d9a1a4f0064f2.png" alt="Foreground Trees" layout="fill" objectFit="cover" objectPosition="bottom" data-ai-hint="trees park" />
        </motion.div>
        
        <motion.div style={{ opacity: solarPanelsY, y: cityFgY }} className="absolute bottom-0 w-full h-full">
             <Image src="https://i.pinimg.com/originals/47/3e/a5/473ea517c2a715a33139366a505b38d7.png" alt="Solar Panels and Wind Turbines" layout="fill" objectFit="contain" objectPosition="bottom" data-ai-hint="solar panels wind turbines" />
        </motion.div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    </div>
  );
}
