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

    isStreaming: false,
    streamingMessage: "",
    streamingId: null,
    lastMessageId: null,
    shouldShowTypingOnLastMessage: false,
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

        setIsStreaming: (state, action) => {
            state.isStreaming = action.payload;
        },
        setStreamingMessage: (state, action) => {
            state.streamingMessage =
                typeof action.payload === "string" ? action.payload : "";
        },
        appendToStreamingMessage: (state, action) => {
            const currentMessage =
                typeof state.streamingMessage === "string" ? state.streamingMessage : "";
            const newChunk =
                typeof action.payload === "string" ? action.payload : "";
            state.streamingMessage = currentMessage + newChunk;
        },
        clearStreamingMessage: (state) => {
            state.streamingMessage = "";
            state.isStreaming = false;
            state.streamingId = null;
        },
        setStreamingId: (state, action) => {
            state.streamingId = action.payload;
        },

        addUserMessage: (state, action) => {
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
        resetTypingEffect: (state) => {
            state.shouldShowTypingOnLastMessage = false;
            state.lastMessageId = null;
        },
    },

    extraReducers: (builder) => {
        builder
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

            .addCase(sendMessageStream.pending, (state) => {
                state.messageLoading = true;
                state.messageError = null;
                state.isStreaming = true;
                state.streamingMessage = "";
            })
            .addCase(sendMessageStream.fulfilled, (state) => {
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

            .addCase(createNewMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createNewMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                const newChat = action.payload.data.chat;
                
                state.chats.unshift(newChat);
                state.currentChat = newChat;
                state.error = null;
                state.success = true;
            })
            .addCase(createNewMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })

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
} = chatSlice.actions;

export default chatSlice.reducer;