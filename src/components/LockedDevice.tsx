"use client"

import LockedDeviceImage from "@/public/components/login-components.png"
import { Input } from "@heroui/react"
import Image from "next/image"
import { FC, useState } from "react"
import { setDeviceState } from "src/redux/features/deviceState"
import { useAppDispatch } from "src/redux/hooks"

const LockedDevice: FC = () => {
  const dispatch = useAppDispatch()

  const [password, setPassword] = useState<string>("")

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSubmit = () => {
    if (password === "Ifsling") {
      dispatch(setDeviceState("loading"))
    }

    setTimeout(() => {
      dispatch(setDeviceState("unlocked"))
    }, 2000)
  }

  return (
    <>
      <div className="relative flex w-screen h-screen justify-center items-end">
        <Image
          src={LockedDeviceImage}
          alt="locked-device"
          className="w-96 h-auto"
        />

        <Input
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              handleSubmit()
            }
          }}
          onChange={handlePasswordChange}
          type="password"
          placeholder="Enter your password"
          className="absolute bottom-28 w-96 h-10 rounded-full text-white placeholder:text-black/50 font-Closer text-sm px-2"
          aria-label="password"
        />
      </div>
    </>
  )
}

export default LockedDevice
