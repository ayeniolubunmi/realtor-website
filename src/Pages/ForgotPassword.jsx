import React, { useState } from 'react'
import OAuth from '../components/OAuth';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email,setEmail]=useState("")
  function onChange(e){
    setEmail(e.target.value);
  }
  async function onSubmit(e){
    e.preventDefault();
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth,email);
      toast.success("Email was sent");
    } catch (error) {
      toast.error("Could not send reset password")
    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>
        <div className='w-full flex justify-center flex-wrap ml-6 mt-10'>
          <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
            <img 
            src="https://res.cloudinary.com/dqnhhf6x3/image/upload/v1683159165/regularguy-eth--o90yRQoXAM-unsplash_twflpb.jpg" 
             alt="key" className='w-full rounded-xl'/>
          </div>
          <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 justify-center items-center px-6 py-12'>
          <form>
            <input 
            type="email" 
            name="email" 
            id='email' 
            value={email}
            placeholder='Email' 
            onChange={onChange} 
            className='w-full px-4 py-2 text-xl bg-white text-gray-700 border-gray-700 rounded mt-6'/>
            <div className='flex justify-between whitespace-nowrap text-sm md-6 mt-6'>
              <p className='mb-6 font-semibold'>
                Don't have a account?
                <Link to="/signin" 
                className='text-red-600 ml-2 hover:text-red-700 transition duration-200 ease-in-out mt-6'>Register</Link>
              </p>
              <p className='mb-6 font-semibold'>
                <Link to="/forgotpassword" 
                className='text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out ml-2' >Sign In instead
                </Link>
              </p>
            </div>
            <button type="submit" onSubmit={onSubmit}
            className='w-full
             bg-blue-600 text-sm 
             uppercase rounded text-white px-7 py-3 shadow-md font-medium
             transition duration-150 ease-in-out hover:text-blue-700 hover:shadow-lg active:bg-blue-'>
            Send Reset Password
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
