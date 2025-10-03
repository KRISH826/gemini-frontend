// MainInput.js - OPTIMISTIC UI UPDATE VERSION
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { clearInput, setInputValue } from "../redux/suggestion/SuggestionSlice";
import { createNewMessage, sendMessageStream } from "../redux/chat/chatThunk";
import { setPendingMessage } from "../redux/chat/chatSlice";
import { motion } from "motion/react";

const MainInput = () => {
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const [resize, setresize] = useState(false);
  const textRef = useRef(null);
  const value = useSelector((state) => state.suggestion.value);
  const dispatch = useDispatch();

  const { messageLoading, isStreaming } = useSelector((state) => state.chat);

  useEffect(() => {
    if (!textRef.current) return;

    textRef.current.style.height = "auto";

    if (!value || value.trim() === "") {
      textRef.current.style.height = "34px";
      textRef.current.style.overflowY = "hidden";
      return;
    }
    let newHeight = textRef.current.scrollHeight;

    if (textRef.current.scrollHeight > 34) {
      setresize(true);
    }

    if (newHeight > 200) {
      newHeight = 200;
      textRef.current.style.overflowY = "auto";
    } else {
      textRef.current.style.overflowY = "hidden";
    }

    textRef.current.style.height = `${newHeight}px`;
  }, [value]);

  const handleSend = async () => {
    if (!value.trim() || messageLoading || isStreaming) return;
    const messageToSend = value.trim();

    // Clear input immediately for better UX
    dispatch(clearInput());
    if (textRef.current) {
      textRef.current.style.height = "34px";
      textRef.current.style.overflowY = "hidden";
    }

    if (chatId) {
      // Existing chat - normal flow
      dispatch(sendMessageStream({ chatId, message: messageToSend }));
    } else {
      // NEW CHAT - Set pending message FIRST
      console.log("🚀 Setting pending message:", messageToSend);
      dispatch(setPendingMessage(messageToSend));

      try {
        // Create new chat
        console.log("📝 Creating new chat...");
        const result = await dispatch(createNewMessage(messageToSend)).unwrap();
        const newid = result.data.chat._id;
        console.log("✅ Chat created, ID:", newid);

        // Navigate immediately
        console.log("🔄 Navigating to:", `/chat/${newid}`);
        navigate(`/chat/${newid}`, { replace: true });

        // Small delay for navigation to complete
        setTimeout(() => {
          console.log("📤 Sending message stream...");
          dispatch(sendMessageStream({ chatId: newid, message: messageToSend }));
        }, 100);
      } catch (error) {
        console.error("Error creating chat:", error);
        dispatch(setPendingMessage(null));
        alert("Failed to create new chat");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="main-wrapper pb-4 pt-3 mx-auto">
      <div
        className={`sm:px-6 px-4 sm:py-3 py-2 rounded-[40px] bg-light-gray dark:bg-dark-input flex gap-3 ${
          resize ? "items-end" : "items-center"
        }`}
      >
        <textarea
          transition={{ duration: 0.3, ease: "easeInOut" }}
          rows={1}
          value={value}
          onChange={(e) => dispatch(setInputValue(e.target.value))}
          ref={textRef}
          onKeyDown={handleKeyDown}
          placeholder={
            chatId ? "Enter a prompt here" : "Select a chat to start messaging"
          }
          disabled={messageLoading || isStreaming}
          className="w-full prompt_input resize-none py-1 h-[34px] bg-transparent outline-0 border-0 text-main-dark2 dark:text-slate-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
        <div className="flex items-center">
          <button className="w-10 cursor-pointer h-10 hover:bg-gray-200 dark:hover:bg-dark-hover rounded-full bg-main-blue dark:bg-transparent flex items-center justify-center transition-colors">
            <LuImagePlus
              strokeWidth={1.5}
              className="text-main-dark2 dark:text-slate-300"
              size={23}
            />
          </button>
          <button className="w-10 cursor-pointer h-10 hover:bg-gray-200 dark:hover:bg-dark-hover rounded-full bg-main-blue dark:bg-transparent flex items-center justify-center transition-colors">
            {value.trim().length > 0 ? (
              <IoMdSend
                onClick={handleSend}
                className={`cursor-pointer ${
                  messageLoading || isStreaming
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "text-main-dark2 dark:text-slate-300"
                }`}
                size={21}
              />
            ) : (
              <MdOutlineKeyboardVoice
                className="cursor-pointer text-main-dark2 dark:text-slate-300"
                size={23}
              />
            )}
          </button>
        </div>
      </div>
      <p className="text-center mt-2 text-main-dark2 dark:text-slate-400 sm:text-[12px] text-[10px]">
        Gemini may display inaccurate info. Double-check its responses.
      </p>
    </div>
  );
};

export default MainInput;