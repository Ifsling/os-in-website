"use client"

import { Button } from "@heroui/react"
import { FC } from "react"
import { setDeviceState } from "src/redux/features/deviceState"
import { useAppDispatch } from "src/redux/hooks"

const BsodScreen: FC = () => {
  const dispatch = useAppDispatch()

  const sound = new Audio("/audio/xp-error-sound.mp3")
  sound.play()

  const onRestartClicked = () => {
    dispatch(setDeviceState("locked"))
  }

  return (
    <>
      <div className=" relative w-screen h-screen bg-[url('/images/bsod.png')]">
        <Button
          className="absolute bottom-0 right-0"
          color="danger"
          onPress={onRestartClicked}
        >
          Restart
        </Button>
      </div>
    </>
  )
}

export default BsodScreen
