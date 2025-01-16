import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, QrCode, LinkIcon } from "lucide-react";

const Loading = ({ show }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        const response = await fetch(
          "https://event-link.vercel.app/api/load-status"
        );
        const data = await response.json();
        setProgress(data.progress);
      };

      const interval = setInterval(fetchData, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [show]);

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  const linkVariants = {
    hidden: { pathLength: 0 },
    visible: { pathLength: 1 },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-64 h-64">
              <svg
                className="absolute inset-0"
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
              >
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3498db"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                  animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative"
                  initial="hidden"
                  animate="visible"
                  variants={iconVariants}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Ticket className="w-16 h-16 text-[#2980b9]" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial="hidden"
                    animate="visible"
                    variants={iconVariants}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.5,
                    }}
                  >
                    <QrCode className="w-8 h-8 text-[#3498db]" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
            <motion.div
              className="mt-8 flex items-center space-x-2"
              initial="hidden"
              animate="visible"
              variants={iconVariants}
            >
              <LinkIcon className="w-6 h-6 text-[#2980b9]" />
              <motion.div
                className="w-20 h-1 bg-[#3498db]"
                variants={linkVariants}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <LinkIcon className="w-6 h-6 text-[#2980b9]" />
            </motion.div>
            <motion.p
              className="mt-4 text-[#2980b9] font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Loading Event Details... {progress}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;
