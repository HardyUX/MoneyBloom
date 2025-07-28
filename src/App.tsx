import { useState } from 'react'
import Header from "./components/Header";
import ExpenseTable from "./components/ExpenseTable";
import CategoryManagerModal from "./components/CategoryManagerModal";
import StatsSidebar from "./components/StatsSidebar";
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="grid md:grid-cols-[1fr_300px] gap-6 p-4">
        <ExpenseTable />
        <StatsSidebar />
      </main>
      <CategoryManagerModal />
    </div>
  )
}

export default App
