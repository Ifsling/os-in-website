"use client"

import type React from "react"

import { Button, Input, PressEvent } from "@heroui/react"
import { CiBookmark } from "react-icons/ci"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { FaArrowRotateRight, FaPlus } from "react-icons/fa6"
import { IoIosSettings } from "react-icons/io"
import { IoHomeSharp } from "react-icons/io5"
import { RxCross2 } from "react-icons/rx"

import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { setSoftwareName } from "src/redux/features/openedSoftware"
import { useAppDispatch, useAppSelector } from "src/redux/hooks"
import ThreeControlButtons from "./ThreeControlButtons"

interface Tab {
  id: string
  url: string
  title: string
  favicon: string
}

export default function Browser() {
  const dispatch = useAppDispatch()

  const isBrowserOpen =
    useAppSelector((state) => state.openedSoftware.name) === "Browser"

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      url: "https://example.com",
      title: "Example Domain",
      favicon: "",
    },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [currentUrl, setCurrentUrl] = useState("https://example.com")
  const [isLoading, setIsLoading] = useState(false)
  const [bookmarks] = useState([
    { title: "Example", url: "https://example.com", favicon: "" },
    {
      title: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      favicon: "",
    },
    { title: "Wikipedia", url: "https://wikipedia.org", favicon: "" },
  ])

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0]

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToUrl(currentUrl)
  }

  const navigateToUrl = (url: string) => {
    let processedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      processedUrl = `https://${url}`
    }

    setIsLoading(true)
    setCurrentUrl(processedUrl)

    // Update the active tab
    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTabId ? { ...tab, url: processedUrl } : tab
    )
    setTabs(updatedTabs)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)

      // Update tab title (in a real browser this would come from the page)
      const domain = new URL(processedUrl).hostname.replace("www.", "")
      const updatedTabsWithTitle = tabs.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, url: processedUrl, title: domain }
          : tab
      )
      setTabs(updatedTabsWithTitle)
    }, 1000)
  }

  const addNewTab = () => {
    const newTab = {
      id: Date.now().toString(),
      url: "about:blank",
      title: "New Tab",
      favicon: "",
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
    setCurrentUrl("about:blank")
  }

  const closeTab = (id: string, e: PressEvent) => {
    // e.stopPropagation()

    if (tabs.length === 1) {
      // Don't close the last tab, reset it instead
      const resetTab = {
        id: Date.now().toString(),
        url: "about:blank",
        title: "New Tab",
        favicon: "",
      }
      setTabs([resetTab])
      setActiveTabId(resetTab.id)
      setCurrentUrl("about:blank")
      return
    }

    const newTabs = tabs.filter((tab) => tab.id !== id)
    setTabs(newTabs)

    // If we're closing the active tab, activate another one
    if (id === activeTabId) {
      setActiveTabId(newTabs[0].id)
      setCurrentUrl(newTabs[0].url)
    }
  }

  const goBack = () => {
    if (iframeRef.current) {
      // This won't work in most cases due to iframe restrictions
      // Just simulating the  {
      // This won't work in most cases due to iframe restrictions
      // Just simulating the behavior
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  const goForward = () => {
    if (iframeRef.current) {
      // This won't work in most cases due to iframe restrictions
      // Just simulating the behavior
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  const refresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

  const goHome = () => {
    navigateToUrl("https://example.com")
  }

  const onRedClicked = () => {
    dispatch(setSoftwareName("None"))
  }

  return (
    <>
      {isBrowserOpen && (
        <motion.div
          className="flex w-full h-full justify-center items-center text-white"
          initial={{ opacity: 0, scale: 0, y: +300 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-[70%] border rounded-xl border-slate-200/50">
            <div className="py-3 px-4 bg-slate-800 rounded-t-xl">
              <ThreeControlButtons onRedClicked={onRedClicked} />
            </div>
            <div className="flex flex-col h-[calc(100vh-300px)]">
              {/* Browser chrome */}
              <div className="bg-gray-100 dark:bg-gray-900 border-b">
                {/* Tabs */}
                <div className="flex items-center px-2">
                  <div className="flex-1 flex overflow-x-auto">
                    {tabs.map((tab) => (
                      <div
                        key={tab.id}
                        className={`flex items-center gap-2 px-3 py-2 border-r cursor-pointer max-w-[200px] min-w-[100px] ${
                          activeTabId === tab.id
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                        onClick={() => {
                          setActiveTabId(tab.id)
                          setCurrentUrl(tab.url)
                        }}
                      >
                        <div className="truncate flex-1 text-sm">
                          {tab.title}
                        </div>
                        <div
                          className="flex justify-center items-center h-5 w-5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                          onClick={(e: any) => closeTab(tab.id, e)}
                        >
                          <RxCross2 className="" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onPress={addNewTab}
                  >
                    <FaPlus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation bar */}
                <div className="flex items-center gap-2 p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onPress={goBack}
                  >
                    <FaArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onPress={goForward}
                  >
                    <FaArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onPress={refresh}
                  >
                    <FaArrowRotateRight
                      className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onPress={goHome}
                  >
                    <IoHomeSharp className="h-4 w-4" />
                  </Button>

                  <form onSubmit={handleUrlSubmit} className="flex-1">
                    <Input
                      type="text"
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      className="h-8 bg-gray-200 dark:bg-gray-700"
                    />
                  </form>

                  <Button variant="ghost" size="sm" className="h-8 w-8">
                    <CiBookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8">
                    <IoIosSettings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Browser content */}
              <div className="flex-1 bg-white dark:bg-gray-800 overflow-hidden">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="h-full">
                    {activeTab.url === "about:blank" ? (
                      <div className="h-full flex flex-col items-center justify-center p-8">
                        <h2 className="text-2xl font-bold mb-8">New Tab</h2>
                        <div className="grid grid-cols-4 gap-4 max-w-2xl">
                          {bookmarks.map((bookmark, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              onClick={() => navigateToUrl(bookmark.url)}
                            >
                              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                                {bookmark.title.charAt(0)}
                              </div>
                              <div className="text-sm text-center">
                                {bookmark.title}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <iframe
                        ref={iframeRef}
                        src={activeTab.url}
                        className="w-full h-full border-none"
                        sandbox="allow-same-origin allow-scripts"
                        title="Browser Content"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
