"use client"

import { motion } from "framer-motion"
import { FC } from "react"
import { useAppSelector } from "src/redux/hooks"
import NotepadBody from "./NotepadBody"
import NotepadTopBar from "./NotepadTopBar"

const Notepad: FC = () => {
  const isNotepadOpen =
    useAppSelector((state) => state.openedSoftware.name) === "Notepad"

  return (
    <>
      {isNotepadOpen && (
        <motion.div
          className="flex justify-center items-center w-screen h-screen absolute"
          initial={{ opacity: 0, scale: 0, y: +300 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="rounded-xl border border-slate-200/50 w-[70%]">
            <NotepadTopBar />
            <NotepadBody />
          </div>
        </motion.div>
      )}
    </>
  )
}

export default Notepad
