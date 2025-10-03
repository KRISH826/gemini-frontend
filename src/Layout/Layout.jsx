import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import MainRouter from '../routes/Router'
import { FaMobile } from 'react-icons/fa'
import MobileSidebar from '@/components/MobileSidebar'

const Layout = () => {
  const [mobileSidebar, setmobileSidebar] = useState(false);
  const handleCollapse = () => {
    setmobileSidebar(!mobileSidebar);
  }
  return (
    <main className='h-screen flex'>
        <Sidebar />
        <MobileSidebar handleCollapse={handleCollapse} mobileSidebar={mobileSidebar} />
        <div className='flex flex-col w-full lg:ml-[265px] lg:ml-0 px-5 main_body relative'>
            <Header handleCollapse={handleCollapse} mobileSidebar={mobileSidebar} />
            <MainRouter />
        </div>
    </main>
  )
}

export default Layout