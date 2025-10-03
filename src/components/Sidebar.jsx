import React from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosImages } from "react-icons/io";
import ChatList from "./ChatList";
import { Link } from "react-router";

const Sidebar = () => {
  const [collapse, setCollapse] = React.useState(false);
  console.log(collapse);

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <aside
      className={`${
        collapse ? "justify-center w-[70px] items-center" : "w-[265px]"
      } py-6 px-4 lg:flex hidden dark:bg-dark-aside fixed top-0 left-0 transition-all duration-300 min-h-screen bg-[#f0f4f9] flex-col`}
    >
      <div className="collapse_btn">
        <button
          onClick={handleCollapse}
          className="p-0 cursor-pointer outline-0 focus:outline-0 border-0"
        >
          <HiOutlineBars3
            size={25}
            className="text-black/80 dark:text-white/80"
          />
        </button>
      </div>
      <div className="newchat mt-6">
        <Link
          to="/new-chat"
          className={` ${
            collapse
              ? "bg-transparent p-0 hover:bg-[#dfe3ee] w-[38px] h-[38px] flex justify-center items-center rounded-full"
              : "bg-[#e6eaf1] dark:bg-dark-hover/80 items-center justify-start w-full px-6 py-3"
          } rounded-[50px] transition-all duration-300 hover:bg-[#dfe3ee] hover:dark:bg-dark-hover flex gap-1.5 text-gray-500 cursor-pointer`}
        >
          <FiPlus
            size={!collapse ? 26 : 24}
            className="text-gray-500 dark:text-white"
          />
          {!collapse && <span className=" dark:text-white">New Chat</span>}
        </Link>
      </div>
      <div className="chats flex-1">
        {!collapse && <ChatList collapse={collapse} />}
      </div>
      <div className="listing">
        <ul className={`flex flex-col ${collapse ? "gap-4" : "gap-2"}`}>
          <li>
            <Link
              to="/"
              className={`${
                collapse
                  ? "p-0 bg-transparent hover:bg-transparent"
                  : "py-2 px-2 hover:bg-[#e6eaf1] dark:hover:bg-dark-hover"
              } flex rounded-3xl dark:text-white cursor-pointer transition-all duration-300 items-center gap-2`}
            >
              <IoIosImages size={23} />
              {!collapse && <span>Create Images</span>}
            </Link>
          </li>
          <li>
            <a
              className={`${
                collapse
                  ? "p-0 bg-transparent hover:bg-transparent"
                  : "py-2 px-2 hover:bg-[#e6eaf1] dark:hover:bg-dark-hover"
              } flex rounded-3xl dark:text-white cursor-pointer transition-all duration-300 items-center gap-2`}
            >
              <IoSettingsOutline size={23} />
              {!collapse && <span>Settings</span>}
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
