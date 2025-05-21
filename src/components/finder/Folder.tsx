"use client"

import { FC } from "react"
import { useAppSelector } from "src/redux/hooks"
import Finder from "./Finder"

const Folder: FC = () => {
  const isGameFolderOpen =
    useAppSelector((state) => state.openedSoftware.name) === "Folder"

  console.log(isGameFolderOpen)

  return (
    <>
      {isGameFolderOpen && (
        <Finder path={["Home", "Games"]} isFolderOpen={true} />
      )}
    </>
  )
}

export default Folder
