import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { deleteChat, getAllChats } from "../redux/chat/chatThunk";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { motion } from "framer-motion";

const truncateText = (text, maxLength = 27) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const ChatList = ({ collapse, handleCollapse }) => {
  const dispatch = useDispatch();
  const { isLoading, chats, currentChat } = useSelector((state) => state.chat);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllChats());
  }, [dispatch]);

  const handleChatDelete = async (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const isDeletingCurrentChat = currentChat?._id === chatId;
      await dispatch(deleteChat(chatId)).unwrap();

      if (isDeletingCurrentChat) {
        navigate("/");
      }
      dispatch(getAllChats());
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <div className="chatlist h-full mt-5">
      {!collapse && (
        <h2 className="text-lg dark:text-white text-main-dark2 mb-3">Recent</h2>
      )}

      <div className="chatlists mt-4">
        {!isLoading && chats.length === 0 && (
          <div className="flex justify-center items-center flex-1 h-full">
            <h2 className="text-lg dark:text-white text-main-dark2 mb-3">
              No Chats
            </h2>
          </div>
        )}

        <ul className="flex flex-col mx-[-5px] gap-1">
          {chats.map((chat) => (
            <motion.li
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              exit={{ opacity: 0 }}
              key={chat._id}
              onClick={handleCollapse}
              className="relative overflow-hidden group"
            >
              {/* Chat Item */}
              <NavLink
                to={`/chat/${chat._id}`}
                className={({ isActive }) => `
                  ${isActive ? "bg-main-gray dark:bg-dark-hover" : ""}
                  px-3 hover:bg-main-gray dark:hover:bg-dark-hover py-3 rounded-4xl
                  flex gap-1.5 items-center dark:text-white/80 relative overflow-hidden text-main-dark
                `}
              >
                {!collapse && (
                  <span className="flex-1 text-[15px] leading-none text-ellipsis">
                    {truncateText(chat.title)}
                  </span>
                )}
              </NavLink>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <FaRegTrashAlt
                    className="
                      absolute top-1/2 -translate-y-1/2 
                      lg:right-[-20px] right-[6px] group-hover:right-[6px]
                      transition-all duration-500 cursor-pointer text-red-500
                    "
                  />
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-[#171819]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this chat and its messages from your list.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => handleChatDelete(e, chat._id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
