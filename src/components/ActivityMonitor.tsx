"use client"

import { Button, Input } from "@heroui/react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { setSoftwareName } from "src/redux/features/openedSoftware"
import { useAppDispatch, useAppSelector } from "src/redux/hooks"
import ThreeControlButtons from "./ThreeControlButtons"

interface Process {
  id: number
  name: string
  cpu: number
  memory: number
  threads: number
  kind: string
}

const ActivityMonitor = () => {
  const dispatch = useAppDispatch()

  const isActivityMonitorOpen =
    useAppSelector((state) => state.openedSoftware.name) === "Activity Monitor"

  const [processes, setProcesses] = useState<Process[]>([])
  const [sortBy, setSortBy] = useState<keyof Process>("cpu")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [energyUsage, setEnergyUsage] = useState(0)
  const [diskUsage, setDiskUsage] = useState(0)
  const [networkUsage, setNetworkUsage] = useState(0)

  // Generate random processes on mount
  useEffect(() => {
    const appNames = [
      "Finder",
      "Safari",
      "Mail",
      "Photos",
      "Messages",
      "Calendar",
      "Notes",
      "Reminders",
      "Maps",
      "FaceTime",
      "Music",
      "Podcasts",
      "TV",
      "News",
      "Stocks",
      "Voice Memos",
      "Books",
      "App Store",
      "System Settings",
      "Terminal",
      "TextEdit",
      "Calculator",
      "Dictionary",
      "Chrome",
      "Firefox",
      "Slack",
      "Discord",
      "Spotify",
      "VSCode",
      "Photoshop",
    ]

    const processKinds = ["App", "System", "Helper", "Background", "Service"]

    const generateProcesses = () => {
      const newProcesses: Process[] = []

      // Generate 30 random processes
      for (let i = 0; i < 30; i++) {
        const name = appNames[Math.floor(Math.random() * appNames.length)]
        newProcesses.push({
          id: i + 1,
          name,
          cpu: Number.parseFloat((Math.random() * 15).toFixed(1)),
          memory: Number.parseFloat((Math.random() * 500).toFixed(1)),
          threads: Math.floor(Math.random() * 20) + 1,
          kind: processKinds[Math.floor(Math.random() * processKinds.length)],
        })
      }

      return newProcesses
    }

    setProcesses(generateProcesses())

    // Update system metrics every 2 seconds
    const interval = setInterval(() => {
      setCpuUsage(Number.parseFloat((Math.random() * 100).toFixed(1)))
      setMemoryUsage(Number.parseFloat((Math.random() * 16).toFixed(1)))
      setEnergyUsage(Number.parseFloat((Math.random() * 100).toFixed(1)))
      setDiskUsage(Number.parseFloat((Math.random() * 100).toFixed(1)))
      setNetworkUsage(Number.parseFloat((Math.random() * 10).toFixed(1)))

      // Slightly update process values
      setProcesses((prev) =>
        prev.map((process) => ({
          ...process,
          cpu: Number.parseFloat(
            (process.cpu + (Math.random() * 2 - 1)).toFixed(1)
          ),
          memory: Number.parseFloat(
            (process.memory + (Math.random() * 10 - 5)).toFixed(1)
          ),
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Sort and filter processes
  const sortedProcesses = [...processes]
    .filter((process) =>
      process.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })

  const handleSort = (column: keyof Process) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("desc")
    }
  }

  const onRedClicked = () => {
    dispatch(setSoftwareName("None"))
  }

  return (
    <>
      {isActivityMonitorOpen && (
        <motion.div
          className="flex flex-col w-screen h-screen justify-center items-center absolute"
          initial={{ opacity: 0, scale: 0, y: +300 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-[70%] border rounded-xl border-slate-200/50">
            <div className="py-3 px-4 bg-slate-800 rounded-t-xl">
              <ThreeControlButtons onRedClicked={onRedClicked} />
            </div>
            <div className="flex flex-col justify-center h-[calc(100vh-300px)] bg-[#1e1e1e] text-white">
              {/* Top bar with search */}
              <div className="flex items-center p-3 border-b border-[#3a3a3a]">
                <div className="relative w-64">
                  <Input
                    type="text"
                    placeholder="Search processes"
                    value={searchTerm}
                    size="sm"
                    startContent={
                      <FaSearch className="transform h-4 w-4 text-gray-400" />
                    }
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex ml-auto space-x-2">
                  <Button
                    variant="bordered"
                    size="sm"
                    className="h-8 bg-[#3a3a3a] border-[#4a4a4a] hover:bg-[#4a4a4a]"
                  >
                    CPU
                  </Button>
                  <Button
                    variant="bordered"
                    size="sm"
                    className="h-8 bg-[#3a3a3a] border-[#4a4a4a] hover:bg-[#4a4a4a]"
                  >
                    Memory
                  </Button>
                  <Button
                    variant="bordered"
                    size="sm"
                    className="h-8 bg-[#3a3a3a] border-[#4a4a4a] hover:bg-[#4a4a4a]"
                  >
                    Energy
                  </Button>
                  <Button
                    variant="bordered"
                    size="sm"
                    className="h-8 bg-[#3a3a3a] border-[#4a4a4a] hover:bg-[#4a4a4a]"
                  >
                    Disk
                  </Button>
                  <Button
                    variant="bordered"
                    size="sm"
                    className="h-8 bg-[#3a3a3a] border-[#4a4a4a] hover:bg-[#4a4a4a]"
                  >
                    Network
                  </Button>
                </div>
              </div>

              {/* System metrics */}
              <div className="grid grid-cols-5 gap-4 p-4 bg-[#252525]">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">CPU</span>
                  <div className="h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${cpuUsage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">{cpuUsage}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">Memory</span>
                  <div className="h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(memoryUsage / 16) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">{memoryUsage} GB</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">Energy</span>
                  <div className="h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${energyUsage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">{energyUsage}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">Disk</span>
                  <div className="h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${diskUsage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">{diskUsage}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">Network</span>
                  <div className="h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(networkUsage / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">{networkUsage} MB/s</span>
                </div>
              </div>

              {/* Process table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#2a2a2a]">
                    <tr className="border-b border-[#3a3a3a]">
                      <th
                        className="px-4 py-2 text-left cursor-pointer hover:bg-[#3a3a3a]"
                        onClick={() => handleSort("name")}
                      >
                        Process Name
                        {sortBy === "name" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-4 py-2 text-right cursor-pointer hover:bg-[#3a3a3a]"
                        onClick={() => handleSort("cpu")}
                      >
                        CPU %
                        {sortBy === "cpu" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-4 py-2 text-right cursor-pointer hover:bg-[#3a3a3a]"
                        onClick={() => handleSort("memory")}
                      >
                        Memory (MB)
                        {sortBy === "memory" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-4 py-2 text-right cursor-pointer hover:bg-[#3a3a3a]"
                        onClick={() => handleSort("threads")}
                      >
                        Threads
                        {sortBy === "threads" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-4 py-2 text-left cursor-pointer hover:bg-[#3a3a3a]"
                        onClick={() => handleSort("kind")}
                      >
                        Kind
                        {sortBy === "kind" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProcesses.map((process) => (
                      <tr
                        key={process.id}
                        className="border-b border-[#3a3a3a] hover:bg-[#2a2a2a]"
                      >
                        <td className="px-4 py-2">{process.name}</td>
                        <td className="px-4 py-2 text-right">{process.cpu}%</td>
                        <td className="px-4 py-2 text-right">
                          {process.memory}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {process.threads}
                        </td>
                        <td className="px-4 py-2">{process.kind}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default ActivityMonitor
