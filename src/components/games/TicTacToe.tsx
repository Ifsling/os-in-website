"use client"

import {
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react"
import { FiCircle } from "react-icons/fi"
import { RiRobot2Fill } from "react-icons/ri"
import { RxCross2 } from "react-icons/rx"

import { useEffect, useState } from "react"
import { useAppSelector } from "src/redux/hooks"
import Gameslayout from "./GamesLayout"

type Player = "X" | "O"
type BoardState = (Player | null)[]
type GameStatus = "playing" | "won" | "draw"
type GameMode = "pvp" | "ai"
type Difficulty = "easy" | "medium" | "unbeatable"

export default function TicTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [winner, setWinner] = useState<Player | null>(null)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
  const [gameMode, setGameMode] = useState<GameMode>("pvp")
  const [difficulty, setDifficulty] = useState<Difficulty>("unbeatable")
  const [isThinking, setIsThinking] = useState(false)

  // Winning combinations
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  // Check for a winner
  useEffect(() => {
    checkGameStatus()
  }, [board])

  // AI move
  useEffect(() => {
    if (
      gameMode === "ai" &&
      currentPlayer === "O" &&
      gameStatus === "playing"
    ) {
      setIsThinking(true)
      // Add a small delay to make it feel more natural
      const timer = setTimeout(() => {
        makeAIMove()
        setIsThinking(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentPlayer, gameMode, gameStatus])

  // Check game status
  const checkGameStatus = () => {
    // Check for winner
    for (const combo of winningCombinations) {
      const [a, b, c] = combo
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setGameStatus("won")
        setWinner(board[a] as Player)
        setScores((prev) => ({
          ...prev,
          [board[a] as Player]: prev[board[a] as Player] + 1,
        }))
        return
      }
    }

    // Check for a draw
    if (!board.includes(null) && gameStatus === "playing") {
      setGameStatus("draw")
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }))
    }
  }

  // Handle cell click
  const handleCellClick = (index: number) => {
    // Don't allow clicks if the game is over, the cell is already filled, or it's the AI's turn and thinking
    if (
      gameStatus !== "playing" ||
      board[index] ||
      (gameMode === "ai" && currentPlayer === "O") ||
      isThinking
    ) {
      return
    }

    // Update the board
    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    // Switch players
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
  }

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setGameStatus("playing")
    setWinner(null)
    setCurrentPlayer("X") // X always starts
    setIsThinking(false) // Make sure to reset the thinking state
  }

  // Reset scores
  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
    resetGame()
  }

  // Toggle game mode
  const toggleGameMode = () => {
    const newMode = gameMode === "pvp" ? "ai" : "pvp"
    setGameMode(newMode)
    // Ensure complete reset
    setBoard(Array(9).fill(null))
    setGameStatus("playing")
    setWinner(null)
    setCurrentPlayer("X")
    setIsThinking(false)
  }

  // Change difficulty
  const changeDifficulty = (value: string) => {
    setDifficulty(value as Difficulty)
    // Ensure complete reset
    setBoard(Array(9).fill(null))
    setGameStatus("playing")
    setWinner(null)
    setCurrentPlayer("X")
    setIsThinking(false)
  }

  // Make AI move
  const makeAIMove = () => {
    if (gameStatus !== "playing") return

    let move: number

    switch (difficulty) {
      case "easy":
        move = makeEasyMove()
        break
      case "medium":
        // 50% chance of making an optimal move, 50% chance of making a random move
        move = Math.random() < 0.5 ? makeOptimalMove() : makeEasyMove()
        break
      case "unbeatable":
      default:
        move = makeOptimalMove()
        break
    }

    // Update the board with the AI's move
    const newBoard = [...board]
    newBoard[move] = "O"
    setBoard(newBoard)

    // Switch back to player
    setCurrentPlayer("X")
  }

  // Make a random move (easy difficulty)
  const makeEasyMove = (): number => {
    const availableMoves = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null) as number[]

    if (availableMoves.length === 0) return 0

    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }

  // Make an optimal move using the minimax algorithm (unbeatable difficulty)
  const makeOptimalMove = (): number => {
    // If the board is empty, choose a corner or center for the first move
    if (board.every((cell) => cell === null)) {
      const firstMoves = [0, 2, 4, 6, 8]
      return firstMoves[Math.floor(Math.random() * firstMoves.length)]
    }

    let bestScore = -1000
    let bestMove = 0

    // Try each available move
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        // Make the move on a new board copy
        const newBoard = [...board]
        newBoard[i] = "O"

        // Calculate score for this move
        const score = minimax(newBoard, 0, false)

        // Update best move if this is better
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }

    return bestMove
  }

  // Minimax algorithm for finding the optimal move
  const minimax = (
    board: BoardState,
    depth: number,
    isMaximizing: boolean
  ): number => {
    // Check for terminal states
    const result = checkWinner(board)

    if (result !== null) {
      if (result === "O") return 10 - depth // AI wins
      if (result === "X") return depth - 10 // Player wins
      if (result === "draw") return 0 // Draw
      return 0 // Default case to avoid undefined
    }

    if (isMaximizing) {
      // AI's turn (maximizing)
      let bestScore = -1000

      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          const newBoard = [...board]
          newBoard[i] = "O"
          const score = minimax(newBoard, depth + 1, false)
          bestScore = Math.max(score, bestScore)
        }
      }

      return bestScore === -1000 ? 0 : bestScore
    } else {
      // Player's turn (minimizing)
      let bestScore = 1000

      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          const newBoard = [...board]
          newBoard[i] = "X"
          const score = minimax(newBoard, depth + 1, true)
          bestScore = Math.min(score, bestScore)
        }
      }

      return bestScore === 1000 ? 0 : bestScore
    }
  }

  // Check for winner (used by minimax)
  const checkWinner = (board: BoardState): Player | "draw" | null => {
    // Check for winner
    for (const combo of winningCombinations) {
      const [a, b, c] = combo
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player
      }
    }

    // Check for draw
    if (!board.includes(null)) {
      return "draw"
    }

    // Game still in progress
    return null
  }

  const openedGames = useAppSelector((state) => state.openedGame.name)

  return (
    <>
      {openedGames.includes("Tic Tac Toe") && (
        <Gameslayout width={60} gameName="Tic Tac Toe">
          <Card className="w-full">
            <CardBody className="p-6 w-full">
              <div className="flex flex-col items-center">
                {/* Game mode toggle */}
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="game-mode"
                      checked={gameMode === "ai"}
                      onChange={toggleGameMode}
                    />
                    <label
                      htmlFor="game-mode"
                      className="flex items-center gap-1"
                    >
                      <RiRobot2Fill className="h-4 w-4" /> Play against AI
                    </label>
                  </div>

                  {gameMode === "ai" && (
                    <Select
                      fullWidth={false}
                      value={difficulty}
                      defaultSelectedKeys={["easy"]}
                      onChange={(event: any) => {
                        changeDifficulty(event.target.value)
                      }}
                    >
                      <SelectItem className="text-white" key="easy">
                        Easy
                      </SelectItem>
                      <SelectItem className="text-white" key="medium">
                        Medium
                      </SelectItem>
                      <SelectItem className="text-white" key="unbeatable">
                        Unbeatable
                      </SelectItem>
                    </Select>
                  )}
                </div>

                {/* Game status */}
                <div className="mb-4 text-center">
                  {gameStatus === "playing" && (
                    <div className="flex items-center gap-2">
                      <span>Current player:</span>
                      {currentPlayer === "X" ? (
                        <RxCross2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <FiCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                      {gameMode === "ai" &&
                        currentPlayer === "O" &&
                        isThinking && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            AI is thinking...
                          </span>
                        )}
                    </div>
                  )}
                  {gameStatus === "won" && (
                    <div className="py-2 px-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md flex items-center gap-2">
                      <span>Winner:</span>
                      {winner === "X" ? (
                        <RxCross2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <FiCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                      <span>
                        {winner === "X"
                          ? gameMode === "ai"
                            ? "You"
                            : "Player X"
                          : gameMode === "ai"
                          ? "AI"
                          : "Player O"}
                      </span>
                    </div>
                  )}
                  {gameStatus === "draw" && (
                    <div className="py-2 px-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
                      It's a draw!
                    </div>
                  )}
                </div>

                {/* Game board */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {board.map((cell, index) => (
                    <button
                      key={index}
                      className={`w-20 h-20 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center text-4xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                        gameMode === "ai" && currentPlayer === "O" && !cell
                          ? "cursor-not-allowed"
                          : cell
                          ? ""
                          : "cursor-pointer"
                      }`}
                      onClick={() => handleCellClick(index)}
                      disabled={
                        gameStatus !== "playing" ||
                        cell !== null ||
                        (gameMode === "ai" && currentPlayer === "O") ||
                        isThinking
                      }
                    >
                      {cell === "X" && (
                        <RxCross2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                      )}
                      {cell === "O" && (
                        <FiCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Scores */}
                <div className="flex justify-between w-[60%] mb-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <RxCross2 className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1" />
                      <span className="text-sm">
                        {gameMode === "ai" ? "You" : "Player X"}
                      </span>
                    </div>
                    <span className="text-lg font-bold">{scores.X}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Draws
                    </span>
                    <span className="text-lg font-bold">{scores.draws}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <FiCircle className="h-6 w-6 text-red-600 dark:text-red-400 mb-1" />
                      <span className="text-sm">
                        {gameMode === "ai" ? "AI" : "Player O"}
                      </span>
                    </div>
                    <span className="text-lg font-bold">{scores.O}</span>
                  </div>
                </div>

                {/* Game controls */}
                <div className="flex gap-2">
                  <Button onPress={resetGame}>New Game</Button>
                  <Button variant="bordered" onPress={resetScores}>
                    Reset Scores
                  </Button>
                </div>

                {/* Game instructions */}
                <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                  <p className="mb-2">
                    <strong>How to play:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Players take turns placing their mark (X or O) on the
                      board
                    </li>
                    <li>
                      The first player to get 3 of their marks in a row
                      (horizontally, vertically, or diagonally) wins
                    </li>
                    <li>
                      If all 9 squares are filled and no player has 3 marks in a
                      row, the game is a draw
                    </li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </Gameslayout>
      )}
    </>
  )
}
