import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getChatById } from "../redux/chat/chatThunk";
import { resetTypingEffect } from "../redux/chat/chatSlice";
import MainInput from "../components/MainInput";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TypingEffect from "../components/TypingEffect";
import { MarkDownComponents } from "../components/markdown/MarkDown";
import { motion, AnimatePresence } from "motion/react";
import "./../App.css";
import loader from "../assets/gemini-color.svg";

const ChatPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const hasFetchedRef = useRef(null); // Track last fetched ID

  const {
    currentChat,
    messageLoading,
    isStreaming,
    streamingMessage,
    shouldShowTypingOnLastMessage,
    lastMessageId,
  } = useSelector((state) => state.chat);

  // Fetch chat when ID changes
  useEffect(() => {
    console.log("🔵 ChatPage useEffect - ID:", id, "Last fetched:", hasFetchedRef.current);
    if (id && id !== hasFetchedRef.current) {
      console.log("📥 Fetching chat:", id);
      dispatch(getChatById(id));
      dispatch(resetTypingEffect());
      hasFetchedRef.current = id;
    }
  }, [id, dispatch]);

  // Smooth scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentChat?.messages, streamingMessage, messageLoading]);

  const shouldShowTypingEffect = (index, msg) => {
    return (
      index === currentChat?.messages?.length - 1 &&
      msg.role === "assistant" &&
      !isStreaming &&
      shouldShowTypingOnLastMessage &&
      (msg.id === lastMessageId || !msg.id)
    );
  };

  return (
    <div className="flex-1 main-wrapper flex flex-col h-[calc(100vh-64px)]">
      {isLoading && !currentChat ? (
        <div className="mx-auto flex-1 flex justify-center items-center flex-col">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hide sm:px-4 py-5"
        >
          <div className="max-w-4xl mx-auto h-full">
            <div className="flex flex-col gap-8 pb-4 h-full">
              {currentChat?.messages?.length > 0 ? (
                <>
                  {currentChat.messages.map((msg, i) => {
                    const isLastMessage = i === currentChat.messages.length - 1;
                    const isAssistant = msg.role === "assistant";
                    const showTyping = shouldShowTypingEffect(i, msg);

                    return (
                      <motion.div
                        key={msg.id || i}
                        className={`flex ${
                          isAssistant
                            ? "justify-start model_response"
                            : "justify-end"
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeIn" }}
                      >
                        <div
                          className={`${
                            isAssistant &&
                            isLastMessage &&
                            "min-h-[calc(100vh-280px)]"
                          }`}
                        >
                          <motion.div
                            className={`font-normal max-w-full ${
                              msg.role === "user"
                                ? "chat_bubble_user dark:text-white/90 bg-bubble-color dark:bg-[#1d1f2f] text-main-dark2"
                                : "text-main-dark2 dark:text-white/90 font-medium"
                            }`}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                            {showTyping ? (
                              <TypingEffect
                                text={
                                  typeof msg.content === "string"
                                    ? msg.content
                                    : ""
                                }
                                speed={18}
                              />
                            ) : (
                              <ReactMarkdown
                                components={MarkDownComponents}
                                remarkPlugins={[remarkGfm]}
                              >
                                {typeof msg.content === "string"
                                  ? msg.content
                                  : ""}
                              </ReactMarkdown>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                  {/* Loading/Streaming indicators */}
                  {messageLoading || (isStreaming && !streamingMessage) ? (
                    <AnimatePresence>
                      <motion.div
                        key="ai-loader"
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="text-main-dark2 font-medium min-h-[calc(100vh-280px)]">
                          <div className="flex items-center gap-2">
                            <motion.img
                              animate={{
                                rotate: [0, 360, 360, 0],
                              }}
                              transition={{
                                duration: 2.25,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              src={loader}
                              alt="loader"
                              className="w-7 h-7"
                            />
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
                              Gemini is thinking...
                            </motion.span>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <AnimatePresence>
                      {isStreaming &&
                        (streamingMessage?.trim() || "") !== "" && (
                          <motion.div
                            key="streaming-message"
                            className="flex justify-start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <div className="text-main-dark2 markdown font-medium max-w-full">
                              <ReactMarkdown
                                components={MarkDownComponents}
                                remarkPlugins={[remarkGfm]}
                              >
                                {streamingMessage || ""}
                              </ReactMarkdown>
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  )}
                </>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}
      <div className="flex-shrink-0">
        <MainInput />
      </div>
    </div>
  );
};

export default ChatPage;