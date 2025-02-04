"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaFile, FaTrash, FaEdit } from "react-icons/fa";

const Sidebar = ({ onSelect, files, createFile, renameFile, newFileName, setNewFileName }) => {
  return (
    <aside className="w-120 h-screen bg-white p-4">
      <h2 className="text-xl font-helvetica font-bold text-gray-700">Files</h2>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          className="border p-2 rounded flex-1 text-black"
          placeholder="Enter file name..."
        />
        <button
          onClick={createFile}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          <FaPlus />
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-gray-700 cursor-pointer p-2 hover:bg-gray-200 rounded transition"
          >
            <div onClick={() => onSelect(file)} className="flex items-center">
              <FaFile />
              <span className="truncate ml-2">{file}</span>
            </div>
            <FaEdit className="cursor-pointer text-blue-500" onClick={() => renameFile(file)} />
          </div>
        ))}
      </div>
    </aside>
  );
};

const Page = () => {
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem("todos")) || {});
  const [doneTodos, setDoneTodos] = useState(() => JSON.parse(localStorage.getItem("doneTodos")) || {});
  const [newTodo, setNewTodo] = useState("");
  const [files, setFiles] = useState(() => JSON.parse(localStorage.getItem("files")) || []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("doneTodos", JSON.stringify(doneTodos));
  }, [files, todos, doneTodos]);

  const createFile = () => {
    if (newFileName.trim() && !files.includes(newFileName)) {
      setFiles([...files, newFileName]);
      setNewFileName("");
    }
  };

  const renameFile = (oldName) => {
    const newName = prompt("Enter new file name:", oldName);
    if (newName && newName !== oldName) {
      setFiles(files.map((file) => (file === oldName ? newName : file)));
      setTodos((prev) => {
        const updated = { ...prev };
        updated[newName] = updated[oldName];
        delete updated[oldName];
        return updated;
      });
      setDoneTodos((prev) => {
        const updated = { ...prev };
        updated[newName] = updated[oldName];
        delete updated[oldName];
        return updated;
      });
      if (selectedFile === oldName) setSelectedFile(newName);
    }
  };

  const deleteFile = () => {
    if (!selectedFile) return;
    setFiles(files.filter((f) => f !== selectedFile));
    setTodos((prev) => {
      const updated = { ...prev };
      delete updated[selectedFile];
      return updated;
    });
    setDoneTodos((prev) => {
      const updated = { ...prev };
      delete updated[selectedFile];
      return updated;
    });
    setSelectedFile(null);
  };

  const addTodo = () => {
    if (newTodo.trim() && selectedFile) {
      setTodos((prev) => ({
        ...prev,
        [selectedFile]: [...(prev[selectedFile] || []), { text: newTodo, completed: false }],
      }));
      setNewTodo("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        onSelect={setSelectedFile} 
        files={files} 
        createFile={createFile} 
        renameFile={renameFile} 
        newFileName={newFileName} 
        setNewFileName={setNewFileName} 
      />
      <main className="flex-1 p-6 relative">
        {selectedFile && (
          <button
            onClick={deleteFile}
            className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            <FaTrash />
          </button>
        )}
        <h1 className="text-2xl font-helvetica font-bold text-gray-700">{selectedFile || "Select a File"}</h1>
        {selectedFile && (
          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="border p-2 rounded flex-1 text-black"
                placeholder="Enter a new task..."
              />
              <button
                onClick={addTodo}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
