import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import ForgotPassword from './Pages/ForgotPassword'
import Profile from './Pages/Profile'
import Offers from './Pages/Offers'
import SignIn from './Pages/SignIn'
import Signup from './Pages/Signup'
import Header from './components/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute'
import CreatingLsting from './Pages/CreatingLsting'

function App() {
  return (
    <div>
      <Router>
        <Header/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/forgotpassword' element={<ForgotPassword />}/>
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />}/>
          </Route>
          <Route path='/create-listing' element={<PrivateRoute />}>
            <Route path='/create-listing' element={<CreatingLsting/>}/>
          </Route>
          <Route path='/offers' element={<Offers />}/>
          <Route path='/signin' element={<SignIn />}/>
          <Route path='/signup' element={<Signup />}/>
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
/>
    </div>
  )
}

export default App
