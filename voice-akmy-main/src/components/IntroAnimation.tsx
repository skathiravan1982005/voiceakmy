import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'letter' | 'glitch' | 'expand' | 'done'>('letter');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('glitch'), 800),
      setTimeout(() => setPhase('expand'), 1600),
      setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 2400),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-voice-deep overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Letter V */}
          {phase === 'letter' && (
            <motion.div
              className="text-[200px] md:text-[300px] font-display font-black tracking-tighter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 100px rgba(124, 58, 237, 0.5)',
              }}
            >
              V
            </motion.div>
          )}

          {/* Glitch Phase */}
          {phase === 'glitch' && (
            <div className="relative">
              {/* Red layer */}
              <motion.div
                className="absolute text-[200px] md:text-[300px] font-display font-black text-red-500"
                initial={{ x: 0 }}
                animate={{ x: [-8, 8, -4, 4, 0] }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ mixBlendMode: 'screen' }}
              >
                V
              </motion.div>
              
              {/* Blue layer */}
              <motion.div
                className="absolute text-[200px] md:text-[300px] font-display font-black text-blue-500"
                initial={{ x: 0 }}
                animate={{ x: [8, -8, 4, -4, 0] }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ mixBlendMode: 'screen' }}
              >
                V
              </motion.div>
              
              {/* Pink layer */}
              <motion.div
                className="text-[200px] md:text-[300px] font-display font-black text-pink-500"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 0.98, 1] }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ mixBlendMode: 'screen' }}
              >
                V
              </motion.div>
            </div>
          )}

          {/* Expand Phase */}
          {phase === 'expand' && (
            <>
              {/* Expanding color beams */}
              <motion.div
                className="absolute inset-0 flex"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {[
                  'bg-gradient-to-b from-voice-purple to-voice-violet',
                  'bg-gradient-to-b from-voice-violet to-voice-pink',
                  'bg-gradient-to-b from-voice-pink to-voice-blue',
                  'bg-gradient-to-b from-voice-blue to-voice-purple',
                  'bg-gradient-to-b from-voice-purple to-voice-pink',
                ].map((gradient, i) => (
                  <motion.div
                    key={i}
                    className={`flex-1 ${gradient}`}
                    initial={{ scaleY: 0, opacity: 0.8 }}
                    animate={{ scaleY: 1, opacity: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: i * 0.05,
                      ease: 'easeOut'
                    }}
                    style={{ transformOrigin: 'center' }}
                  />
                ))}
              </motion.div>

              {/* Center V fading out */}
              <motion.div
                className="text-[200px] md:text-[300px] font-display font-black z-10"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 50, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeIn' }}
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                V
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
