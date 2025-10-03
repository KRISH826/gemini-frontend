import React, { useEffect, useState, useRef } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { MarkDownComponents } from "./markdown/MarkDown";
import { motion } from "motion/react";

const TypingEffect = ({ text, speed = 18, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const frameRef = useRef(null);

  useEffect(() => {
    if (typeof text !== "string" || !text.trim() || text === "undefined") {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    let lastTime = 0;

    const step = (time) => {
      if (time - lastTime >= speed) {
        if (index < text.length) {
          // Append 1 more char instead of slicing whole text
          setDisplayedText((prev) => prev + text.charAt(index));
          index++;
          lastTime = time;
        } else {
          setIsTyping(false);
          if (onComplete) onComplete();
          return;
        }
      }
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, speed, onComplete]);

  return (
    <div className="relative prose dark:prose-invert max-w-none markdown">
      {/* Markdown rendering */}
      <ReactMarkdown
        components={MarkDownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {displayedText || "\u200B"}
      </ReactMarkdown>
      {/* Blinking cursor */}
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
