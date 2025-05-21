import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export type DeviceState =
  | "locked"
  | "unlocked"
  | "loading"
  | "bsod"
  | "starting"

export interface OpenedGameNames {
  state: DeviceState
}

const initialState: OpenedGameNames = {
  state: "starting",
}

export const deviceState = createSlice({
  name: "deviceState",
  initialState,
  reducers: {
    setDeviceState: (state, action: PayloadAction<DeviceState>) => {
      state.state = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setDeviceState } = deviceState.actions
export default deviceState.reducer
