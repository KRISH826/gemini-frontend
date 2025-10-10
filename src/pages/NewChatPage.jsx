import { useEffect } from "react";
import Heading from "../components/Heading";
import MainInput from "../components/MainInput";
import Suggestions from "../components/Suggestions";
import { clearInput } from "../redux/suggestion/SuggestionSlice";
import { useDispatch } from "react-redux";

const NewChatPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearInput());
    };
  }, [dispatch]);
  return (
    <>
      <div className="mx-auto main-wrapper flex flex-col justify-center pt-5 min-h-[calc(100dvh-64px)]">
        <div className="flex-1 flex flex-col justify-center">
          <Heading />
          <Suggestions />
        </div>
        <MainInput />
      </div>
    </>
  );
};

export default NewChatPage;
