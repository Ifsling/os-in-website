"use client"

import { Button, Card, CardBody } from "@heroui/react"
import { useEffect, useState } from "react"
import { IoMdRefresh } from "react-icons/io"
import { useAppSelector } from "src/redux/hooks"
import Gameslayout from "./GamesLayout"

// Game constants
const MAX_WRONG_GUESSES = 6
const WORDS = [
  "JAVASCRIPT",
  "REACT",
  "NEXTJS",
  "TYPESCRIPT",
  "TAILWIND",
  "COMPONENT",
  "FUNCTION",
  "VARIABLE",
  "INTERFACE",
  "PROMISE",
  "ASYNC",
  "AWAIT",
  "ROUTER",
  "SERVER",
  "CLIENT",
  "RENDER",
  "HOOK",
  "STATE",
  "EFFECT",
  "CONTEXT",
]

type GameStatus = "playing" | "won" | "lost"

export default function Hangman() {
  const [word, setWord] = useState("")
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)

  // Initialize the game
  const initGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setWord(randomWord)
    setGuessedLetters([])
    setWrongGuesses(0)
    setGameStatus("playing")
  }

  // Check if the player has won
  useEffect(() => {
    if (word && gameStatus === "playing") {
      const hasWon = [...word].every((letter) =>
        guessedLetters.includes(letter)
      )
      if (hasWon) {
        setGameStatus("won")
        setWins((prev) => prev + 1)
      }
    }
  }, [word, guessedLetters, gameStatus])

  // Check if the player has lost
  useEffect(() => {
    if (wrongGuesses >= MAX_WRONG_GUESSES && gameStatus === "playing") {
      setGameStatus("lost")
      setLosses((prev) => prev + 1)
    }
  }, [wrongGuesses, gameStatus])

  // Initialize game on mount
  useEffect(() => {
    initGame()
  }, [])

  // Handle letter guess
  const handleGuess = (letter: string) => {
    if (gameStatus !== "playing" || guessedLetters.includes(letter)) {
      return
    }

    // Add letter to guessed letters
    setGuessedLetters((prev) => [...prev, letter])

    // Check if the letter is in the word
    if (!word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1)
    }
  }

  // Render the word with blanks for unguessed letters
  const renderWord = () => {
    return [...word].map((letter, index) => (
      <div
        key={index}
        className="w-8 h-10 border-b-2 border-gray-400 flex items-center justify-center mx-1"
      >
        <span className="text-xl font-bold">
          {guessedLetters.includes(letter) || gameStatus === "lost"
            ? letter
            : ""}
        </span>
      </div>
    ))
  }

  // Render the keyboard
  const renderKeyboard = () => {
    const keyboard = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M"],
    ]

    return keyboard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center my-1">
        {row.map((letter) => (
          <button
            key={letter}
            className={`w-8 h-8 mx-1 rounded-md font-medium text-sm
              ${
                guessedLetters.includes(letter)
                  ? word.includes(letter)
                    ? "bg-green-500 dark:bg-green-700 text-white"
                    : "bg-red-500 dark:bg-red-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }
              ${gameStatus !== "playing" ? "cursor-not-allowed opacity-70" : ""}
            `}
            onClick={() => handleGuess(letter)}
            disabled={
              gameStatus !== "playing" || guessedLetters.includes(letter)
            }
          >
            {letter}
          </button>
        ))}
      </div>
    ))
  }

  // Render the hangman figure
  const renderHangman = () => {
    return (
      <div className="w-32 h-32 relative mb-4">
        {/* Base */}
        <div className="absolute bottom-0 left-0 w-24 h-1 bg-gray-800 dark:bg-gray-300"></div>

        {/* Pole */}
        <div className="absolute bottom-0 left-4 w-1 h-32 bg-gray-800 dark:bg-gray-300"></div>

        {/* Top */}
        <div className="absolute top-0 left-4 w-16 h-1 bg-gray-800 dark:bg-gray-300"></div>

        {/* Rope */}
        <div className="absolute top-0 right-4 w-1 h-6 bg-gray-800 dark:bg-gray-300"></div>

        {/* Head */}
        {wrongGuesses >= 1 && (
          <div className="absolute top-6 right-2 w-6 h-6 rounded-full border-2 border-gray-800 dark:border-gray-300"></div>
        )}

        {/* Body */}
        {wrongGuesses >= 2 && (
          <div className="absolute top-12 right-4 w-1 h-10 bg-gray-800 dark:bg-gray-300"></div>
        )}

        {/* Left arm */}
        {wrongGuesses >= 3 && (
          <div className="absolute top-14 right-4 w-6 h-1 bg-gray-800 dark:bg-gray-300 transform -rotate-45 origin-left"></div>
        )}

        {/* Right arm */}
        {wrongGuesses >= 4 && (
          <div className="absolute top-14 right-4 w-6 h-1 bg-gray-800 dark:bg-gray-300 transform rotate-45 origin-left"></div>
        )}

        {/* Left leg */}
        {wrongGuesses >= 5 && (
          <div className="absolute top-22 right-4 w-6 h-1 bg-gray-800 dark:bg-gray-300 transform -rotate-30 origin-left"></div>
        )}

        {/* Right leg */}
        {wrongGuesses >= 6 && (
          <div className="absolute top-22 right-4 w-6 h-1 bg-gray-800 dark:bg-gray-300 transform rotate-30 origin-left"></div>
        )}
      </div>
    )
  }

  const openedGames = useAppSelector((state) => state.openedGame.name)

  return (
    <>
      {openedGames.includes("Hangman") && (
        <Gameslayout width={50} gameName="Hangman">
          <Card className="w-full">
            <CardBody className="p-6">
              <div className="flex flex-col items-center">
                {/* Game stats */}
                <div className="flex justify-between w-full mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Wins:</span>
                    <span className="ml-2 font-bold text-green-600">
                      {wins}
                    </span>
                  </div>
                  <Button variant="bordered" size="sm" onPress={initGame}>
                    <IoMdRefresh className="h-4 w-4 mr-1" /> New Word
                  </Button>
                  <div>
                    <span className="text-sm text-gray-600">Losses:</span>
                    <span className="ml-2 font-bold text-red-600">
                      {losses}
                    </span>
                  </div>
                </div>

                {/* Hangman figure */}
                {renderHangman()}

                {/* Game status */}
                {gameStatus === "won" && (
                  <div className="mb-4 py-2 px-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
                    You won! The word was <strong>{word}</strong>.
                  </div>
                )}
                {gameStatus === "lost" && (
                  <div className="mb-4 py-2 px-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
                    Game over! The word was <strong>{word}</strong>.
                  </div>
                )}

                {/* Word display */}
                <div className="flex justify-center mb-6">{renderWord()}</div>

                {/* Keyboard */}
                <div className="mb-4">{renderKeyboard()}</div>

                {/* Game instructions */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="mb-2">
                    <strong>How to play:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Guess the hidden word by selecting letters</li>
                    <li>Each incorrect guess adds a part to the hangman</li>
                    <li>You lose after 6 incorrect guesses</li>
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
