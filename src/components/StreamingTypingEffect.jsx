// StreamingTypingEffect.js
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkDownComponents } from "./markdown/MarkDown";
import {motion} from "motion/react";

const StreamingTypingEffect = ({
  streamingText,
  isStreaming,
  finalText = "",
  speed = 30,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      // 🟢 While streaming → just show the incoming text directly
      setDisplayedText(streamingText);
      setIsTyping(false);
    } else if (finalText) {
      // 🟡 After streaming ends → simulate typing effect
      setDisplayedText("");
      setIsTyping(true);
      let index = 0;

      function typeChar() {
        if (index < finalText.length) {
          setDisplayedText((prev) => prev + finalText[index]);
          index++;
          const nextSpeed = speed + Math.random() * 60; // add variation
          setTimeout(typeChar, nextSpeed);
        } else {
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }

      typeChar();
    }
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
