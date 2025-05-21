"use client"

import { FC, useEffect, useState } from "react"

import AppleLogo from "@/public/icons/apple-logo.png"
import ControlCenterIcon from "@/public/icons/control-center.png"
import Image from "next/image"
import { IoIosWifi } from "react-icons/io"

import { IoIosBatteryFull } from "react-icons/io"
import { useAppSelector } from "src/redux/hooks"

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const Menubar: FC = () => {
  const [date, setDate] = useState<string>("")
  const openedSoftwareName = useAppSelector(
    (state) => state.openedSoftware.name
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date()
      setDate(
        `${days[date.getDay()]} ${(date.getHours() % 12)
          .toString()
          .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} 
          ${date.getHours() >= 12 ? "PM" : "AM"}`
      )
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="absolute top-0 w-full z-10">
        <div className="bg-[#0d1e1f] flex justify-between items-center px-3 text-white font-Closer text-sm">
          <div className="flex justify-center gap-4 items-center">
            <Image src={AppleLogo} alt="apple-logo" className="w-5 h-5" />
            <h1 className="font-bold">
              {openedSoftwareName === "None" ? "Finder" : openedSoftwareName}
            </h1>

            <h1>File</h1>
            <h1>Edit</h1>
            <h1>Window</h1>
            <h1>View</h1>
          </div>

          <div className="flex justify-center gap-4 items-center">
            <IoIosWifi size={18} className="text-white" />
            <IoIosBatteryFull size={22} className="text-white" />
            <Image
              src={ControlCenterIcon}
              alt="apple-logo"
              className="w-4 h-4"
            />

            <h1 className="text-white font-Closer">{date}</h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default Menubar
