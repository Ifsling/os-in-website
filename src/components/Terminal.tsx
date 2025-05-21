"use client"

import { motion } from "framer-motion"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { setSoftwareName } from "src/redux/features/openedSoftware"
import { useAppDispatch, useAppSelector } from "src/redux/hooks"
import ThreeControlButtons from "./ThreeControlButtons"

interface CommandHistory {
  command: string
  output: string
}

const Terminal = () => {
  const dispatch = useAppDispatch()

  const isTerminalOpen =
    useAppSelector((state) => state.openedSoftware.name) === "Terminal"

  const [input, setInput] = useState("")
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "",
      output:
        "Welcome to the Terminal Simulator!\nType 'help' to see available commands.",
    },
  ])
  const [currentDirectory, setCurrentDirectory] = useState("/home/user")
  const [isHacking, setIsHacking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const spanRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isHacking) return

    const command = input.trim()
    let output = ""

    if (command === "help") {
      output = `
Available commands:
  help - Show this help message
  clear - Clear the terminal
  echo [text] - Display text
  ls - List files and directories
  cd [directory] - Change directory
  pwd - Print working directory
  date - Show current date and time
  whoami - Show current user
  mkdir [name] - Create a directory (simulated)
  touch [name] - Create a file (simulated)
  cat [file] - Show file contents (simulated)
`
    } else if (command === "clear") {
      setHistory([])
      setInput("")
      return
    } else if (command.startsWith("echo ")) {
      output = command.substring(5)
    } else if (command === "ls") {
      output = `
Documents/
Pictures/
Downloads/
example.txt
readme.md
script.js
`
    } else if (command.startsWith("cd ")) {
      const dir = command.substring(3)
      if (dir === "..") {
        const parts = currentDirectory.split("/")
        if (parts.length > 2) {
          parts.pop()
          setCurrentDirectory(parts.join("/"))
          output = `Changed directory to ${parts.join("/")}`
        } else {
          output = "Cannot go up from root directory"
        }
      } else if (dir === "~") {
        setCurrentDirectory("/home/user")
        output = "Changed directory to /home/user"
      } else {
        setCurrentDirectory(`${currentDirectory}/${dir}`)
        output = `Changed directory to ${currentDirectory}/${dir}`
      }
    } else if (command === "pwd") {
      output = currentDirectory
    } else if (command === "date") {
      output = new Date().toString()
    } else if (command === "whoami") {
      output = "user"
    } else if (command.startsWith("mkdir ")) {
      const dirName = command.substring(6)
      output = `Directory '${dirName}' created`
    } else if (command.startsWith("touch ")) {
      const fileName = command.substring(6)
      output = `File '${fileName}' created`
    } else if (command === "sudo hack nasa") {
      setIsHacking(true)
      const hackingSequence = [
        "Initializing hack protocol...",
        "Establishing secure connection...",
        "Bypassing firewall...",
        "[#####               ] 25%",
        "Accessing NASA mainframe...",
        "[##########          ] 50%",
        "Extracting satellite control codes...",
        "[###############     ] 75%",
        "Uploading virus payload...",
        "[####################] 100%",
        "MISSION ACCOMPLISHED. NASA SYSTEM COMPROMISED.",
      ]

      const runSequence = async () => {
        setHistory((prev) => [...prev, { command, output: "" }])
        for (const line of hackingSequence) {
          await sleep(800)
          setHistory((prev) => [...prev, { command: "", output: line }])
        }
        setIsHacking(false)
      }

      runSequence()
      setInput("")
      return
    } else if (command.startsWith("cat ")) {
      const fileName = command.substring(4)
      if (fileName === "example.txt") {
        output =
          "This is an example text file.\nIt contains some sample content."
      } else if (fileName === "readme.md") {
        output = "# README\n\nThis is a simulated readme file."
      } else if (fileName === "script.js") {
        output =
          "console.log('Hello, world!');\n\nfunction greet() {\n  return 'Hi there!';\n}"
      } else {
        output = `cat: ${fileName}: No such file or directory`
      }
    } else {
      output = `Command not found: ${command}. Type 'help' to see available commands.`
    }

    setHistory([...history, { command, output }])
    setInput("")
  }

  const onRedClicked = () => {
    dispatch(setSoftwareName("None"))
  }

  return (
    <>
      {isTerminalOpen && (
        <motion.div
          className="flex justify-center items-center w-screen h-screen absolute"
          initial={{ opacity: 0, scale: 0, y: 300 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-[50%] rounded-xl border border-slate-200/50">
            <div className="py-3 px-4 bg-slate-800 rounded-t-xl">
              <ThreeControlButtons onRedClicked={onRedClicked} />
            </div>

            <div
              className="bg-black rounded-b-xl text-green-500 font-mono p-4 h-[calc(100vh-300px)] flex flex-col"
              onClick={() => {
                inputRef.current?.focus()
              }}
            >
              <div
                ref={terminalRef}
                className="flex-1 overflow-y-auto whitespace-pre-wrap"
              >
                {history.map((item, index) => (
                  <div key={index} className="mb-2">
                    {item.command && (
                      <div className="flex">
                        <span className="text-blue-400">
                          {currentDirectory}
                        </span>
                        <span className="text-white mx-1">$</span>
                        <span>{item.command}</span>
                      </div>
                    )}
                    <div>{item.output}</div>
                  </div>
                ))}

                <div className="flex items-center">
                  <span className="text-blue-400">{currentDirectory}</span>
                  <span className="text-white mx-1">$</span>
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center relative font-mono"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="absolute left-0 top-0 w-full h-full opacity-0 z-10"
                      autoFocus
                      spellCheck="false"
                      autoComplete="off"
                      disabled={isHacking}
                    />

                    <div className="flex items-center whitespace-pre text-green-500">
                      <span ref={spanRef}>
                        {isHacking ? "Hacking in progress..." : input}
                      </span>
                      <motion.span
                        className="ml-[-1px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      >
                        |
                      </motion.span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default Terminal
