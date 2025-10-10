import React, { useEffect, useState, useRef } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { MarkDownComponents } from "./markdown/MarkDown";
import { motion } from "motion/react";

const TypingEffect = ({ text, speed = 18, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (typeof text !== "string" || !text.trim() || text === "undefined") {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const charCount = Math.floor(elapsed / speed);

      if (charCount >= text.length) {
        setDisplayedText(text);
        setIsTyping(false);
        if (onComplete) onComplete();
        clearInterval(intervalRef.current);
      } else {
        setDisplayedText(text.substring(0, charCount));
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, onComplete]);

  return (
    <div className="relative prose dark:prose-invert max-w-none markdown">
      <ReactMarkdown
        components={MarkDownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {displayedText || "\u200B"}
      </ReactMarkdown>
      {isTyping && (
        <motion.span
          animate={{
            opacity: [1, 0.6, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-sm italic font-mono text-gray-500 dark:text-white/40"
        >
          typing...
        </motion.span>
      )}
    </div>
  );
};

export default TypingEffect;