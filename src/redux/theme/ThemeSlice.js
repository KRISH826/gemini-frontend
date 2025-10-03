import { createSlice } from "@reduxjs/toolkit";

const getSystemTheme = () => {
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const initialTheme = localStorage.getItem("theme") || getSystemTheme();

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        mode: initialTheme
    },
    reducers: {
        setTheme: (state, action) => {
            state.mode = action.payload;
            localStorage.setItem("theme", action.payload);
            document.documentElement.classList.toggle("dark", action.payload === "dark");
        },
        toggleTheme: (state) => {
            const newTheme = state.mode === "light" ? "dark" : "light";
            state.mode = newTheme;
            localStorage.setItem("theme", newTheme);
            document.documentElement.classList.toggle("dark", newTheme === "dark");
        }
    }
})

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;