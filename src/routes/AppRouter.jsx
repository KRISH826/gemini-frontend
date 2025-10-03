import React from "react";
import { Route, Routes } from "react-router";
import LazyWrapper from "./LazyWrapper";
import ChatPage from "../pages/ChatPage";
import NewChatPage from "../pages/NewChatPage";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <LazyWrapper>
              <NewChatPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <LazyWrapper>
              <ChatPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/new-chat"
          element={
            <LazyWrapper>
              <NewChatPage />
            </LazyWrapper>
          }
        />
      </Routes>
    </>
  );
};

export default AppRouter;
