"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import {
  setSoftwareName,
  SoftwareNames,
} from "src/redux/features/openedSoftware"
import { useAppDispatch, useAppSelector } from "src/redux/hooks"
import { cn } from "src/utils/utils"
import { DockItemType } from "./Dock"

const DockItems = ({ dockItems }: { dockItems: DockItemType[] }) => {
  const dispatch = useAppDispatch()
  const openedSoftware = useAppSelector((state) => state.openedSoftware.name)

  const onItemClicked = (itemName: SoftwareNames) => {
    dispatch(setSoftwareName(itemName))
  }

  return (
    <>
      {dockItems.map((item) => (
        <motion.div
          whileHover={{ scale: 1.2 }}
          key={item.name}
          className={cn({
            "flex flex-col items-center justify-center w-16 h-16 p-2 m-2  rounded-lg hover:bg-slate-600/50":
              true,
            "bg-slate-600/50": openedSoftware === item.name,
          })}
          onClick={() => onItemClicked(item.name)}
        >
          <Image
            src={item.icon}
            alt={item.name}
            width={40}
            height={40}
            className="mb-1"
          />
        </motion.div>
      ))}
    </>
  )
}

export default DockItems
