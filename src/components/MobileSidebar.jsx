import React from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosImages } from "react-icons/io";
import ChatList from "./ChatList";
import { Link } from "react-router";

const MobileSidebar = ({ handleCollapse, mobileSidebar }) => {
  
  return (
    <>
      <aside
        className={`fixed lg:hidden top-0 left-0 z-50 min-h-screen w-[265px] py-6 px-4 flex flex-col bg-[#f0f4f9] dark:bg-dark-aside
        transition-transform duration-300 ease-in-out
       ${mobileSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="newchat mt-6">
          <Link
            to="/new-chat"
            onClick={handleCollapse}
            className={`flex gap-1.5 items-center cursor-pointer rounded-[50px] transition-all duration-300 text-gray-500
              w-full px-6 py-3 bg-[#e6eaf1] dark:bg-dark-hover/80 hover:bg-[#dfe3ee] hover:dark:bg-dark-hover
            `}
          >
            <FiPlus
              size={!mobileSidebar ? 26 : 22}
              className="text-gray-500 dark:text-white"
            />
            <span className="dark:text-white">New Chat</span>
          </Link>
        </div>

        <div className="chats flex-1 mt-4">
          <ChatList mobileSidebar={mobileSidebar} handleCollapse={handleCollapse} />
        </div>

        <div className="listing mt-4">
          <ul className={`flex flex-col ${mobileSidebar ? "gap-4" : "gap-2"}`}>
            <li>
              <Link
                to="/"
                className={`flex items-center gap-2 rounded-3xl transition-all duration-300 dark:text-white py-2 px-2 hover:bg-[#e6eaf1] dark:hover:bg-dark-hover`}
              >
                <IoIosImages size={23} />
                <span>Create Images</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center gap-2 rounded-3xl transition-all duration-300 dark:text-white py-2 px-2 hover:bg-[#e6eaf1] dark:hover:bg-dark-hover`}
              >
                <IoSettingsOutline size={23} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      <div
        onClick={handleCollapse}
        className={`fixed lg:hidden inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300
        ${mobileSidebar ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
    </>
  );
};

export default MobileSidebar;
