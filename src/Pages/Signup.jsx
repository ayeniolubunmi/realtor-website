import React, { useState } from 'react'
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai';
import OAuth from '../components/OAuth';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { serverTimestamp, setDoc,doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email:"",
    password:""
  })
  const {name,email,password} = formData;
  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value,
    }))
  }
  async function onSubmit(e){
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      updateProfile(auth.currentUser, {
        displayName: name,
      })
      const user = userCredential.user;
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formData);
      toast.success("Sign up was successfull");
      navigate('/');
    } catch (error) {
      toast.error("Ops! something went wrong with the registration");
    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
        <div className='w-full flex justify-center items-center flex-wrap ml-6 mt-10'>
          <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
            <img 
            src="https://res.cloudinary.com/dqnhhf6x3/image/upload/v1683159165/regularguy-eth--o90yRQoXAM-unsplash_twflpb.jpg" 
             alt="key" className='w-full rounded-xl'/>
          </div>
          <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 justify-center items-center px-6 py-12'>
          <form onSubmit={onSubmit}>
            <input 
              type="text" 
              name="name" 
              id='name' 
              value={name}
              placeholder='Full Name' 
              onChange={onChange} 
              className='w-full px-4 py-2 text-xl bg-white text-gray-700 border-gray-700 rounded mt-6'/>

            <input 
              type="email" 
              name="email" 
              id='email' 
              value={email}
              placeholder='Email' 
              onChange={onChange} 
              className='w-full px-4 py-2 text-xl bg-white text-gray-700 border-gray-700 rounded mt-6'/>
            <div className='relative'>
              <input 
              type={showPassword ? "text":"password"}
              name="password" 
              id='password' 
              value={password}
              placeholder='Password' 
              onChange={onChange}
              className='w-full px-4 py-2 text-xl bg-white
               text-gray-700 border-gray-700 rounded mt-6 transition ease-in-out'/>
               {showPassword?(<AiFillEyeInvisible className='absolute right-3 top-10 text-xl cursor-pointer' onClick={()=>setShowPassword((prevState)=>!prevState)}/>):
               (<AiFillEye className='absolute right-3 top-10 text-xl cursor-pointer' onClick={()=>setShowPassword((prevState)=>!prevState)}/>)}
            </div>
            <div className='flex justify-between whitespace-nowrap text-sm md-6'>
              <p className='mb-6'>
                Have an account?
                <Link to="/signup" 
                className='text-red-600 mr-2 hover:text-red-700 transition duration-200 ease-in-out mt-6 ml-2'>Sign in</Link>
              </p>
              <p>
                <Link to="/forgotpassword" className='text-blue-600 ml-2' >Forgot password?</Link>
              </p>
            </div>
            <button type="submit" 
            className='w-full
             bg-blue-600 text-sm 
             uppercase rounded text-white px-7 py-3 shadow-md font-medium
             transition duration-150 ease-in-out hover:text-blue-700 hover:shadow-lg active:bg-blue-'>
            Sign up
          </button>
          <div className=' flex item-center my-4 
            before:flex-1 before:border-t
           before:border-gray-300 
           after:flex-1 
           after:border-gray-300 after:border-t'>
            <p className='text-center font-semibold mx-4'>
              OR
            </p>
          </div>
          <OAuth/>
        </form>
        </div>
      </div>
    </section>
  )
}
