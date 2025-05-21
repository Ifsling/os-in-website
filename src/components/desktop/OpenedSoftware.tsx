import { FC } from "react"
import ActivityMonitor from "../ActivityMonitor"
import Browser from "../Browser"
import { Calculator } from "../calculator/Calculator"
import Finder from "../finder/Finder"
import Folder from "../finder/Folder"
import Notepad from "../Notepad/Notepad"
import Terminal from "../Terminal"

const OpenedSoftware: FC = () => {
  return (
    <>
      <Notepad />
      <Calculator />
      <Terminal />
      <ActivityMonitor />
      <Finder />
      <Folder />
      <Browser />
    </>
  )
}

export default OpenedSoftware
