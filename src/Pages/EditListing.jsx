import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {getAuth} from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes,uploadBytesResumable } from "firebase/storage"
import {v4 as uuidv4} from 'uuid'
import { db } from '../firebase';
import {collection, serverTimestamp, getDoc, addDoc, doc, updateDoc} from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router';


export default function CreatingLsting() {
  const auth = getAuth();
  const navigate = useNavigate()
  const[loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [geolocationEnabled, setGeolocationEnable] = useState(false);
  const[formData, setFormData] = useState({
    type:"rent",
    name:"",
    bedrooms:1,
    bathrooms:1,
    address:"",
    description:"",
    offer:true,
    regularprice:0,
    discountedprice:0,
    parkingspot:false,
    furnished:false,
    latitude:0,
    longitude:0,
    images:{},
  })

  const{
    type, 
    name,
    bedrooms,
    bathrooms, 
    address, 
    description, 
    offer,
    regularprice, 
    discountedprice, 
    parkingspot, 
    furnished, latitude, longitude, images} = formData;
    const params = useParams()
    useEffect(() => {
        setLoading(false);
        async function fetchListing(){
            const docRef = doc(db, "listing", params.listingId);
            const docSnap = getDoc(docRef);
            if(docSnap.exists()){
                setListing(docSnap.data());
                setFormData({...docSnap.doc()})
                setLoading(false)
            }else{
                navigate('/')
                toast.error("Listing does not exist");
            }
        }
        fetchListing(); 
    }, [navigate, params.listingId])
    useEffect(() => {
        if(listing && listing.userRef !== auth.currentUser.id){
            toast.error("You can't edit listing");
            navigate('/');
        }
    }, [auth.currentUser.id])
    function onChange(e){
      let boolean = null;
      if(e.target.value === true){
        boolean = true;
      } 
      if(e.target.value === false){
        boolean = false;
      }
      if(e.target.files){
        setFormData((prevState)=>({
          ...prevState,
          images:e.target.files,
        }))
      }
      if(!e.target.files){
        setFormData((prevState)=>({
          ...prevState,
          [e.target.id]: boolean ?? e.target.value,
        }))
      }
    }
  async function onSubmit(e){
      e.preventDefault();
      setLoading(true);
        if(discountedprice >= regularprice){
          setLoading(false);
          toast.error("Discounted price needs to be less than the regular price");
          return;
        }
        if(images.length>6){
          setLoading(false);
          toast.error("Image must not more than 6");
          return;
        }
        let geolocation = {}
        let location;
        if(geolocationEnabled){
          const response = await fetch(`"https://maps.googleapis.com/maps/api/geocode/json?address=${address} 
          &key=${process.env.REACT_APP_GEOCODING_API_KEY}"`);
          const data = await response.json();
          console.log(data);
          geolocation.lat = data.results[0]?.geomertry.location.lat??0;
          geolocation.lng = data.results[0]?.geomertry.location.lng??0;
          location = data.status === "ZERO_RESULT" && undefined;

          if(location===undefined || location.includes("undefined")){
            setLoading(false)
            toast.error("Enter the correct information");
            return;
          }
        }else{
          geolocation.lat = latitude;
          geolocation.lng = longitude;
     }
  }
  async function storeImage(image){
    return new Promise((resolve, reject)=>{
      const storage = getStorage();
      const fileName = `{${auth.currentUser.uid}-${image.name}-${uuidv4()}}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on('state_changed', (snapShot)=>{
        const progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapShot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error)=>{
        reject(error);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          resolve(downloadURL);
        });
      }
      )
    })
  }
  const imgUrls = Promise.all(
    [...images].map((image)=>storeImage((image))
    .catch((error)=>{
      setLoading(false);
      toast.error("Image not uploaded");
      return;
    }))
  );
  const formDataCopy = {
    ...formData,
    imgUrls,
    timeStamp:serverTimestamp(),
    userRef: auth.currentUser.uid,
  }
  delete formDataCopy.images;
  !formDataCopy.offer && delete formDataCopy.discountedprice;
  delete formDataCopy.latitude;
  delete formDataCopy.longitude;
  const docRef = updateDoc(doc(db,"listings", params.listingId), formData);
setLoading(false);
toast.successful("");
navigate(`{/category/${formDataCopy.type}/${docRef}}`);
    if(loading){
      return <Spinner/>
    }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <p className='text-3xl text-center font-bold mt-6'>Create a List</p>
        <form onSubmit={onSubmit}>
            <p className='mt-6 text-lg uppercase font-semibold'>sell/rent</p>
            <div className='flex mr-3'>
              <button type="button" 
              id='type' 
              value="rent" 
              onChange={onChange} 
              className={`mr-3 px-7 
              py-3 w-full rounded 
              text-sm uppercase shadow
              border-gray-600
              border
               font-bold ${
                type==="sale" ? "bg-white text-black":"bg-slate-600 text-white"}}`}>
                  sell
              </button>
              <button type="button" 
              id='type' 
              value="sale" 
              onClick={onChange} 
              className={`px-7 
              py-3 w-full rounded 
              text-sm 
              uppercase
              showdow-sm
              border
              border-gray-600
              bg-white
               font-bold ${
                type==="rent" ? "bg-white text-black":"bg-slate-600 text-white"}}`}>
                  rent
                </button>
            </div>
            <p className='mt-6 font-semibold text-lg'>Name</p>
            <input 
            type="text" 
            name="name" 
            maxLength="32"
            minLength="10"
            value={name} 
            onClick={onChange} 
            className='w-full px-4 py-2 text-xl text-gray-600 border-gray-700 rounded'/>
            <div className='flex space-x-6'>
              <div>
                <p className='mt-6 font-semibold text-lg'>Bed</p>
                <input 
               type="number" 
               placeholder='3'
               name="bed" 
               value={bedrooms} 
               onClick={onChange} 
               min="1" 
               max="10"
               required 
               className='w-full px-4 py-2 text-xl
                text-gray-600 border
                border-gray-700 
                rounded focus:bg-white
                 focus:border-slate-600 
                 transition duration-150 ease-in-out text-center'/>
              </div>
              <div>
                <p className='mt-6 font-semibold text-lg'>Baths</p>
                <input 
                type="number" 
                name="bath" 
                value={bathrooms} 
                min="1"
                max = "10"
                onClick={onChange} 
                required
                className='w-full px-4 py-2 
                text-xl
                text-gray-600 
                border-gray-700 rounded
                focus:bg-white 
                focus:border-slate-600 
                transition duration-150 ease-in-out 
                text-center'
               />
              </div>
            </div>
            <p className='mt-6 text-lg uppercase font-semibold'>parking spot</p>
            <div className='flex mr-3'>
              <button type="button" 
              id='parkingspot' 
              value="parkingspot" 
              onClick={onChange}  
              className={`mr-3 px-7 
              py-3 w-full rounded 
              text-sm uppercase shadow
              border-gray-600
              border
               font-bold ${
                parkingspot ? "bg-white text-black":"bg-slate-600 text-white"}}`}>
                  yes
              </button>
              <button type="button" 
              id='parkingspot' 
              value="parkingspot" 
              onClick={onChange}  
              className={`px-7 
              py-3 w-full rounded 
              text-sm 
              uppercase
              showdow-sm
              border
              border-gray-600
              bg-white
               font-bold ${
                !parkingspot? "bg-slate-600 text-white":"bg-white text-black"}}`}>
                  no
                </button>
            </div>
            <p className='mt-6 text-lg uppercase font-semibold'>furnished</p>
            <div className='flex mr-3'>
              <button 
              type="button" 
              id='furnished' 
              value="furnished" 
              onClick={onChange}  
              className={`mr-3 px-7 
              py-3 w-full rounded 
              text-sm uppercase shadow
              border-gray-600
              border
               font-bold ${
                furnished ? "bg-white text-black":"bg-slate-600 text-white"}}`}>
                  yes
              </button>
              <button type="button" 
              id='furnished' 
              value="furnished" 
              onClick={onChange}  
              className={`px-7 
              py-3 w-full rounded 
              text-sm 
              uppercase
              showdow-sm
              border
              border-gray-600
              bg-white
               font-bold ${
                !furnished ? "bg-slate-600 text-white":"bg-white text-black"}}`}>
                  no
                </button>
            </div>
            <div className='mt-6'>
              <div>
                <p className='text-xl font-semibold'>Address</p>
                <textarea type="text" 
                id='address' 
                value={address} 
                onClick={onChange} 
                placeholder='Address'
                rows="2" cols="30" className='w-full 
                rounded 
                border
              border-gray-600 
              text-gray-700
              bg-white text-lg 
              px-4 
              py-2 
              focus:bg-white 
              focus:border-slate-600'></textarea>
              </div>
              {!geolocationEnabled && (
                <div className='flex space-x-6 justify-start mb-6'>
                  <div >
                    <p className='text-lg font-semibold'>Latitude</p>
                    <input type="number" id='latitude' min="-90" max="90" value={latitude} onChange={onChange} required
                    className='w-full px-4 py-
                    bg-white 
                    text-gray-700 
                    border 
                    border-gray-300 
                    focus:bg-white
                    focus:text-gray-700
                    focus:border-slate-600
                    text-xl 
                    text-center 
                    rounded' />
                  </div>
                  <div>
                  <p className='text-lg font-semibold'>Longitude</p>
                    <input type="number" id='longitude' min="-180" max="180" value={longitude} onChange={onChange} required
                    className='w-full px-4 py-
                    bg-white 
                    text-gray-700 
                    border 
                    border-gray-300 
                    focus:bg-white
                    focus:text-gray-700
                    focus:border-slate-600
                    text-xl 
                    text-center 
                    rounded' />
                  </div>
                </div>
              )}
              <div>
                <p className='text-lg font-semibold'>Description</p>
                <textarea
                type="text" 
                id='description' 
                value={description} 
                onClick={onChange}  
                placeholder='Description'
                rows="2" cols="30" className='w-full 
                rounded 
                border
                 border-gray-600
                  bg-white px-4 py-2 text-lg 
                  text-gray-700 
                  focus:bg-white 
                  focus:border-slate-600
                  transition duration-150 ease-in-out'></textarea>
              </div>
            </div>
            <p className='mt-6 text-lg uppercase font-semibold'>offers</p>
            <div className='flex mr-3'>
              <button 
              type="button" 
              id='offer' 
              value="offer" 
              onClick={onChange}  
              className={`mr-3 px-7 
              py-3 w-full rounded 
              text-sm uppercase shadow
              border-gray-600
              border
               font-bold ${
                offer?"bg-slate-600 text-white":"bg-white text-black"}}`}>
                  yes
              </button>
              <button type="button" 
              id='type' 
              value="rent" 
              onClick={onChange}  
              className={`px-7 
              py-3 w-full rounded 
              text-sm 
              uppercase
              showdow-sm
              border
              border-gray-600
              bg-white
               font-bold ${
                !offer? "bg-white text-black":"bg-slate-600 text-white"}}`}>
                  no
                </button>
            </div>
            <div className='mt-6'>
              <div className=''>
                <p className='text-lg font-semibold'>Regular Price</p>
                <div className='flex justify-center items-center mr-2'>
                  <input 
                  type="number" name="" min="50" max="40000000"
                  id='regularprice'
                  value={regularprice}
                  onClick={onChange} required 
                  className='w-full 
                  px-4 p-2 
                  text-gray-700 
                  bg-white
                  border 
                  border-gray-600 
                  rounded 
                  focus:text-gray-600 
                  focus:border-slate-600  text-center'/>
                  {type === 'rent' && (
                    <div className='w-full text-md whitespace-nowrap ml-2 font-bold'>
                      <p>$/Month</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {offer && (
              <div className='mt-6'>
              <div className=''>
                <p className='text-lg font-semibold'>Regular Price</p>
                <div className='flex justify-center items-center mr-2'>
                  <input 
                  type="number" name="" min="50" max="40000000"
                  id='discountedprice'
                  value={discountedprice}
                  onClick={onChange} 
                  required={true}
                  className='w-full 
                  px-4 p-2 
                  text-gray-700 
                  bg-white
                  border 
                  border-gray-600 
                  rounded 
                  focus:text-gray-600 
                  focus:border-slate-600  text-center'/>
                  {type === 'rent' && (
                    <div className='w-full text-md whitespace-nowrap ml-2 font-bold'>
                      <p>$/Month</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}
            <div className="">
              <p className='text-lg font-semibold capitalize mt-6'>
                images
              </p>
              <p className='text-gray-700'>The first image will be the cover (max 6)</p>
              <input 
              type="file" 
              id='image'
              onClick={onChange} multiple accept='.jpg,jpeg,png'
              className='w-full px-3 py-1.5 
              border
               border-gray-700 
               text-gray-300
                focus:bg-white focus:border-slate-600 rounded' />
            </div>
            <button type="submit" 
            className='w-full my-6 px-4 py-2 bg-blue-700 
            font-medium text-sm
             text-white shadow-lg 
            focus:bg-blue-700 
            focus:shadow-lg 
            uppercase 
            rounded 
            hover:bg-blue-700
            hover:shadow-lg
            active:bg-blue-700
            active:shadow-lg
            transition duration-150 ease-in-out'>create listing</button>
        </form>
    </main>
  );  
}