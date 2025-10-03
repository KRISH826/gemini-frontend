// chatSlice.js - Updated with safe streaming support
import { createSlice } from "@reduxjs/toolkit";
import {
    createNewMessage,
    deleteChat,
    getAllChats,
    getChatById,
    sendMessage,
    sendMessageStream,
} from "./chatThunk";

const initialState = {
    chats: [],
    currentChat: null,
    isLoading: false,
    error: null,
    success: false,

    messageLoading: false,
    messageError: null,
    messageSuccess: false,

    // ✅ Streaming-related
    isStreaming: false,
    streamingMessage: "",   // start as empty string (NOT null)
    streamingId: null,
    lastMessageId: null,
    shouldShowTypingOnLastMessage: false,
    pendingMessage: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        resetChatState: (state) => {
            state.success = false;
            state.error = null;
        },
        clearCurrentChat: (state) => {
            state.currentChat = null;
        },
        clearError: (state) => {
            state.error = null;
        },

        // --- Streaming helpers ---
        setIsStreaming: (state, action) => {
            state.isStreaming = action.payload;
        },
        setStreamingMessage: (state, action) => {
            state.streamingMessage =
                typeof action.payload === "string" ? action.payload : "";
            console.log("🔄 setStreamingMessage:", state.streamingMessage);
        },
        appendToStreamingMessage: (state, action) => {
            const currentMessage =
                typeof state.streamingMessage === "string" ? state.streamingMessage : "";
            const newChunk =
                typeof action.payload === "string" ? action.payload : "";
            state.streamingMessage = currentMessage + newChunk;
            console.log("🔄 appendToStreamingMessage:", {
                currentMessage,
                newChunk,
                result: state.streamingMessage,
            });
        },
        clearStreamingMessage: (state) => {
            state.streamingMessage = "";
            state.isStreaming = false;
            state.streamingId = null;
        },
        setStreamingId: (state, action) => {
            state.streamingId = action.payload;
        },

        // --- Messages ---
        addUserMessage: (state, action) => {
            console.log("🔄 addUserMessage:", action.payload);
            if (state.currentChat && state.currentChat.messages) {
                state.currentChat.messages.push({
                    role: "user",
                    content: typeof action.payload === "string" ? action.payload : "",
                    timestamp: new Date().toISOString(),
                });
            }
        },
        finalizeStreamingMessage: (state) => {
            const messageContent =
                typeof state.streamingMessage === "string" &&
                    state.streamingMessage !== "undefined"
                    ? state.streamingMessage
                    : "";

            if (messageContent.trim()) {
                const newMessage = {
                    role: "assistant",
                    content: messageContent,
                    timestamp: new Date().toISOString(),
                    id: Date.now(),
                };
                state.currentChat.messages.push(newMessage);
                state.lastMessageId = newMessage.id;
                state.shouldShowTypingOnLastMessage = true;
            }

            state.isStreaming = false;
            state.streamingMessage = "";
        },


        updateChatTitle: (state, action) => {
            if (state.currentChat) {
                state.currentChat.title = action.payload;
            }
        },
        setPendingMessage: (state, action) => {
            state.pendingMessage = action.payload;
        },
        resetTypingEffect: (state) => {
            state.shouldShowTypingOnLastMessage = false;
            state.lastMessageId = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // --- All Chats ---
            .addCase(getAllChats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllChats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chats = action.payload.data.chats;
                state.error = null;
                state.success = true;
            })
            .addCase(getAllChats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })

            // --- Get Chat by ID ---
            .addCase(getChatById.pending, (state) => {
                state.isLoading = true;
                state.messageError = null;
            })
            .addCase(getChatById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentChat = action.payload.data.chat;
                state.messageError = null;
                state.messageSuccess = true;
                state.shouldShowTypingOnLastMessage = false;
                state.lastMessageId = null;
            })
            .addCase(getChatById.rejected, (state, action) => {
                state.isLoading = false;
                state.messageError = action.payload;
                state.messageSuccess = false;
            })

            // --- Streaming Message ---
            .addCase(sendMessageStream.pending, (state) => {
                state.messageLoading = true;
                state.messageError = null;
                state.isStreaming = true;
                state.streamingMessage = ""; // ✅ reset safely
            })
            .addCase(sendMessageStream.fulfilled, (state) => {
                // finalization happens via finalizeStreamingMessage reducer
                state.messageLoading = false;
                state.messageError = null;
                state.messageSuccess = true;
                state.isStreaming = false;
            })
            .addCase(sendMessageStream.rejected, (state, action) => {
                state.messageLoading = false;
                state.messageError = action.payload;
                state.messageSuccess = false;
                state.isStreaming = false;
                state.streamingMessage = "";
            })

            // --- Non-stream sendMessage ---
            .addCase(sendMessage.pending, (state) => {
                state.messageLoading = true;
                state.messageError = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messageLoading = false;
                if (state.currentChat && state.currentChat.messages) {
                    state.currentChat.messages.push(action.payload.message);
                }
                state.messageError = null;
                state.messageSuccess = true;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.messageLoading = false;
                state.messageError = action.payload;
                state.messageSuccess = false;
            })

            // --- New Chat ---
            .addCase(createNewMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createNewMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chats.unshift(action.payload.data.chat);
                state.currentChat = action.payload.data.chat;
                state.error = null;
                state.success = true;
            })
            .addCase(createNewMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })

            // --- Delete Chat ---
            .addCase(deleteChat.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chats = state.chats.filter(
                    (chat) => chat._id !== action.payload.data.chatId
                );
                if (state.currentChat && state.currentChat._id === action.payload.data.chatId) {
                    state.currentChat = null;
                }
                state.error = null;
                state.success = true;
            })
            .addCase(deleteChat.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const {
    resetChatState,
    clearCurrentChat,
    clearError,
    setIsStreaming,
    setStreamingMessage,
    appendToStreamingMessage,
    clearStreamingMessage,
    setStreamingId,
    addUserMessage,
    finalizeStreamingMessage,
    updateChatTitle,
    resetTypingEffect,
    setPendingMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
