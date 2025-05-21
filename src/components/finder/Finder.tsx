"use client"

import { CiBoxList, CiGrid41 } from "react-icons/ci"
import {
  FaChevronLeft,
  FaChevronRight,
  FaFile,
  FaFolder,
  FaRegFileImage,
  FaSearch,
} from "react-icons/fa"

import { Button, Input } from "@heroui/react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { FaFileCode } from "react-icons/fa6"
import { IoIosSettings } from "react-icons/io"
import { LuCircleChevronRight, LuFileText } from "react-icons/lu"
import { GameNames, setOpenedGameName } from "src/redux/features/openedGame"
import { setSoftwareName } from "src/redux/features/openedSoftware"
import { useAppDispatch, useAppSelector } from "src/redux/hooks"
import ThreeControlButtons from "../ThreeControlButtons"

interface FileItem {
  id: string
  name: GameNames | string
  type: "file" | "folder" | "image" | "document" | "code" | "game"
  size?: string
  modified: string
  children?: FileItem[]
}

const Finder = ({
  path,
  isFolderOpen = false,
}: {
  path?: string[]
  isFolderOpen?: boolean
}) => {
  const dispatch = useAppDispatch()

  const isFinderOpen =
    useAppSelector((state) => state.openedSoftware.name) === "Finder"

  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>(
    path ? path : ["Home"]
  )

  // Sample file system data
  const fileSystem: FileItem[] = [
    {
      id: "documents",
      name: "Documents",
      type: "folder",
      modified: "May 5, 2023",
      children: [
        {
          id: "work",
          name: "Work",
          type: "folder",
          modified: "Apr 28, 2023",
          children: [
            {
              id: "report",
              name: "Annual Report.pdf",
              type: "document",
              size: "2.4 MB",
              modified: "Apr 15, 2023",
            },
            {
              id: "presentation",
              name: "Presentation.key",
              type: "document",
              size: "5.1 MB",
              modified: "Apr 20, 2023",
            },
          ],
        },
        {
          id: "personal",
          name: "Personal",
          type: "folder",
          modified: "May 1, 2023",
          children: [
            {
              id: "resume",
              name: "Resume.docx",
              type: "document",
              size: "1.2 MB",
              modified: "Mar 12, 2023",
            },
            {
              id: "budget",
              name: "Budget.xlsx",
              type: "document",
              size: "0.8 MB",
              modified: "Apr 30, 2023",
            },
          ],
        },
      ],
    },
    {
      id: "games",
      name: "Games",
      type: "folder",
      modified: "May 3, 2023",
      children: [
        {
          id: "minesweeper",
          name: "Minesweeper",
          type: "game",
          size: "50 MB",
          modified: "Jan 15, 2023",
        },
        {
          id: "tic-tac-toe",
          name: "Tic Tac Toe",
          type: "game",
          size: "22 MB",
          modified: "Jan 15, 1979",
        },
        {
          id: "memory-game",
          name: "Memory Game",
          type: "game",
          size: "50 MB",
          modified: "Jan 15, 2023",
        },
        {
          id: "snake",
          name: "Snake",
          type: "game",
          size: "500 MB",
          modified: "Jan 15, 3030",
        },
        {
          id: "2048",
          name: "2048",
          type: "game",
          size: "50 MB",
          modified: "Jan 15, 2023",
        },
        {
          id: "hangman",
          name: "Hangman",
          type: "game",
          size: "1.02 GB",
          modified: "Jan 15, 3333",
        },
      ],
    },
    {
      id: "downloads",
      name: "Downloads",
      type: "folder",
      modified: "May 6, 2023",
      children: [
        {
          id: "software",
          name: "Software.dmg",
          type: "file",
          size: "1.2 GB",
          modified: "May 5, 2023",
        },
        {
          id: "movie",
          name: "Movie.mp4",
          type: "file",
          size: "3.5 GB",
          modified: "May 1, 2023",
        },
      ],
    },
    {
      id: "applications",
      name: "Applications",
      type: "folder",
      modified: "Apr 20, 2023",
      children: [
        {
          id: "vscode",
          name: "Visual Studio Code.app",
          type: "file",
          size: "200 MB",
          modified: "Mar 15, 2023",
        },
        {
          id: "photoshop",
          name: "Adobe Photoshop.app",
          type: "file",
          size: "2.3 GB",
          modified: "Feb 10, 2023",
        },
      ],
    },
    {
      id: "projects",
      name: "Projects",
      type: "folder",
      modified: "May 4, 2023",
      children: [
        {
          id: "website",
          name: "Website",
          type: "folder",
          modified: "Apr 28, 2023",
          children: [
            {
              id: "index",
              name: "index.html",
              type: "code",
              size: "15 KB",
              modified: "Apr 25, 2023",
            },
            {
              id: "styles",
              name: "styles.css",
              type: "code",
              size: "8 KB",
              modified: "Apr 26, 2023",
            },
            {
              id: "script",
              name: "script.js",
              type: "code",
              size: "12 KB",
              modified: "Apr 27, 2023",
            },
          ],
        },
        {
          id: "app",
          name: "Mobile App",
          type: "folder",
          modified: "May 2, 2023",
          children: [
            {
              id: "app-code",
              name: "App.js",
              type: "code",
              size: "25 KB",
              modified: "May 1, 2023",
            },
            {
              id: "readme",
              name: "README.md",
              type: "document",
              size: "3 KB",
              modified: "Apr 30, 2023",
            },
          ],
        },
      ],
    },
  ]

  const renderSidebarItems = () => {
    return fileSystem.map((item) => (
      <div
        key={item.id}
        className={`flex items-center py-2 px-3 hover:bg-[#3a3a3a] rounded cursor-pointer ${
          currentPath[currentPath.length - 1] === item.name
            ? "bg-[#3a3a3a]"
            : ""
        }`}
        onClick={() => {
          if (item.type === "folder") {
            setCurrentPath([currentPath[0], item.name])
          }
        }}
      >
        {renderFileIcon(item.type)}
        <span className="ml-2 text-sm truncate">{item.name}</span>
      </div>
    ))
  }

  // Navigate to a folder
  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
  }

  // Navigate up one level
  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  // Get current folder content based on path
  const getCurrentFolderContent = (): FileItem[] => {
    if (currentPath.length === 1) {
      return fileSystem
    }

    let current = [...fileSystem]
    for (let i = 1; i < currentPath.length; i++) {
      const folder = current.find(
        (item) => item.name === currentPath[i] && item.type === "folder"
      )
      if (folder && folder.children) {
        current = folder.children
      } else {
        return []
      }
    }
    return current
  }

  // Filter content by search term
  const filteredContent = getCurrentFolderContent().filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Render file icon based on type
  const renderFileIcon = (type: string, icon?: ReactNode) => {
    switch (type) {
      case "folder":
        return <FaFolder className="h-5 w-5 text-blue-400" />
      case "image":
        return <FaRegFileImage className="h-5 w-5 text-green-400" />
      case "document":
        return <LuFileText className="h-5 w-5 text-yellow-400" />
      case "code":
        return <FaFileCode className="h-5 w-5 text-purple-400" />
      case "game":
        return icon
      default:
        return <FaFile className="h-5 w-5 text-gray-400" />
    }
  }

  const GameIcons = {
    minesweeper:
      viewMode === "list" ? (
        <Image
          src="/icons/minesweeper.png"
          alt="Minesweeper"
          width={40}
          height={40}
        />
      ) : (
        <Image
          src="/icons/minesweeper.png"
          alt="Minesweeper"
          width={60}
          height={60}
        />
      ),

    "tic-tac-toe":
      viewMode === "list" ? (
        <Image
          src="/icons/tic-tac-toe.png"
          alt="Tic Tac Toe"
          width={40}
          height={40}
        />
      ) : (
        <Image
          src="/icons/tic-tac-toe.png"
          alt="Tic Tac Toe"
          width={60}
          height={60}
        />
      ),

    "memory-game":
      viewMode === "list" ? (
        <Image
          src="/icons/memory-game.png"
          alt="Memory Game"
          width={40}
          height={40}
        />
      ) : (
        <Image
          src="/icons/memory-game.png"
          alt="Memory Game"
          width={60}
          height={60}
        />
      ),

    snake:
      viewMode === "list" ? (
        <Image src="/icons/snake.png" alt="Snake" width={40} height={40} />
      ) : (
        <Image src="/icons/snake.png" alt="Snake" width={60} height={60} />
      ),

    2048:
      viewMode === "list" ? (
        <Image src="/icons/2048.png" alt="2048" width={40} height={40} />
      ) : (
        <Image src="/icons/2048.png" alt="2048" width={60} height={60} />
      ),

    hangman:
      viewMode === "list" ? (
        <Image src="/icons/hangman.png" alt="Hangman" width={40} height={40} />
      ) : (
        <Image src="/icons/hangman.png" alt="Hangman" width={60} height={60} />
      ),
  }

  const onRedClicked = () => {
    dispatch(setSoftwareName("None"))
  }

  return (
    <>
      {(isFinderOpen || isFolderOpen) && (
        <motion.div
          className="flex w-screen h-screen absolute justify-center items-center "
          initial={{ opacity: 0, scale: 0, y: +300 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-[70%] border rounded-xl border-slate-200/50">
            <div className="py-3 px-4 bg-slate-800 rounded-t-xl">
              <ThreeControlButtons onRedClicked={onRedClicked} />
            </div>

            <div className="flex h-[calc(100vh-300px)] bg-[#1e1e1e] text-white">
              {/* Sidebar */}
              <div className="w-64 border-r border-[#3a3a3a] overflow-y-auto">
                <div className="p-3 border-b border-[#3a3a3a]">
                  <div className="text-sm font-medium">Favorites</div>
                </div>
                <div className="p-2">{renderSidebarItems()}</div>
              </div>

              {/* Main content */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="flex items-center p-2 border-b border-[#3a3a3a] bg-[#2a2a2a]">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a]"
                      onPress={navigateUp}
                    >
                      <FaChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a]"
                    >
                      <FaChevronRight className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center mx-4 text-sm">
                    {currentPath.map((path, index) => (
                      <div key={index} className="flex items-center">
                        {index > 0 && (
                          <LuCircleChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                        )}
                        <span>{path}</span>
                      </div>
                    ))}
                  </div>

                  <div className="ml-auto flex items-center space-x-2">
                    <div className="relative w-48">
                      <Input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        size="sm"
                        variant="bordered"
                        startContent={
                          <FaSearch className="h-3 w-3 text-gray-400" />
                        }
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                        className="pl-7 h-7  border-[#4a4a4a] text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7"
                      onPress={() =>
                        setViewMode(viewMode === "list" ? "grid" : "list")
                      }
                    >
                      {viewMode === "list" ? (
                        <CiGrid41 className="h-4 w-4" />
                      ) : (
                        <CiBoxList className="h-4 w-4" />
                      )}
                    </Button>

                    <Button variant="ghost" size="sm" className="h-7 w-7">
                      <IoIosSettings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* File browser */}
                <div className="flex-1 overflow-auto p-2">
                  {viewMode === "list" ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#3a3a3a]">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Date Modified</th>
                          <th className="px-4 py-2 text-left">Size</th>
                          <th className="px-4 py-2 text-left">Kind</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContent.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-[#3a3a3a] hover:bg-[#2a2a2a] cursor-pointer"
                            onClick={() => {
                              if (item.type === "folder") {
                                navigateToFolder(item.name)
                              }
                            }}
                          >
                            <td className="px-4 py-2">
                              <div
                                className="flex items-center"
                                onDoubleClick={() => {
                                  if (item.type === "game") {
                                    dispatch(
                                      setOpenedGameName(item.name as GameNames)
                                    )
                                  }
                                }}
                              >
                                {item.type === "game"
                                  ? renderFileIcon(
                                      item.type,
                                      GameIcons[
                                        item.id as keyof typeof GameIcons
                                      ]
                                    )
                                  : renderFileIcon(item.type)}
                                <span className="ml-2">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2">{item.modified}</td>
                            <td className="px-4 py-2">{item.size || "--"}</td>
                            <td className="px-4 py-2">
                              {item.type.charAt(0).toUpperCase() +
                                item.type.slice(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="grid grid-cols-4 gap-4 p-4">
                      {filteredContent.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col items-center p-3 rounded hover:bg-[#2a2a2a] cursor-pointer"
                          onClick={() => {
                            if (item.type === "folder") {
                              navigateToFolder(item.name)
                            }
                          }}
                        >
                          <div className="w-16 h-16 flex items-center justify-center bg-[#2a2a2a] rounded mb-2">
                            {item.type === "game"
                              ? renderFileIcon(
                                  item.type,
                                  GameIcons[item.id as keyof typeof GameIcons]
                                )
                              : renderFileIcon(item.type)}
                          </div>
                          <span className="text-xs text-center truncate w-full">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>{" "}
        </motion.div>
      )}
    </>
  )
}

export default Finder
