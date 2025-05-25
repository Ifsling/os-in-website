"use client"

import { Spinner } from "@heroui/react"
import { FC } from "react"
import { useAppDispatch, useAppSelector } from "src/redux/hooks"
import Dock from "../dock/Dock"
import LockedDevice from "../LockedDevice"
import Menubar from "../Menubar"
import StartupScreen from "../StartupScreen"
import BsodScreen from "../update-handler/BsodScreen"
import UpdateHandler from "../update-handler/UpdateHandler"
import OpenedGame from "./OpenedGame"
import OpenedSoftware from "./OpenedSoftware"
import OpenSound from "./OpenSound"

const Desktop: FC = () => {
  const dispatch = useAppDispatch()

  const deviceState = useAppSelector((state) => state.deviceState.state)

  if (deviceState === "locked") {
    return (
      <>
        <div className=" relative w-screen h-screen bg-[url('/images/desktop-bg.jpg')]">
          <Menubar />
          <LockedDevice />
        </div>
      </>
    )
  } else if (deviceState === "loading") {
    return (
      <>
        <div className=" relative w-screen h-screen bg-[url('/images/desktop-bg-2.jpg')]">
          <Menubar />
          <div className="flex w-screen h-screen justify-center items-center">
            <Spinner />
          </div>
        </div>
      </>
    )
  } else if (deviceState === "bsod") {
    return <BsodScreen />
  } else if (deviceState === "starting") {
    return <StartupScreen />
  } else
    return (
      <>
        <div className=" relative w-screen h-screen bg-[url('/images/desktop-bg.jpg')]">
          <UpdateHandler />
          <Menubar />
          <OpenSound />
          <OpenedSoftware />
          <OpenedGame />
          <Dock />
        </div>
      </>
    )
}

export default Desktop
