import React from 'react'
import { motion } from 'framer-motion';

export default function Loader() {
    const ballStyle = {
        display: "block",
        width: "2rem",
        height: "2rem",
        backgroundColor: "black",
        borderRadius: "50%"
      };
      
      const bounceTransition = {
        y: {
          duration: 0.6,
          repeat: Infinity,
          ease: "easeOut",
          repeatType : 'mirror',
          repeat: Infinity,
        },
        backgroundColor: {
          duration: 0.6,
          repeatType : 'mirror',
          repeat: 5,
          ease: "easeOut",
        }
      };
  return (
    <motion.div className='h-screen w-full flex justify-center items-center'
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
            >
            <motion.span
                style={ballStyle}
                transition={bounceTransition}
                animate={{
                y: ["100%", "-100%"],
                backgroundColor: ["#ff6699", "#6666ff"]
                }}
            />
    </motion.div>
  )
}
