"use client"

import { FC, useEffect, useState } from "react"

import UpdateDialogBoxImage from "@/public/components/update-dialog-box.png"
import { Button } from "@heroui/react"
import { motion } from "framer-motion"
import Image from "next/image"
import { RxCross2 } from "react-icons/rx"
import { setDeviceState } from "src/redux/features/deviceState"
import { useAppDispatch } from "src/redux/hooks"

const UpdateHandler: FC = () => {
  const dispatch = useAppDispatch()

  const sound = new Audio("/audio/portal-sound.mp3")

  const [showUpdateDialogBox, setShowUpdateDialogBox] = useState<boolean>(false)
  const [buttonClicked, setButtonClicked] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUpdateDialogBox(true)
      sound.play()
    }, 30000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {showUpdateDialogBox && (
        <motion.div
          className="absolute top-10 right-5 z-10"
          initial={{ x: +900, y: 0 }}
          animate={closed ? { x: +900, y: 0 } : { x: 0, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-96">
            <Image
              src={UpdateDialogBoxImage}
              alt="update-dialog-box"
              className="w-full h-auto"
            />
            <Button
              size="sm"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%]  "
              isLoading={buttonClicked}
              draggable={false}
              onPress={() => {
                setButtonClicked(true)
                setTimeout(() => {
                  setShowUpdateDialogBox(false)
                  dispatch(setDeviceState("bsod"))
                }, 3000)
              }}
            >
              Update Now
            </Button>
            <motion.div
              onClick={() => {
                setClosed(true)
                setTimeout(() => {
                  setShowUpdateDialogBox(false)
                }, 2000)
              }}
              className="p-1 roundex-xl absolute -top-2 -left-2 bg-slate-800 rounded-full"
            >
              <RxCross2 className="text-red-500" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default UpdateHandler
