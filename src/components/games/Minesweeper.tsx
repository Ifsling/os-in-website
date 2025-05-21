"use client"

import type React from "react"

import { Button, Card, CardBody, Select, SelectItem } from "@heroui/react"
// import { Bomb, Clock, Flag, RefreshCw } from "lucide-react"
import { FaBomb, FaRegClock } from "react-icons/fa"
import { FaFlag } from "react-icons/fa6"
import { IoMdRefresh } from "react-icons/io"

import { useCallback, useEffect, useState } from "react"
import { useAppSelector } from "src/redux/hooks"
import Gameslayout from "./GamesLayout"

// Game difficulty presets
const DIFFICULTY = {
  EASY: { rows: 9, cols: 9, mines: 10, name: "Easy" },
  MEDIUM: { rows: 16, cols: 16, mines: 40, name: "Medium" },
  HARD: { rows: 16, cols: 30, mines: 99, name: "Hard" },
}

// Cell states
type CellState = {
  revealed: boolean
  hasMine: boolean
  flagged: boolean
  adjacentMines: number
}

// Game states
type GameStatus = "waiting" | "playing" | "won" | "lost"

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY>("EASY")
  const [board, setBoard] = useState<CellState[][]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>("waiting")
  const [minesLeft, setMinesLeft] = useState(0)
  const [time, setTime] = useState(0)
  const [firstClick, setFirstClick] = useState(true)

  // Initialize the game board
  const initializeBoard = useCallback(() => {
    const { rows, cols, mines } = DIFFICULTY[difficulty]
    setMinesLeft(mines)

    // Create empty board
    const newBoard: CellState[][] = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            revealed: false,
            hasMine: false,
            flagged: false,
            adjacentMines: 0,
          }))
      )

    setBoard(newBoard)
    setGameStatus("waiting")
    setTime(0)
    setFirstClick(true)
  }, [difficulty])

  // Place mines on the board (after first click)
  const placeMines = useCallback(
    (clickRow: number, clickCol: number) => {
      const { rows, cols, mines } = DIFFICULTY[difficulty]

      // Create a copy of the board
      const newBoard = JSON.parse(JSON.stringify(board))

      // Place mines randomly
      let minesPlaced = 0
      while (minesPlaced < mines) {
        const randomRow = Math.floor(Math.random() * rows)
        const randomCol = Math.floor(Math.random() * cols)

        // Don't place a mine on the first clicked cell or where a mine already exists
        if (
          (randomRow !== clickRow || randomCol !== clickCol) &&
          !newBoard[randomRow][randomCol].hasMine
        ) {
          newBoard[randomRow][randomCol].hasMine = true
          minesPlaced++
        }
      }

      // Calculate adjacent mines for each cell
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (!newBoard[row][col].hasMine) {
            let count = 0
            // Check all 8 adjacent cells
            for (
              let r = Math.max(0, row - 1);
              r <= Math.min(rows - 1, row + 1);
              r++
            ) {
              for (
                let c = Math.max(0, col - 1);
                c <= Math.min(cols - 1, col + 1);
                c++
              ) {
                if (newBoard[r][c].hasMine) count++
              }
            }
            newBoard[row][col].adjacentMines = count
          }
        }
      }

      setBoard(newBoard)
      return newBoard
    },
    [board, difficulty]
  )

  // Reveal a cell
  const revealCell = (
    row: number,
    col: number,
    currentBoard: CellState[][]
  ) => {
    if (
      row < 0 ||
      row >= currentBoard.length ||
      col < 0 ||
      col >= currentBoard[0].length ||
      currentBoard[row][col].revealed ||
      currentBoard[row][col].flagged
    ) {
      return currentBoard
    }

    // Reveal the current cell
    currentBoard[row][col].revealed = true

    // If it's an empty cell (no adjacent mines), reveal adjacent cells
    if (
      currentBoard[row][col].adjacentMines === 0 &&
      !currentBoard[row][col].hasMine
    ) {
      for (
        let r = Math.max(0, row - 1);
        r <= Math.min(currentBoard.length - 1, row + 1);
        r++
      ) {
        for (
          let c = Math.max(0, col - 1);
          c <= Math.min(currentBoard[0].length - 1, col + 1);
          c++
        ) {
          if (r !== row || c !== col) {
            revealCell(r, c, currentBoard)
          }
        }
      }
    }

    return currentBoard
  }

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (
      gameStatus === "lost" ||
      gameStatus === "won" ||
      board[row][col].flagged
    ) {
      return
    }

    let currentBoard = [...board]

    // On first click, place mines and start the game
    if (firstClick) {
      setFirstClick(false)
      setGameStatus("playing")
      currentBoard = placeMines(row, col)
    }

    // If clicked on a mine, game over
    if (currentBoard[row][col].hasMine) {
      // Reveal all mines
      currentBoard = currentBoard.map((row) =>
        row.map((cell) => ({
          ...cell,
          revealed: cell.hasMine ? true : cell.revealed,
        }))
      )
      setBoard(currentBoard)
      setGameStatus("lost")
      return
    }

    // Reveal the cell and adjacent cells if needed
    currentBoard = revealCell(
      row,
      col,
      JSON.parse(JSON.stringify(currentBoard))
    )
    setBoard(currentBoard)

    // Check if player has won
    checkWinCondition(currentBoard)
  }

  // Handle right-click (flag)
  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()

    if (gameStatus !== "playing" && gameStatus !== "waiting") {
      return
    }

    if (gameStatus === "waiting") {
      setGameStatus("playing")
      setFirstClick(false)
      placeMines(row, col)
    }

    if (!board[row][col].revealed) {
      const newBoard = [...board]

      // Toggle flag
      newBoard[row][col].flagged = !newBoard[row][col].flagged

      // Update mines left counter
      setMinesLeft((prev) => (newBoard[row][col].flagged ? prev - 1 : prev + 1))

      setBoard(newBoard)
    }
  }

  // Check if the player has won
  const checkWinCondition = (currentBoard: CellState[][]) => {
    const { rows, cols, mines } = DIFFICULTY[difficulty]

    // Count revealed cells
    let revealedCount = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (currentBoard[row][col].revealed) {
          revealedCount++
        }
      }
    }

    // If all non-mine cells are revealed, player wins
    if (revealedCount === rows * cols - mines) {
      setGameStatus("won")

      // Flag all mines
      const winBoard = currentBoard.map((row) =>
        row.map((cell) => ({
          ...cell,
          flagged: cell.hasMine ? true : cell.flagged,
        }))
      )
      setBoard(winBoard)
      setMinesLeft(0)
    }
  }

  // Reset the game
  const resetGame = () => {
    initializeBoard()
  }

  // Change difficulty
  const changeDifficulty = (value: string) => {
    setDifficulty(value as keyof typeof DIFFICULTY)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameStatus === "playing") {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStatus])

  // Initialize board on mount and when difficulty changes
  useEffect(() => {
    initializeBoard()
  }, [difficulty, initializeBoard])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const openedGames = useAppSelector((state) => state.openedGame.name)

  return (
    <>
      {openedGames.includes("Minesweeper") && (
        <Gameslayout width={50} gameName="Minesweeper">
          <Card className="w-full ">
            <CardBody className="p-6">
              <div className="flex flex-col items-center">
                {/* Game controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Select
                      aria-label="select"
                      className="w-36 text-white"
                      defaultSelectedKeys={["EASY"]}
                      onChange={(event: any) => {
                        changeDifficulty(event.target.value)
                      }}
                    >
                      <SelectItem className="text-white" key="EASY">
                        EASY
                      </SelectItem>
                      <SelectItem className="text-white" key="MEDIUM">
                        MEDIUM
                      </SelectItem>
                      <SelectItem className="text-white" key="HARD">
                        HARD
                      </SelectItem>
                    </Select>
                    <Button onPress={resetGame} variant="bordered" size="sm">
                      <IoMdRefresh className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FaFlag className="h-4 w-4 text-red-500" />
                      <span className="font-mono">{minesLeft}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRegClock className="h-4 w-4 text-gray-600" />
                      <span className="font-mono">{formatTime(time)}</span>
                    </div>
                  </div>
                </div>

                {/* Game status message */}
                {gameStatus === "won" && (
                  <div className="mb-4 py-2 px-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
                    You won! Congratulations!
                  </div>
                )}
                {gameStatus === "lost" && (
                  <div className="mb-4 py-2 px-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
                    Game over! You hit a mine.
                  </div>
                )}

                {/* Game board */}
                <div
                  className="grid gap-0 border-2 border-gray-400 bg-gray-200"
                  style={{
                    gridTemplateRows: `repeat(${DIFFICULTY[difficulty].rows}, minmax(0, 1fr))`,
                    gridTemplateColumns: `repeat(${DIFFICULTY[difficulty].cols}, minmax(0, 1fr))`,
                  }}
                >
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                    w-7 h-7 flex items-center justify-center text-xs sm:text-sm font-bold select-none
                    ${
                      cell.revealed
                        ? "bg-gray-300 dark:bg-gray-700 border border-gray-400 dark:border-gray-600"
                        : "bg-gray-400 dark:bg-gray-600 border-t-2 border-l-2 border-gray-300 dark:border-gray-500 border-r-2 border-b-2 border-r-gray-600 dark:border-r-gray-800 border-b-gray-600 dark:border-b-gray-800 hover:bg-gray-350 dark:hover:bg-gray-550 cursor-pointer"
                    }
                  `}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onContextMenu={(e) =>
                          handleRightClick(e, rowIndex, colIndex)
                        }
                      >
                        {cell.revealed ? (
                          cell.hasMine ? (
                            <FaBomb className="h-4 w-4 text-black dark:text-white" />
                          ) : cell.adjacentMines > 0 ? (
                            <span
                              className={`
                        ${
                          cell.adjacentMines === 1
                            ? "text-blue-600 dark:text-blue-400"
                            : ""
                        }
                        ${
                          cell.adjacentMines === 2
                            ? "text-green-600 dark:text-green-400"
                            : ""
                        }
                        ${
                          cell.adjacentMines === 3
                            ? "text-red-600 dark:text-red-400"
                            : ""
                        }
                        ${
                          cell.adjacentMines === 4
                            ? "text-purple-800 dark:text-purple-400"
                            : ""
                        }
                        ${
                          cell.adjacentMines === 5
                            ? "text-orange-800 dark:text-orange-400"
                            : ""
                        }
                        ${
                          cell.adjacentMines === 6
                            ? "text-teal-600 dark:text-teal-400"
                            : ""
                        }
                        ${
                          cell.adjacentMines === 7
                            ? "text-black dark:text-white"
                            : ""
                        }
                        ${
                          cell.adjacentMines === 8
                            ? "text-gray-600 dark:text-gray-400"
                            : ""
                        }
                      `}
                            >
                              {cell.adjacentMines}
                            </span>
                          ) : null
                        ) : cell.flagged ? (
                          <FaFlag className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                    ))
                  )}
                </div>

                {/* Game instructions */}
                <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                  <p className="mb-2">
                    <strong>How to play:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Left-click to reveal a cell</li>
                    <li>Right-click to place/remove a flag</li>
                    <li>
                      Numbers show how many mines are adjacent to that cell
                    </li>
                    <li>Flag all mines to win the game</li>
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
