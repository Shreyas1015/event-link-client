import React from "react";
import { motion } from "framer-motion";
import { Ticket, QrCode, LinkIcon } from "lucide-react";

const Loading = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-64 h-64">
          <motion.svg
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
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Ticket className="w-16 h-16 text-[#2980b9]" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <QrCode className="w-8 h-8 text-[#3498db]" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="mt-8 flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <LinkIcon className="w-6 h-6 text-[#2980b9]" />
          <motion.div
            className="w-20 h-1 bg-[#3498db]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <LinkIcon className="w-6 h-6 text-[#2980b9]" />
        </motion.div>
        <motion.h1
          className="mt-4 text-xl font-semibold text-[#2980b9]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Loading...
        </motion.h1>
      </div>
    </div>
  );
};

export default Loading;
