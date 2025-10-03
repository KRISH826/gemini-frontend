import { configureStore } from '@reduxjs/toolkit'
import chatReducer from "./chat/chatSlice.js"
import themeReducer from "./theme/ThemeSlice.js"
import suggestionReducer from "./suggestion/SuggestionSlice.js"

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    suggestion: suggestionReducer,
    theme: themeReducer
  },
})