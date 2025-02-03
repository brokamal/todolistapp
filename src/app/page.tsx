"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaFile, FaTrash } from "react-icons/fa";

const Sidebar = ({ onSelect, files, addFile }) => {
  return (
    <aside className="w-64 h-screen bg-white p-4 border-r shadow-md">
      <h2 className="text-xl font-helvetica font-bold text-gray-700">Files</h2>
      <button
        onClick={addFile}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 flex items-center justify-center gap-2 hover:bg-blue-600 transition"
      >
        <FaPlus /> Add File
      </button>
      <div className="mt-4 space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center text-gray-700 cursor-pointer p-2 hover:bg-gray-200 rounded transition"
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
  const [todos, setTodos] = useState({});
  const [doneTodos, setDoneTodos] = useState({});
  const [newTodo, setNewTodo] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setFiles([]); 
  }, []);

  const addFile = () => {
    const newFileName = `File ${files.length + 1}`;
    setFiles([...files, newFileName]);
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSelect={setSelectedFile} files={files} addFile={addFile} />
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
                onKeyDown={handleKeyDown}
                className="border p-2 rounded flex-1"
                placeholder="Enter a new task..."
              />
              <button
                onClick={addTodo}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                <FaPlus />
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {(todos[selectedFile] || []).map((todo, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    onChange={() => toggleTodo(index)}
                  />
                  <span>{todo.text}</span>
                </li>
              ))}
            </ul>
            {doneTodos[selectedFile]?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-helvetica text-gray-600">Done</h2>
                <ul className="mt-2 space-y-2">
                  {doneTodos[selectedFile].map((todo, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-500 line-through">
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
  );
};

export default Page;
