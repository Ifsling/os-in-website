"use client"

import { FC } from "react"
import { setSoftwareName } from "src/redux/features/openedSoftware"
import { useAppDispatch } from "src/redux/hooks"
import ThreeControlButtons from "../ThreeControlButtons"

const NotepadTopBar: FC = () => {
  const dispatch = useAppDispatch()

  const onRedClicked = () => {
    dispatch(setSoftwareName("None"))
  }

  return (
    <>
      <div className="flex justify-between text-white font-Closer bg-slate-700 p-3 items-center rounded-tl-xl rounded-tr-xl py-4">
        <ThreeControlButtons onRedClicked={onRedClicked} />
      </div>
    </>
  )
}

export default NotepadTopBar
