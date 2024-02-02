import { getAuth, updateProfile} from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { updateDoc, doc, query, orderBy, where, collection, getDoc} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {FcHome} from 'react-icons/fc';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate()
  const [changeDetail, setChanegDetail] = useState(false);
  const[listings, setListings] = useState(null);
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name:auth.currentUser.name,
    email:auth.currentUser.email,
  })
  const {name,email} = formData
  function onLogOut(){
    auth.signOut();
    navigate('/')
  }
  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value,
    }))
  }
 async function onSubmit(){
    try {
      if(auth.currentUser.displayName !== name){
        await updateProfile(auth.currentUser, {
          displayName: name
        })
      }
      const docRef = doc(db,"users", auth.currentUser.uid)
      await updateDoc(docRef, {
        name,
      })
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile");
    }
  }
  useEffect(() => {
    async function fetchUseRListing(){
      const listingRef = collection(db, "listing")
      const q = query(listingRef, where("userRef","==",auth.currentUser.uid), 
      orderBy("timeStamp","desc"));
      const querySnap = await getDoc(q);
      let listing = []
      querySnap.forEach(doc => {
        return listing.push({
          id: doc.id,
          data: doc.data,
        })
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUseRListing()
  }, [auth.currentUser.uid]);
  return (
    <div>
      <section className='flex justify-center items-center flex-col max-w-6xl mx-auto'>
        <h1 className='text-3xl text-center font-bold mt-6'> My profile</h1>
        <div className='mt-6 md:w-[40%] px-3'>
          <form>
            <input 
            className='w-full px-4 py-2 text-xl bg-white text-gray-400 border-gray-700 rounded' 
            type="text" 
            id='name' 
            name="name" 
            value={name} 
            placeHolder='name'
            onChange={onChange}/>
            <input 
            className='w-full mt-6 px-4 py-2 text-xl bg-white text-gray-400 border-gray-700 rounded' 
            type="email" 
            id='email' 
            name="email" 
            disabled = {!changeDetail}
            onChange={onChange}
            value={email} />
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
              <p onClick={()=>{
                changeDetail && onSubmit();
                setChanegDetail((prevState)=>!prevState)}} className='flex items-center text-sm mt-6'>Do you want to change your name?          
            <span 
              className='text-red-600
               hover:text-red-700 ml-3 
              transition duration-200 ease-in-out 
              font-semibold cursor-pointer'>{changeDetail?"Apply change":"Edit"}</span>
              </p>
              <p onClick={onLogOut} className='text-blue-600
               hover:text-blue-800 ml-3 mt-6
              transition duration-200 ease-in-out 
              font-semibold cursor-pointer capitalize text-sm'>
                sign out
              </p>
            </div>
          </form>
          <button type="submit" 
          className='w-full
           bg-blue-600 
           px-7 py-3 text-sm shadow rounded text-white uppercase text-lg transition duration-200 active:bg-blue-800'>
            <Link to="/create-listing" className='flex justify-center items-center active:bg-blue-800 '>
              <FcHome className='mr-4 rounded-full bg-red-400 p-1 text-3xl'/>
              Rent or sell home
            </Link>
          </button>
        </div>
      </section>
      <div className='max-w-6xl max-auto px-3 mt-6'>
        {!loading && listings!=null && listings.length>0 &&(
          <>
            <h1 className='text-2xl text-center font-semibold'>My Listing</h1>
            <ul>
              {listings.map((listing)=>(
                <listingItem 
                key={listing.id} 
                id={listing.id} 
                listing={listing.data}/>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
