import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './FloatingCursor.scss';
import nuage from '../../assets/spoon-.svg';

const FloatingCursor = () => {
  const cursorSize: number = 80;
  const mouseX = useMotionValue<number>(-100);
  const mouseY = useMotionValue<number>(-100);

  const smoothX = useSpring(mouseX, { 
    damping: 20,
    stiffness: 300,
    mass: 0.5
  });
  
  const smoothY = useSpring(mouseY, {
    damping: 20,
    stiffness: 300,
    mass: 0.5
  });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - cursorSize / 2);
      mouseY.set(e.clientY - cursorSize / 2);
    };

    // Vérifier si ce n'est pas un appareil mobile
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener('mousemove', moveCursor);
    }

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="cursor-container"
      style={{
        x: smoothX,
        y: smoothY,
      }}
    >
      <motion.img
        src={nuage}
        alt="custom cursor"
        className="floating-cursor"
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

export default FloatingCursor;