import { useState } from 'react'
import Navbar from './components/Navbar'
import Tasks from './components/Tasks'

function App() {

  return (
    <>
      <div className='bg-gradient-to-r from-neutral-300 to-stone-400 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 dark:text-white  flex flex-col w-full min-h-screen bg-white font-reddit text-zinc-900' >
        <Navbar />
        <Tasks />
      </div>
    </>
  )
}

export default App
