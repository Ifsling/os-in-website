import { FC } from "react"
import Desktop from "./desktop/Desktop"

const Os: FC = () => {
  return (
    <div className=" w-screen h-screen flex items-center justify-center bg-black overflow-hidden">
      <div
        className="
        bg-slate-100
        sm:aspect-video sm:w-screen sm:h-auto sm:rotate-0
        aspect-video rotate-90 w-[100vh] h-[40vh]
      "
      >
        <Desktop />
      </div>
    </div>
  )
}

export default Os
