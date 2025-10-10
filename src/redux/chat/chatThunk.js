import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewChatApi,
  deleteChatApi,
  getAllChatsApi,
  getChatByIdApi,
  sendMessageApi,
  sendMessageStreamApi,
} from "./chatApi";
import {
  addUserMessage,
  setIsStreaming,
  clearStreamingMessage,
  appendToStreamingMessage,
  finalizeStreamingMessage,
  updateChatTitle,
} from "./chatSlice";

export const getAllChats = createAsyncThunk(
  "/gemini/allchat",
  async (_, thunkAPI) => {
    try {
      const result = await getAllChatsApi();
      return result;
    } catch (error) {
      console.error("❌ API call failed:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      const err = error;
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to get chats"
      );
    }
  }
);

export const getChatById = createAsyncThunk(
  "/gemini/getchat",
  async (chatId, thunkAPI) => {
    try {
      const result = await getChatByIdApi(chatId);
      return result;
    } catch (error) {
      console.error("❌ API call failed:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      const err = error;
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to get chats"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "/gemini/sendmessage",
  async ({ chatId, message }, thunkAPI) => {
    try {
      const result = await sendMessageApi(chatId, message);
      return { chatId, message: result.message };
    } catch (error) {
      console.error("❌ API call failed:", error);
      const err = error;
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to send message"
      );
    }
  }
);

export const createNewMessage = createAsyncThunk(
  "/gemini/createnewchat",
  async (message, thunkAPI) => {
    try {
      const result = await createNewChatApi(message);
      return result;
    } catch (error) {
      console.error("❌ API call failed:", error);
      const err = error;
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create new chat"
      );
    }
  }
);

export const sendMessageStream = createAsyncThunk(
  "/gemini/sendmessage/stream",
  async ({ chatId, message, isFirstMessage = false }, thunkAPI) => {
    try {
      if (!isFirstMessage) {
        thunkAPI.dispatch(addUserMessage(message));
      }

      thunkAPI.dispatch(setIsStreaming(true));
      thunkAPI.dispatch(clearStreamingMessage());

      return new Promise((resolve, reject) => {
        sendMessageStreamApi(
          chatId,
          message,
          (chunk) => {
            if (typeof chunk === "string") {
              thunkAPI.dispatch(appendToStreamingMessage(chunk));
            }
          },
          (finalData) => {
            thunkAPI.dispatch(finalizeStreamingMessage());

            if (finalData?.title) {
              thunkAPI.dispatch(updateChatTitle(finalData.title));
            }

            const safeMessage =
              typeof finalData?.fullMessage === "string"
                ? finalData.fullMessage
                : thunkAPI.getState().chat.streamingMessage || "";

            resolve({
              chatId,
              message: safeMessage,
            });
          },
          (error) => {
            thunkAPI.dispatch(clearStreamingMessage());
            reject(new Error(error));
          }
        );
      });
    } catch (error) {
      console.error("❌ Streaming failed:", error);
      thunkAPI.dispatch(clearStreamingMessage());
      return thunkAPI.rejectWithValue(
        error.message || "Failed to send message"
      );
    }
  }
);

export const deleteChat = createAsyncThunk(
  "/gemini/deletechat",
  async (chatId, thunkAPI) => {
    try {
      const result = await deleteChatApi(chatId);
      return result;
    } catch (error) {
      console.error("❌ API call failed:", error);
      const err = error;
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete chat"
      );
    }
  }
);