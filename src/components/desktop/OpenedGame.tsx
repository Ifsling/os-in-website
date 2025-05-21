import { FC } from "react"
import Game2048 from "../games/2048"
import Hangman from "../games/Hangman"
import MemoryGame from "../games/MemoryGame"
import Minesweeper from "../games/Minesweeper"
import TicTacToe from "../games/TicTacToe"

const OpenedGame: FC = () => {
  return (
    <>
      <Minesweeper />
      <TicTacToe />
      <Game2048 />
      <Hangman />
      <MemoryGame />
    </>
  )
}

export default OpenedGame
