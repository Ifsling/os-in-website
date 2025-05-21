import { FC } from "react"

import ActivityMonitorIcon from "@/public/icons/activity-monitor.png"
import BrowserIcon from "@/public/icons/browser.png"
import CalculatorIcon from "@/public/icons/calculator.png"
import FinderIcon from "@/public/icons/finder.png"
import FolderIcon from "@/public/icons/folder.png"
import NotepadIcon from "@/public/icons/notepad.png"
import TerminalIcon from "@/public/icons/terminal.png"
import type { StaticImageData } from "next/image"
import { SoftwareNames } from "src/redux/features/openedSoftware"
import DockItems from "./DockItem"

export type DockItemType = {
  name: SoftwareNames
  icon: StaticImageData
}

const Dock: FC = () => {
  const dockItems: DockItemType[] = [
    { name: "Finder", icon: FinderIcon },
    { name: "Browser", icon: BrowserIcon },
    { name: "Terminal", icon: TerminalIcon },
    { name: "Calculator", icon: CalculatorIcon },
    { name: "Notepad", icon: NotepadIcon },
    { name: "Activity Monitor", icon: ActivityMonitorIcon },
    { name: "Folder", icon: FolderIcon },
  ]

  return (
    <>
      <div className="absolute bottom-0 flex justify-center w-full z-10">
        <div className="border-1 border-slate-200/50 bg-slate-900/70 rounded-3xl">
          <div className="flex items-center justify-center ">
            <DockItems dockItems={dockItems} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dock
