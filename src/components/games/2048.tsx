"use client"

import type React from "react"

import { Button, Card, CardBody } from "@heroui/react"
import { useEffect, useState } from "react"
import { FaTrophy } from "react-icons/fa"
import { IoMdRefresh } from "react-icons/io"
import { useAppSelector } from "src/redux/hooks"
import Gameslayout from "./GamesLayout"

// Game constants
const GRID_SIZE = 4
const CELL_GAP = 16

// Color mapping for tiles
const TILE_COLORS: Record<number, string> = {
  2: "bg-[#eee4da] dark:bg-[#635b52] text-[#776e65] dark:text-[#f9f6f2]",
  4: "bg-[#ede0c8] dark:bg-[#635b52] text-[#776e65] dark:text-[#f9f6f2]",
  8: "bg-[#f2b179] dark:bg-[#b07953] text-white",
  16: "bg-[#f59563] dark:bg-[#b07953] text-white",
  32: "bg-[#f67c5f] dark:bg-[#af5b43] text-white",
  64: "bg-[#f65e3b] dark:bg-[#af5b43] text-white",
  128: "bg-[#edcf72] dark:bg-[#a8934e] text-white",
  256: "bg-[#edcc61] dark:bg-[#a8934e] text-white",
  512: "bg-[#edc850] dark:bg-[#a8934e] text-white",
  1024: "bg-[#edc53f] dark:bg-[#a8934e] text-white",
  2048: "bg-[#edc22e] dark:bg-[#a8934e] text-white",
}

// Default color for higher values
const DEFAULT_TILE_COLOR = "bg-[#3c3a32] dark:bg-[#1f1e1c] text-white"

