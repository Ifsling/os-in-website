"use client"

import { Button } from "@heroui/react"
import { motion } from "framer-motion"
import { useState } from "react"
import { setSoftwareName } from "src/redux/features/openedSoftware"
import { useAppDispatch, useAppSelector } from "src/redux/hooks"
import ThreeControlButtons from "../ThreeControlButtons"

export function Calculator() {
  const dispatch = useAppDispatch()

  const isCalculatorOpen =
    useAppSelector((state) => state.openedSoftware.name) === "Calculator"

  const [display, setDisplay] = useState("0")
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)
  const [memory, setMemory] = useState<number>(0)

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.")
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const toggleSign = () => {
    setDisplay(String(-Number.parseFloat(display)))
  }

  const inputPercent = () => {
    const value = Number.parseFloat(display) / 100
    setDisplay(String(value))
  }

  const handleOperator = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue)
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = (
    op: string,
    first: number,
    second: number
  ): number => {
    switch (op) {
      case "+":
        return first + second
      case "-":
        return first - second
      case "*":
        return first * second
      case "/":
        return first / second
      default:
        return second
    }
  }

  const handleEquals = () => {
    if (firstOperand === null || operator === null) {
      return
    }

    const inputValue = Number.parseFloat(display)
    const result = performCalculation(operator, firstOperand, inputValue)

    setDisplay(String(result))
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const memoryStore = () => {
    setMemory(Number.parseFloat(display))
  }

  const memoryRecall = () => {
    setDisplay(String(memory))
  }

  const memoryClear = () => {
    setMemory(0)
  }

  const memoryAdd = () => {
    setMemory(memory + Number.parseFloat(display))
  }

  const memorySubtract = () => {
    setMemory(memory - Number.parseFloat(display))
  }

  const backspace = () => {
    if (
      display.length === 1 ||
      (display.length === 2 && display.startsWith("-"))
    ) {
      setDisplay("0")
    } else {
      setDisplay(display.slice(0, -1))
    }
  }

  const onRedClicked = () => {
    dispatch(setSoftwareName("None"))
  }

  return (
    <>
      {isCalculatorOpen && (
        <motion.div
          className="flex justify-center items-center w-full p-6 h-[calc(100vh-150px)] absolute text-white"
          initial={{ opacity: 0, scale: 0, y: +300 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className=" max-w-md bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="py-2 px-3">
              <ThreeControlButtons onRedClicked={onRedClicked} />
            </div>

            {/* Display */}
            <div className="bg-white dark:bg-gray-800 p-4">
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 h-4">
                {firstOperand !== null ? `${firstOperand} ${operator}` : ""}
              </div>
              <div className="text-right text-3xl font-bold overflow-x-auto overflow-y-hidden whitespace-nowrap">
                {display}
              </div>
            </div>

            {/* Memory buttons */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-gray-200 dark:bg-gray-800">
              <Button
                variant="ghost"
                size="sm"
                onPress={memoryClear}
                className="text-xs"
              >
                MC
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onPress={memoryRecall}
                className="text-xs"
              >
                MR
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onPress={memoryAdd}
                className="text-xs"
              >
                M+
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onPress={memorySubtract}
                className="text-xs"
              >
                M-
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onPress={memoryStore}
                className="text-xs"
              >
                MS
              </Button>
            </div>

            {/* Calculator buttons */}
            <div className="grid grid-cols-4 gap-1 p-1">
              <Button color="danger" onPress={clearDisplay}>
                C
              </Button>
              <Button onPress={toggleSign}>+/-</Button>
              <Button onPress={inputPercent}>%</Button>
              <Button
                color="warning"
                onPress={() => handleOperator("/")}
                className={
                  operator === "/" && waitingForSecondOperand
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                ÷
              </Button>
              <Button onPress={() => inputDigit("7")}>7</Button>
              <Button onPress={() => inputDigit("8")}>8</Button>
              <Button onPress={() => inputDigit("9")}>9</Button>
              <Button
                color="warning"
                onPress={() => handleOperator("*")}
                className={
                  operator === "*" && waitingForSecondOperand
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                ×
              </Button>
              <Button onPress={() => inputDigit("4")}>4</Button>
              <Button onPress={() => inputDigit("5")}>5</Button>
              <Button onPress={() => inputDigit("6")}>6</Button>
              <Button
                color="warning"
                onPress={() => handleOperator("-")}
                className={
                  operator === "-" && waitingForSecondOperand
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                -
              </Button>
              <Button onPress={() => inputDigit("1")}>1</Button>
              <Button onPress={() => inputDigit("2")}>2</Button>
              <Button onPress={() => inputDigit("3")}>3</Button>
              <Button
                color="warning"
                onPress={() => handleOperator("+")}
                className={
                  operator === "+" && waitingForSecondOperand
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                +
              </Button>
              <Button onPress={backspace}>←</Button>
              <Button onPress={() => inputDigit("0")}>0</Button>
              <Button onPress={inputDecimal}>.</Button>
              <Button onPress={handleEquals} className="bg-primary">
                =
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
