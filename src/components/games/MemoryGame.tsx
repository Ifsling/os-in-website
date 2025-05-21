"use client"

import { Button, Card, CardBody, Select, SelectItem } from "@heroui/react"
import { useEffect, useState } from "react"
import { FaRegClock, FaTrophy } from "react-icons/fa"
import { IoMdRefresh } from "react-icons/io"
import { useAppSelector } from "src/redux/hooks"
import Gameslayout from "./GamesLayout"

// Game constants
const GRID_SIZES = {
  EASY: { rows: 4, cols: 4, name: "4×4 (Easy)" },
  MEDIUM: { rows: 6, cols: 6, name: "6×6 (Medium)" },
  HARD: { rows: 8, cols: 8, name: "8×8 (Hard)" },
}

// Emojis for cards
const EMOJIS = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🐧",
  "🐦",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
  "🐗",
  "🐴",
  "🦄",
  "🐝",
  "🐛",
  "🦋",
  "🐌",
  "🐞",
  "🐜",
  "🦟",
  "🦗",
  "🕷️",
  "🦂",
  "🐢",
  "🐍",
  "🦎",
  "🦖",
  "🦕",
  "🐙",
  "🦑",
  "🦐",
  "🦞",
  "🦀",
  "🐡",
  "🐠",
  "🐟",
  "🐬",
  "🐳",
  "🐋",
  "🦈",
  "🐊",
  "🐅",
  "🐆",
  "🦓",
  "🦍",
  "🦧",
  "🐘",
  "🦛",
  "🦏",
  "🐪",
  "🐫",
  "🦒",
  "🦘",
  "🦬",
  "🐃",
  "🐂",
  "🐄",
  "🐎",
  "🐖",
  "🐏",
  "🐑",
  "🦙",
  "🐐",
  "🦌",
  "🐕",
  "🐩",
  "🦮",
  "🐕‍🦺",
  "🐈",
  "🐈‍⬛",
  "🪶",
]

