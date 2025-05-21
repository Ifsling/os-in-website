import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export type SoftwareNames =
  | "None"
  | "Finder"
  | "Browser"
  | "Terminal"
  | "Calculator"
  | "Notepad"
  | "Activity Monitor"
  | "Folder"

export interface OpenedSoftwareType {
  name: SoftwareNames
}

const initialState: OpenedSoftwareType = {
  name: "None",
}

export const openedSoftware = createSlice({
  name: "openedSoftware",
  initialState,
  reducers: {
    setSoftwareName: (state, action: PayloadAction<SoftwareNames>) => {
      state.name = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSoftwareName } = openedSoftware.actions
export default openedSoftware.reducer
