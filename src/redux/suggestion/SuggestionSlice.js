import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: ""
}

export const SuggestionSlice = createSlice ({
    name: "suggestion",
    initialState,
    reducers:  {
        setInputValue: (state,action) => {
            state.value = action.payload
        },
        clearInput: (state) => {
            state.value = ""
        }
    }
})

export const {setInputValue, clearInput} = SuggestionSlice.actions;
export default SuggestionSlice.reducer