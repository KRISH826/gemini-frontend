// chatSlice.js - FINAL FIX with pending message preservation
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

            // ✅ CRITICAL FIX: Preserve pending message when fetching chat
            .addCase(getChatById.pending, (state) => {
                console.log("🔵 getChatById.pending - pendingMessage:", state.pendingMessage);
                state.isLoading = true;
                state.messageError = null;
            })
            .addCase(getChatById.fulfilled, (state, action) => {
                console.log("🟢 getChatById.fulfilled - pendingMessage:", state.pendingMessage);
                console.log("🟢 Fetched messages:", action.payload.data.chat.messages);
                
                state.isLoading = false;
                const fetchedChat = action.payload.data.chat;
                
                // ✅ If pending message exists, add it to messages
                if (state.pendingMessage) {
                    console.log("✅ Adding pending message to chat");
                    const hasPendingInMessages = fetchedChat.messages?.some(
                        msg => msg.content === state.pendingMessage && msg.role === "user"
                    );
                    
                    if (!hasPendingInMessages) {
                        console.log("✅ Pending not in messages, adding it");
                        // Add pending message to beginning if not already there
                        fetchedChat.messages = [
                            {
                                role: "user",
                                content: state.pendingMessage,
                                timestamp: new Date().toISOString(),
                                id: Date.now(),
                            },
                            ...(fetchedChat.messages || [])
                        ];
                    } else {
                        console.log("⚠️ Pending already in messages");
                    }
                } else {
                    console.log("❌ No pending message");
                }
                
                console.log("🟢 Final messages:", fetchedChat.messages);
                state.currentChat = fetchedChat;
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
                console.log("🔵 sendMessageStream.pending - pendingMessage:", state.pendingMessage);
                state.messageLoading = true;
                state.messageError = null;
                state.isStreaming = true;
                state.streamingMessage = "";
                // ❌ DON'T clear pending here - wait for stream to complete!
            })
            .addCase(sendMessageStream.fulfilled, (state) => {
                console.log("🟢 sendMessageStream.fulfilled - Clearing pending");
                state.messageLoading = false;
                state.messageError = null;
                state.messageSuccess = true;
                state.isStreaming = false;
                // ✅ Clear pending AFTER stream completes
                state.pendingMessage = null;
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
                console.log("🔵 createNewMessage.pending - pendingMessage:", state.pendingMessage);
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createNewMessage.fulfilled, (state, action) => {
                console.log("🟢 createNewMessage.fulfilled - pendingMessage:", state.pendingMessage);
                state.isLoading = false;
                const newChat = action.payload.data.chat;
                
                // ✅ If pending message exists, add it immediately
                if (state.pendingMessage) {
                    console.log("✅ Adding pending to new chat");
                    newChat.messages = [
                        {
                            role: "user",
                            content: state.pendingMessage,
                            timestamp: new Date().toISOString(),
                            id: Date.now(),
                        }
                    ];
                } else {
                    console.log("❌ No pending in createNewMessage");
                }
                
                console.log("🟢 New chat messages:", newChat.messages);
                state.chats.unshift(newChat);
                state.currentChat = newChat;
                state.error = null;
                state.success = true;
            })
            .addCase(createNewMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
                state.pendingMessage = null; // Clear on error
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
    setPendingMessage,
} = chatSlice.actions;

export default chatSlice.reducer;