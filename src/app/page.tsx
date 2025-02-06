"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaFile, FaTrash } from "react-icons/fa";

const Sidebar = ({ onSelect, files, addFile, newFileName, setNewFileName }) => {
  return (
    <aside className="w-100 h-screen bg-[#f5f0dc] p-4">
      <h2 className="text-2xl font-helvetica font-bold text-[#5a4632]">Files</h2>
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addFile();
          }}
          className="border p-2 rounded flex-1 text-[#5a4632] bg-[#ede3c7]"
          placeholder="Enter file name..."
        />
        <button
          onClick={addFile}
          className="bg-[#a67c52] text-white px-4 py-2 rounded hover:bg-[#8a6241] transition"
        >
          <FaPlus />
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center text-[#5a4632] cursor-pointer p-2 hover:bg-[#e0d2b5] rounded transition"
            onClick={() => onSelect(file)}
          >
            <FaFile />
            <span className="truncate ml-2">{file}</span>
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

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("doneTodos", JSON.stringify(doneTodos));
  }, [files, todos, doneTodos]);

  const [newFileName, setNewFileName] = useState("");

  const addFile = () => {
    if (newFileName.trim() && !files.includes(newFileName)) {
      setFiles([...files, newFileName]);
      setNewFileName("");
    } else if (files.includes(newFileName)) {
      alert("File name already exists!");
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const toggleTodo = (index) => {
    const updatedTodos = [...(todos[selectedFile] || [])];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    if (updatedTodos[index].completed) {
      setDoneTodos((prev) => ({
        ...prev,
        [selectedFile]: [...(prev[selectedFile] || []), updatedTodos[index]],
      }));
      setTodos((prev) => ({
        ...prev,
        [selectedFile]: updatedTodos.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <div className="flex bg-[#f5f0dc] min-h-screen">
      <Sidebar onSelect={setSelectedFile} files={files} addFile={addFile} newFileName={newFileName} setNewFileName={setNewFileName} />
      <div className="flex flex-1">
        <main className="bg-[#f5f0dc] rounded-lg p-6 w-[80%] max-w-4xl h-screen overflow-y-auto relative">
          {selectedFile && (
            <button
              onClick={deleteFile}
              className="absolute top-6 right-6 bg-[#d9534f] text-white px-4 py-2 rounded hover:bg-[#c9302c] transition"
            >
              <FaTrash />
            </button>
          )}
          <h1 className="text-2xl font-helvetica font-bold text-[#5a4632]">{selectedFile || "Select a File"}</h1>
          {selectedFile && (
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border p-2 rounded flex-1 text-[#5a4632] bg-[#ede3c7]"
                  placeholder="Enter a new task..."
                />
                <button
                  onClick={addTodo}
                  className="bg-[#a67c52] text-white px-4 py-2 rounded hover:bg-[#8a6241] transition"
                >
                  <FaPlus />
                </button>
              </div>
              <h2 className="text-xl font-helvetica font-bold text-[#5a4632] mt-4">Todo</h2>
              <ul className="mt-4 space-y-2">
                {(todos[selectedFile] || []).map((todo, index) => (
                  <li key={index} className="flex items-center gap-2 text-[#5a4632]">
                    <input type="checkbox" className="w-4 h-4" onChange={() => toggleTodo(index)} />
                    <span>{todo.text}</span>
                  </li>
                ))}
              </ul>
              {doneTodos[selectedFile]?.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-helvetica font-bold text-[#5a4632]">Done</h2>
                  <ul className="mt-2 space-y-2">
                    {doneTodos[selectedFile].map((todo, index) => (
                      <li key={index} className="flex items-center gap-2 text-[#5a4632] line-through">
                        <input type="checkbox" className="w-4 h-4" checked disabled />
                        <span>{todo.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
