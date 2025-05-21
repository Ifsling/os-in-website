"use client"

import type React from "react"

import { Button, Input, Textarea } from "@heroui/react"
import { useEffect, useState } from "react"
// import { Save, FileUp, FileDown, Trash2, Plus, Menu } from "lucide-react"
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react"
import { FaRegSave, FaTrash } from "react-icons/fa"
import { FaPlus, FaUpload } from "react-icons/fa6"
import { IoMdDownload } from "react-icons/io"
import { IoMenu } from "react-icons/io5"

const NotepadBody = () => {
  const [notes, setNotes] = useState<
    { id: string; title: string; content: string }[]
  >([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [activeNote, setActiveNote] = useState({ title: "", content: "" })

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes)
      setNotes(parsedNotes)

      // Set the first note as active if there are any notes
      if (parsedNotes.length > 0) {
        setActiveNoteId(parsedNotes[0].id)
        setActiveNote({
          title: parsedNotes[0].title,
          content: parsedNotes[0].content,
        })
      }
    } else {
      // Create a default note if no notes exist
      const defaultNote = {
        id: Date.now().toString(),
        title: "Untitled Note",
        content: "",
      }
      setNotes([defaultNote])
      setActiveNoteId(defaultNote.id)
      setActiveNote({
        title: defaultNote.title,
        content: defaultNote.content,
      })
      localStorage.setItem("notes", JSON.stringify([defaultNote]))
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  }, [notes])

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
    }
    setNotes([...notes, newNote])
    setActiveNoteId(newNote.id)
    setActiveNote({
      title: newNote.title,
      content: newNote.content,
    })
  }

  const saveCurrentNote = () => {
    if (!activeNoteId) return

    const updatedNotes = notes.map((note) =>
      note.id === activeNoteId
        ? { ...note, title: activeNote.title, content: activeNote.content }
        : note
    )
    setNotes(updatedNotes)
  }

  const deleteCurrentNote = () => {
    if (!activeNoteId) return

    const updatedNotes = notes.filter((note) => note.id !== activeNoteId)
    setNotes(updatedNotes)

    if (updatedNotes.length > 0) {
      setActiveNoteId(updatedNotes[0].id)
      setActiveNote({
        title: updatedNotes[0].title,
        content: updatedNotes[0].content,
      })
    } else {
      createNewNote()
    }
  }

  const switchNote = (id: string) => {
    const selectedNote = notes.find((note) => note.id === id)
    if (selectedNote) {
      setActiveNoteId(id)
      setActiveNote({
        title: selectedNote.title,
        content: selectedNote.content,
      })
    }
  }

  const exportNote = () => {
    if (!activeNoteId) return

    const noteToExport = notes.find((note) => note.id === activeNoteId)
    if (!noteToExport) return

    const blob = new Blob([noteToExport.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${noteToExport.title || "untitled"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const newNote = {
        id: Date.now().toString(),
        title: file.name.replace(/\.txt$/, ""),
        content,
      }
      setNotes([...notes, newNote])
      setActiveNoteId(newNote.id)
      setActiveNote({
        title: newNote.title,
        content: newNote.content,
      })
    }
    reader.readAsText(file)

    // Reset the input
    e.target.value = ""
  }

  return (
    <div className="flex h-[calc(100vh-300px)] text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-r-slate-200/20 bg-gray-50 dark:bg-gray-900 flex flex-col rounded-bl-xl">
        <div className="p-4 border-b border-b-slate-200/20 flex justify-between items-center">
          <h2 className="font-semibold">Notes</h2>
          <Button variant="ghost" size="sm" onPress={createNewNote}>
            <FaPlus className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto flex-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 border-b border-b-slate-200/20 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                activeNoteId === note.id ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
              onClick={() => switchNote(note.id)}
            >
              <div className="font-medium truncate">
                {note.title || "Untitled Note"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {note.content.substring(0, 50)}
                {note.content.length > 50 ? "..." : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-[#272829] rounded-br-xl">
        <div className="p-4 border-b border-b-slate-200/20 flex justify-between items-center">
          <Input
            value={activeNote.title}
            onChange={(e) =>
              setActiveNote({ ...activeNote, title: e.target.value })
            }
            className="font-semibold border-none focus-visible:ring-0 p-0 m-0 "
            placeholder="Untitled Note"
          />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onPress={saveCurrentNote}>
              <FaRegSave className="h-4 w-4" />
            </Button>

            <Dropdown className="text-white">
              <DropdownTrigger asChild>
                <Button variant="ghost" size="sm">
                  <IoMenu className="h-4 w-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={exportNote} key="export">
                  <div className="flex ga-3">
                    <IoMdDownload className="h-4 w-4 mr-2" />
                    Export
                  </div>
                </DropdownItem>
                <DropdownItem
                  onClick={() =>
                    document.getElementById("import-note")?.click()
                  }
                  key="import"
                >
                  <div className="flex ga-3">
                    <FaUpload className="h-4 w-4 mr-2" />
                    Import
                  </div>
                  <input
                    id="import-note"
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={importNote}
                  />
                </DropdownItem>
                <DropdownItem
                  onClick={deleteCurrentNote}
                  className="text-red-500"
                  key="delete"
                >
                  <div className="flex ga-3">
                    <FaTrash className="h-4 w-4 mr-2" />
                    Delete
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <Textarea
          value={activeNote.content}
          onChange={(e) =>
            setActiveNote({ ...activeNote, content: e.target.value })
          }
          minRows={32}
          maxRows={32}
          rows={10}
          className="flex-1  resize-none p-4 border-none focus-visible:ring-0 rounded-none"
          placeholder="Start typing..."
        />
      </div>
    </div>
  )
}

export default NotepadBody
