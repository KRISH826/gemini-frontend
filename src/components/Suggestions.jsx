import { useDispatch } from "react-redux";
import { IoCompassOutline, IoCodeSlashOutline } from "react-icons/io5";
import { GoLightBulb } from "react-icons/go";
import { FiMessageSquare } from "react-icons/fi";
import { setInputValue } from "../redux/suggestion/SuggestionSlice";
import { motion } from "motion/react";

const suggestions = [
  {
    _id: 1,
    text: "Suggest beautiful places to see on an upcoming road trip",
    icon: <IoCompassOutline size={26} />,
  },
  {
    _id: 2,
    text: "Briefly summarize this concept: urban planning",
    icon: <GoLightBulb size={24} />,
  },
  {
    _id: 3,
    text: "Brainstorm team bonding activities for our work retreat",
    icon: <FiMessageSquare size={22} />,
  },
  {
    _id: 4,
    text: "Tell me about React js and React native",
    icon: <IoCodeSlashOutline size={20} />,
  },
];

const Suggestions = () => {
  const dispatch = useDispatch();
  const handleSuggestionClick = async (text) => {
      dispatch(setInputValue(text));
  };

  return (
    <div className="suggestion_row mt-16">
      <motion.div
        className="grid lg:grid-cols-4 grid-cols-2 gap-4"
        animate={{ translateY: 0 }}
        initial={{ translateY: 20 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {suggestions.map((item) => (
          <div
            key={item._id}
            onClick={() => handleSuggestionClick(item.text)}
            className="relative p-4 dark:text-white/80 hover:bg-card-hover-gray dark:hover:bg-dark-card-hover transition-all rounded-lg lg:h-[210px] cursor-pointer dark:bg-dark-card bg-light-gray"
          >
            <p className="sm:text-start text-center sm:text-base text-sm ">{item.text}</p>
            <div className="absolute lg:flex hidden bg-white dark:text-dark-aside w-10 h-10 rounded-full justify-center items-center bottom-2 right-2">
              {item.icon}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Suggestions;
