import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkDownComponents } from "./markdown/MarkDown";
import { motion } from "motion/react";

const StreamingTypingEffect = ({
  streamingText,
  isStreaming,
  finalText = "",
  speed = 30,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isStreaming) {
      setDisplayedText(streamingText);
      setIsTyping(false);
    } else if (finalText) {
      setDisplayedText("");
      setIsTyping(true);
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const charCount = Math.floor(elapsed / speed);

        if (charCount >= finalText.length) {
          setDisplayedText(finalText);
          setIsTyping(false);
          if (onComplete) onComplete();
          clearInterval(intervalRef.current);
        } else {
          setDisplayedText(finalText.substring(0, charCount));
        }
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStreaming, streamingText, finalText, speed, onComplete]);

  return (
    <div className="relative prose dark:prose-invert max-w-none markdown animate-fade-in">
      <ReactMarkdown
        components={MarkDownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {displayedText}
      </ReactMarkdown>

      {(isStreaming || isTyping) && (
        <motion.span
          animate={{
            opacity: [1, 0.6, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-sm italic font-mono text-gray-500 dark:text-white"
        >
          Gemini is Responsing...
        </motion.span>
      )}
    </div>
  );
};

export default StreamingTypingEffect;