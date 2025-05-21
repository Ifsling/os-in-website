import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export type GameNames =
  | "2048"
  | "Hangman"
  | "Minesweeper"
  | "Snake"
  | "Memory Game"
  | "Tic Tac Toe"

export interface OpenedGameNames {
  name: (GameNames | null)[]
}

const initialState: OpenedGameNames = {
  name: [],
}

export const openedGame = createSlice({
  name: "openedGame",
  initialState,
  reducers: {
    setOpenedGameName: (state, action: PayloadAction<GameNames>) => {
      state.name.push(action.payload)
    },

    removeOpenedGameName: (state, action: PayloadAction<GameNames>) => {
      state.name = state.name.filter((name) => name !== action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { removeOpenedGameName, setOpenedGameName } = openedGame.actions
export default openedGame.reducer
