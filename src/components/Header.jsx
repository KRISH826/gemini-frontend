import { RxMoon } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/ThemeSlice";
import { RxSun } from "react-icons/rx";
import { motion } from "motion/react";
import { HiOutlineBars3 } from "react-icons/hi2";

const Header = ({handleCollapse, mobileSidebar}) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  console.log(mobileSidebar);
  return (
    <header className="flex w-full border-b-gray-100 dark:border-b-gray-100/20 border-b mx-auto justify-between items-center py-2.5">
      <div className="logo flex gap-2 items-center">
        <button onClick={handleCollapse} className="p-0 lg:hidden block cursor-pointer bg-transparent">
          <HiOutlineBars3 className="text-lg dark:text-white text-slate-950" />
        </button>
        <span className="text-[22px] dark:text-white text-main-dark">
          Gemini
        </span>
      </div>
      <div className="flex gap-3 items-center">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="px-3 py-2 rounded-md overflow-hidden cursor-pointer text-main-dark2 bg-light-gray hover:bg-gray-200 dark:bg-dark-aside dark:text-white dark:hover:bg-dark-hover text-sm transition"
        >
          {theme === "light" ? (
            <motion.div
              key="sun-icon"
              initial={{ translateX: -30, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <RxSun className="text-lg" />
            </motion.div>
          ) : (
            <motion.div
              key="moon-icon"
              initial={{ translateX: 30, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <RxMoon className="text-lg" />
            </motion.div>
          )}
        </button>
        <div className="avatar">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80"
            className="w-10
            h-10 rounded-full object-cover"
            alt=""
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
