import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./index.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="pt-16 pl-48">
        <div className="p-6">
          {/* 主要内容区域 */}
          <div>Content</div>
        </div>
      </main>
    </div>
  );
}

export default App;
