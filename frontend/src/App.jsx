import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import AllBlogs from './pages/AllBlogs'
import BlogDetail from './pages/BlogDetail'
import BlogForm from './pages/BlogForm'
import Login from './pages/LoginSignupForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import MyFavourite from './pages/MyFavourite'



function App() {


  return (
    <>

      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/all' element={<AllBlogs />} />
        <Route path='/allblogs/:category' element={<AllBlogs />} />
         <Route path='/myfavourite' element={<MyFavourite/>} />
        <Route path='/blogdetail/:id' element={<BlogDetail />} />
        <Route path='/login' element={<Login />} />
      </Routes>


      <Footer />

    </>
  )
}

export default App
