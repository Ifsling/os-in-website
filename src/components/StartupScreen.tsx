"use client"

import { Button, Progress } from "@heroui/react"
import { FC, useEffect, useState } from "react"
import { FaApple, FaPowerOff } from "react-icons/fa"
import { setDeviceState } from "src/redux/features/deviceState"
import { useAppDispatch } from "src/redux/hooks"

const StartupScreen: FC = () => {
  const dispatch = useAppDispatch()
  const [buttonPressed, setButtonPressed] = useState(false)
  const [value, setValue] = useState(0)
  const [bootComplete, setBootComplete] = useState(false)

  useEffect(() => {
    if (buttonPressed) {
      const sound = new Audio("/audio/mac-startup-sound.mp3")
      sound.play()

      const interval = setInterval(() => {
        setValue((prevValue) => {
          if (prevValue >= 100) {
            clearInterval(interval)
            setBootComplete(true)
            return 100
          }
          return prevValue + 2
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [buttonPressed])
  console.log(value)

  useEffect(() => {
    if (bootComplete) {
      dispatch(setDeviceState("locked"))
    }
  }, [bootComplete, dispatch])

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      {!buttonPressed && (
        <Button color="danger" onPress={() => setButtonPressed(true)}>
          <FaPowerOff />
        </Button>
      )}

      {buttonPressed && (
        <div className="flex flex-col items-center">
          <FaApple size={100} className="text-white" />
          <br />
          <Progress
            className="w-48"
            classNames={{ indicator: "bg-white" }}
            aria-label="Loading..."
            size="sm"
            value={value}
          />
        </div>
      )}
    </div>
  )
}

export default StartupScreen
