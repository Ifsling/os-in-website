import { configureStore } from "@reduxjs/toolkit"

import deviceStateReducer from "./features/deviceState"
import openedGameReducer from "./features/openedGame"
import openedSoftwareReducer from "./features/openedSoftware"
import userNameReducer from "./features/user"

export const store = configureStore({
  reducer: {
    user: userNameReducer,
    openedSoftware: openedSoftwareReducer,
    openedGame: openedGameReducer,
    deviceState: deviceStateReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
