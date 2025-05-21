"use client"

import { ReactNode } from "react"
import { GameNames, removeOpenedGameName } from "src/redux/features/openedGame"
import { useAppDispatch } from "src/redux/hooks"
import { cn } from "src/utils/utils"
import ThreeControlButtons from "../ThreeControlButtons"

const Gameslayout = ({
  children,
  width = 60,
  gameName,
}: {
  children: ReactNode
  width?: number
  gameName: GameNames
}) => {
  const dispatch = useAppDispatch()

  const onRedClicked = () => {
    dispatch(removeOpenedGameName(gameName))
  }

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center text-white absolute">
        <div
          className={cn(`w-[${width}%] border border-slate-200/50 rounded-xl`)}
        >
          <div className="w-full py-3 px-4 bg-slate-800 rounded-t-xl">
            <ThreeControlButtons onRedClicked={onRedClicked} />
          </div>
          <div className="flex justify-center items-center w-full h-full rounded-b-xl bg-[#17171a]">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Gameslayout
