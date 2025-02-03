"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaFile, FaTrash } from "react-icons/fa";

const Sidebar = ({ files, addFile }) => {
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
          <Link key={index} href={`/files/${file}`} className="block">
            <div className="flex items-center text-gray-700 cursor-pointer p-2 hover:bg-gray-200 rounded transition">
              <FaFile />
              <span className="truncate ml-2">{file}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

const Page = ({ params }) => {
  const router = useRouter();
  const fileName = params?.file || null;
  const [todos, setTodos] = useState({});
  const [doneTodos, setDoneTodos] = useState({});
  const [newTodo, setNewTodo] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles([]);
  }, []);

  const addFile = () => {
    const newFileName = `File ${files.length + 1}`;
    setFiles([...files, newFileName]);
  };

  const deleteFile = () => {
    if (!fileName) return;
    setFiles(files.filter((f) => f !== fileName));
    setTodos((prev) => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
    setDoneTodos((prev) => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
    router.push("/");
  };

  const addTodo = () => {
    if (newTodo.trim() && fileName) {
      setTodos((prev) => ({
        ...prev,
        [fileName]: [...(prev[fileName] || []), { text: newTodo, completed: false }],
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
    const updatedTodos = [...(todos[fileName] || [])];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    if (updatedTodos[index].completed) {
      setDoneTodos((prev) => ({
        ...prev,
        [fileName]: [...(prev[fileName] || []), updatedTodos[index]],
      }));
      setTodos((prev) => ({
        ...prev,
        [fileName]: updatedTodos.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar files={files} addFile={addFile} />
      <main className="flex-1 p-6 relative">
        {fileName && (
          <button
            onClick={deleteFile}
            className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            <FaTrash />
          </button>
        )}
        <h1 className="text-2xl font-helvetica font-bold text-gray-700">{fileName || "Select a File"}</h1>
        {fileName && (
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
              {(todos[fileName] || []).map((todo, index) => (
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
            {doneTodos[fileName]?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-helvetica text-gray-600">Done</h2>
                <ul className="mt-2 space-y-2">
                  {doneTodos[fileName].map((todo, index) => (
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