type CardType = {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

type GridSize = keyof typeof GRID_SIZES
type GameStatus = "waiting" | "playing" | "won"

export default function MemoryGame() {
  const [gridSize, setGridSize] = useState<GridSize>("EASY")
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [totalPairs, setTotalPairs] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>("waiting")
  const [startTime, setStartTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [bestTimes, setBestTimes] = useState<Record<GridSize, number | null>>({
    EASY: null,
    MEDIUM: null,
    HARD: null,
  })

  // Initialize the game
  const initGame = () => {
    const { rows, cols } = GRID_SIZES[gridSize]
    const totalCards = rows * cols
    const pairsNeeded = totalCards / 2

    // Make sure we have enough emojis
    if (pairsNeeded > EMOJIS.length) {
      console.error("Not enough emojis for this grid size")
      return
    }

    // Shuffle and pick emojis
    const shuffledEmojis = [...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairsNeeded)

    // Create pairs
    const cardPairs = shuffledEmojis.flatMap((emoji) => [
      { emoji, id: Math.random(), flipped: false, matched: false },
      { emoji, id: Math.random(), flipped: false, matched: false },
    ])

    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setTotalPairs(pairsNeeded)
    setGameStatus("waiting")
    setStartTime(0)
    setCurrentTime(0)
  }

  // Start the game
  const startGame = () => {
    setGameStatus("playing")
    setStartTime(Date.now())
  }

  // Handle card click
  const handleCardClick = (index: number) => {
    // Start game on first click
    if (gameStatus === "waiting") {
      startGame()
    }

    // Don't allow clicks during processing or on matched/flipped cards
    if (
      gameStatus !== "playing" ||
      flippedCards.length >= 2 ||
      cards[index].flipped ||
      cards[index].matched
    ) {
      return
    }

    // Flip the card
    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, index]
    setFlippedCards(newFlippedCards)

    // If we have 2 flipped cards, check for a match
    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[firstIndex].matched = true
          matchedCards[firstIndex].flipped = false
          matchedCards[secondIndex].matched = true
          matchedCards[secondIndex].flipped = false
          setCards(matchedCards)
          setFlippedCards([])
          setMatchedPairs((prev) => {
            const newMatchedPairs = prev + 1

            // Check for win
            if (newMatchedPairs === totalPairs) {
              setGameStatus("won")

              // Update best time
              const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
              if (
                bestTimes[gridSize] === null ||
                elapsedTime < bestTimes[gridSize]!
              ) {
                setBestTimes((prev) => ({
                  ...prev,
                  [gridSize]: elapsedTime,
                }))
              }
            }

            return newMatchedPairs
          })
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          const unflippedCards = [...cards]
          unflippedCards[firstIndex].flipped = false
          unflippedCards[secondIndex].flipped = false
          setCards(unflippedCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Change grid size
  const changeGridSize = (value: string) => {
    setGridSize(value as GridSize)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameStatus === "playing") {
      interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStatus, startTime])

  // Initialize game when grid size changes
  useEffect(() => {
    initGame()
  }, [gridSize])

  // Format time as MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const openedGames = useAppSelector((state) => state.openedGame.name)

  return (
    <>
      {openedGames.includes("Memory Game") && (
        <Gameslayout width={50} gameName="Memory Game">
          <Card className="w-full">
            <CardBody className="p-6">
              <div className="flex flex-col items-center">
                {/* Game controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Select
                      value={gridSize}
                      className="w-40"
                      defaultSelectedKeys={["EASY"]}
                      onChange={(event: any) => {
                        changeGridSize(event.target.value)
                      }}
                    >
                      <SelectItem className="text-white" key="EASY">
                        {GRID_SIZES.EASY.name}
                      </SelectItem>
                      <SelectItem className="text-white" key="MEDIUM">
                        {GRID_SIZES.MEDIUM.name}
                      </SelectItem>
                      <SelectItem className="text-white" key="HARD">
                        {GRID_SIZES.HARD.name}
                      </SelectItem>
                    </Select>
                    <Button onPress={initGame} variant="bordered" size="sm">
                      <IoMdRefresh className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FaRegClock className="h-4 w-4 text-gray-600" />
                      <span className="font-mono">
                        {formatTime(currentTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaTrophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-mono">
                        {formatTime(bestTimes[gridSize])}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Game status */}
                {gameStatus === "waiting" && (
                  <div className="mb-4 py-2 px-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
                    Click any card to start the game
                  </div>
                )}
                {gameStatus === "won" && (
                  <div className="mb-4 py-2 px-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
                    Congratulations! You matched all pairs in{" "}
                    {formatTime(currentTime)}
                  </div>
                )}

                {/* Game progress */}
                <div className="w-full mb-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
                  ></div>
                </div>

                {/* Game board */}
                <div
                  className="grid gap-2 mb-6"
                  style={{
                    gridTemplateRows: `repeat(${GRID_SIZES[gridSize].rows}, minmax(0, 1fr))`,
                    gridTemplateColumns: `repeat(${GRID_SIZES[gridSize].cols}, minmax(0, 1fr))`,
                  }}
                >
                  {cards.map((card, index) => (
                    <button
                      key={card.id}
                      className={`
                  w-12 h-12 sm:w-14 sm:h-14 rounded-md flex items-center justify-center text-2xl
                  transition-all duration-300 transform
                  ${
                    card.flipped
                      ? "bg-white dark:bg-gray-800 border-2 border-blue-400 dark:border-blue-600 rotate-y-180"
                      : card.matched
                      ? "bg-green-100 dark:bg-green-900 border-2 border-green-400 dark:border-green-600 cursor-default"
                      : "bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 cursor-pointer"
                  }
                `}
                      onClick={() => handleCardClick(index)}
                    >
                      {card.flipped && card.emoji}
                      {card.matched && card.emoji}
                    </button>
                  ))}
                </div>

                {/* Game instructions */}
                <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                  <p className="mb-2">
                    <strong>How to play:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Click cards to reveal their emoji</li>
                    <li>Find matching pairs of emojis</li>
                    <li>Match all pairs to win</li>
                    <li>
                      Try to complete the game in the shortest time possible
                    </li>
                    <li>
                      Increase the difficulty by selecting a larger grid size
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
