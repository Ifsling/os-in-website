import { FC } from "react"

const OpenSound: FC = () => {
  const sound = new Audio("/audio/xp-startup-sound.mp3")
  sound.play()

  return null
}

export default OpenSound