type Direction = "up" | "down" | "left" | "right"
type Cell = number | null
type Grid = Cell[][]
type GameStatus = "playing" | "won" | "game-over"

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [won, setWon] = useState(false)
  const [keepPlaying, setKeepPlaying] = useState(false)

  // Initialize the game
  const initGame = () => {
    // Create empty grid
    const newGrid: Grid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null))

    // Add two initial tiles
    const gridWithTiles = addRandomTile(addRandomTile(newGrid))

    setGrid(gridWithTiles)
    setScore(0)
    setGameStatus("playing")
    setWon(false)
    setKeepPlaying(false)
  }

  // Add a random tile (2 or 4) to an empty cell
  const addRandomTile = (currentGrid: Grid): Grid => {
    const newGrid = JSON.parse(JSON.stringify(currentGrid))
    const emptyCells: [number, number][] = []

    // Find all empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col] === null) {
          emptyCells.push([row, col])
        }
      }
    }

    // If there are empty cells, add a new tile
    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)]
      newGrid[row][col] = Math.random() < 0.9 ? 2 : 4 // 90% chance of 2, 10% chance of 4
    }

    return newGrid
  }

  // Check if the game is over
  const isGameOver = (currentGrid: Grid): boolean => {
    // Check if there are any empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentGrid[row][col] === null) {
          return false
        }
      }
    }

    // Check if there are any possible moves
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const value = currentGrid[row][col]

        // Check adjacent cells
        if (
          (row < GRID_SIZE - 1 && currentGrid[row + 1][col] === value) ||
          (col < GRID_SIZE - 1 && currentGrid[row][col + 1] === value)
        ) {
          return false
        }
      }
    }

    return true
  }

  // Move tiles in a direction
  const moveTiles = (direction: Direction) => {
    if (gameStatus === "game-over" || (gameStatus === "won" && !keepPlaying)) {
      return
    }

    let newGrid = JSON.parse(JSON.stringify(grid))
    let moved = false
    let newScore = score

    // Helper function to move a row or column
    const move = (line: Cell[]): [Cell[], boolean, number] => {
      // Remove nulls
      const nonNullTiles = line.filter((cell) => cell !== null) as number[]
      let scoreIncrease = 0
      let hasMoved = line.length !== nonNullTiles.length

      // Merge tiles
      for (let i = 0; i < nonNullTiles.length - 1; i++) {
        if (nonNullTiles[i] === nonNullTiles[i + 1]) {
          nonNullTiles[i] *= 2
          nonNullTiles.splice(i + 1, 1)
          scoreIncrease += nonNullTiles[i]
          hasMoved = true

          // Check for win
          if (nonNullTiles[i] === 2048 && !won) {
            setWon(true)
            setGameStatus("won")
          }
        }
      }

      // Fill with nulls
      const newLine: (number | null)[] = [...nonNullTiles]
      while (newLine.length < GRID_SIZE) {
        newLine.push(null)
      }

      return [newLine, hasMoved, scoreIncrease]
    }

    // Process each row or column based on direction
    if (direction === "left") {
      for (let row = 0; row < GRID_SIZE; row++) {
        const [newRow, hasMoved, scoreIncrease] = move(newGrid[row])
        if (hasMoved) {
          newGrid[row] = newRow
          moved = true
          newScore += scoreIncrease
        }
      }
    } else if (direction === "right") {
      for (let row = 0; row < GRID_SIZE; row++) {
        const [newRow, hasMoved, scoreIncrease] = move(
          [...newGrid[row]].reverse()
        )
        if (hasMoved) {
          newGrid[row] = newRow.reverse()
          moved = true
          newScore += scoreIncrease
        }
      }
    } else if (direction === "up") {
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = newGrid.map((row: any) => row[col])
        const [newColumn, hasMoved, scoreIncrease] = move(column)
        if (hasMoved) {
          for (let row = 0; row < GRID_SIZE; row++) {
            newGrid[row][col] = newColumn[row]
          }
          moved = true
          newScore += scoreIncrease
        }
      }
    } else if (direction === "down") {
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = newGrid.map((row: any) => row[col]).reverse()
        const [newColumn, hasMoved, scoreIncrease] = move(column)
        if (hasMoved) {
          const reversedColumn = newColumn.reverse()
          for (let row = 0; row < GRID_SIZE; row++) {
            newGrid[row][col] = reversedColumn[row]
          }
          moved = true
          newScore += scoreIncrease
        }
      }
    }

    // If tiles moved, add a new random tile and update score
    if (moved) {
      newGrid = addRandomTile(newGrid)
      setGrid(newGrid)
      setScore(newScore)

      // Update best score
      if (newScore > bestScore) {
        setBestScore(newScore)
      }

      // Check if game is over
      if (isGameOver(newGrid)) {
        setGameStatus("game-over")
      }
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          moveTiles("up")
          break
        case "ArrowDown":
          moveTiles("down")
          break
        case "ArrowLeft":
          moveTiles("left")
          break
        case "ArrowRight":
          moveTiles("right")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [grid, gameStatus, keepPlaying, score, bestScore, won])

  // Initialize game on mount
  useEffect(() => {
    initGame()
  }, [])

  // Handle touch events for swipe
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > 30) {
        moveTiles(deltaX > 0 ? "right" : "left")
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > 30) {
        moveTiles(deltaY > 0 ? "down" : "up")
      }
    }

    setTouchStart(null)
  }

  // Continue playing after winning
  const continueGame = () => {
    setKeepPlaying(true)
    setGameStatus("playing")
  }

  const openedGames = useAppSelector((state) => state.openedGame.name)

  return (
    <>
      {openedGames.includes("2048") && (
        <Gameslayout width={60} gameName="2048">
          <Card className="w-full">
            <CardBody className="p-6">
              <div className="flex flex-col items-center">
                {/* Header with scores */}
                <div className="flex justify-between w-full mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">2048</h2>
                  </div>
                  <div className="flex gap-2 text-black">
                    <div className="bg-gray-200 rounded-md px-3 py-1">
                      <div className="text-xs text-gray-600">SCORE</div>
                      <div className="font-bold">{score}</div>
                    </div>
                    <div className="bg-gray-200 rounded-md px-3 py-1">
                      <div className="text-xs text-gray-600">BEST</div>
                      <div className="font-bold">{bestScore}</div>
                    </div>
                  </div>
                </div>

                {/* Game controls */}
                <div className="w-full flex justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    Join the tiles, get to <strong>2048</strong>!
                  </div>
                  <Button variant="bordered" size="sm" onPress={initGame}>
                    <IoMdRefresh className="h-4 w-4 mr-1" /> New Game
                  </Button>
                </div>

                {/* Game grid */}
                <div
                  className="bg-[#bbada0] dark:bg-[#6d6156] rounded-md p-4 mb-4 select-none"
                  style={{
                    display: "grid",
                    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gap: `${CELL_GAP}px`,
                    width: "320px",
                    height: "320px",
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                    flex items-center justify-center rounded-md
                    ${
                      cell
                        ? TILE_COLORS[cell] || DEFAULT_TILE_COLOR
                        : "bg-[#cdc1b4] dark:bg-[#8f8679]"
                    }
                    transition-all duration-100
                  `}
                      >
                        {cell && (
                          <span
                            className={`
                        font-bold
                        ${
                          cell < 100
                            ? "text-2xl"
                            : cell < 1000
                            ? "text-xl"
                            : "text-lg"
                        }
                      `}
                          >
                            {cell}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Game status messages */}
                {gameStatus === "won" && !keepPlaying && (
                  <div className="mb-4 py-2 px-4 bg-green-100 text-green-800 rounded-md flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTrophy className="h-5 w-5" />
                      <span className="font-bold">You won!</span>
                    </div>
                    <Button size="sm" onClick={continueGame}>
                      Continue Playing
                    </Button>
                  </div>
                )}

                {gameStatus === "game-over" && (
                  <div className="mb-4 py-2 px-4 bg-red-100 text-red-800 rounded-md">
                    Game over! No more moves available.
                  </div>
                )}

                {/* Game instructions */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="mb-2">
                    <strong>How to play:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use arrow keys or swipe to move tiles</li>
                    <li>
                      Tiles with the same number merge into one when they touch
                    </li>
                    <li>Add them up to reach 2048!</li>
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
