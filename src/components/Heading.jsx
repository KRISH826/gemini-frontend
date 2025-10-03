import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

const Heading = () => {
  const textRef = React.useRef(null);
  const [greeting, setGreeting] = useState("");
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    let dynamicGreeting = "Good Evening, Dev."; // Default fallback

    if (currentHour >= 5 && currentHour < 12) {
      dynamicGreeting = "Good Morning, Dev.";
    } else if (currentHour >= 12 && currentHour < 18) {
      dynamicGreeting = "Good Afternoon, Dev.";
    } else if (currentHour >= 18 && currentHour < 22) {
      dynamicGreeting = "Good Evening, Dev.";
    } else {
      // 22:00 to 04:59
      dynamicGreeting = "Go For Sleep, Dev.";
    }
    return dynamicGreeting;
  };
  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.innerText = greeting;
    }
  }, [greeting]);

  return (
    <>
      <div className="main_heading text-start">
        <h1 className="2xl:text-[50px] duration-300 xl:text-[42px] leading-[1.275] lg:text-4xl sm:text-3xl text-2xl text-heading-gray dark:text-white/90 font-medium">
          <motion.div
            className="gradient_text"
            animate={{ translateY: 0, opacity: 1 }}
            initial={{ translateY: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0, ease: "easeIn" }}
            ref={textRef}
          ></motion.div>
          <motion.span
            animate={{ translateY: 0, opacity: 1 }}
            initial={{ translateY: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0, ease: "easeIn" }}
            className="block"
          >
            How can I help you today?
          </motion.span>
        </h1>
      </div>
    </>
  );
};

export default Heading;
