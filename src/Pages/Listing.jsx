import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase'
import { getDoc,doc } from 'firebase/firestore'
import Spinner from '../components/Spinner'
import {Swiper,SwiperSlide} from 'swiper/react'
import {FaShare, FaMapMarkerAlt, FaBath, FaBed,FaParking} from 'react-icons/fa'
import SwiperCore, {AutoPlay, Navigation, Pagination,EffectFade} from 'swiper'
import 'swiper/css';
import { getAuth } from 'firebase/auth'
import Contact from '../components/Contact'
import { Marker, MapContainer,Popup,TileLayer } from 'react-leaflet'
export default function Listing() {
    const params = useParams()
    const auth = getAuth()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sharedLinkCopied, setSharedLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);
    useEffect(() => {
        async function fetchListing(){
            const docRef = doc(db,"listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListing(docSnap.data())
                setLoading(false);
            }
        }
        fetchListing()
    }, [params.listingId]);
    if(loading){
        return <Spinner/>
    }
    return <main>
        <Swiper slidesPerView={1} navigation 
        pagination={{type:"progressbar"}} 
        effect='fade'>
            {listing.imgUrls.map((url,index)=>(
                <SwiperSlide key={index}>
                    <div className='w-full overflow-hidden h-[300px]' 
                    style={{background: `url(${listing.imgUrls}[index]) center no-repeat`, 
                    BackgroundSize:"cover"}}>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        <div className='fixed top-[13%] right-[3%] w-12 h-12
        border-2 border-gray-400 rounded-full bg-white 
        flex justify-center items-center' onClick={()=>{
            navigator.clipboard.writeText(window.location.href);
            setSharedLinkCopied(true);
            setTimeout(() => {
             setSharedLinkCopied(false);  
            }, 2000);
        }
        }>
            <FaShare className='text-lg bg-slate-400'/>
        </div>
        {sharedLinkCopied && <p className='fixed top-[23%] 
        right-[5%] border-2 border-gray-400 bg-white font-semibold
        rounded-full'>Link Copied</p>}
        <div className='flex flex-col 
        md:flex-row 
        max-w-xl 
        lg:max-auto
        rounded-lg lg:space-x-5 
        shadow-lg'>
            <div className='bg-pink-300 w-full h-[200px]'>
                <p className='text-2xl font-bold text-blue-500'>
                    {listing.name} - ${listing.offer ? listing.discountedPrice
                         : listing.regularPrice
                    }
                    {listing.type === "rent" ? " /months" : ""}
                </p>
                <p className='flex justify-center items-center'>
                    <FaMapMarkerAlt/>
                    {listing.address}
                </p>
                <div className='flex justify-start items-center'>
                    <p>
                        {listing.type === 'rent'?"Rent" : "Sale"}
                    </p>
                    <p>
                        {listing.offer && (
                            <p>
                                ${+listing.regularPrice - +listing.discountedPrice} discount
                            </p>
                        )}
                    </p>  
                </div>
                <p>
                    <span>Description </span>
                    {listing.description};
                </p>
                <ul className='flex items-center space-x-2 lg:space-x-10 text-sm'>
                    <li className='text-lg mr-1'>
                        <FaBed className='text-lg'/>
                        {listing.bedrooms > 1 ? `${listing.bedrooms}beds`:"1 bed"}
                    </li>
                    <li className='text-lg mr-1'>
                        <FaBath className='text-lg'/>
                        {listing.bathrooms > 1 ? `${listing.bathrooms}baths`:"1 bath"}
                    </li>
                    <li className='text-lg mr-1'>
                        <FaParking className='text-lg'/>
                        {listing.parking ? "Parking Spot":"No parking"}
                    </li>
                    <li className='text-lg mr-1'>
                        {listing.furnished ? "furnished":"No furnished"}
                    </li>
                </ul>
                {listing.userref !== auth.currentUser?.uid && !contactLandlord &&(
                    <div className='mt-6'>
                        <button className='
                        px-7 py-3 
                        bg-blue-700 
                        w-full 
                        round-full 
                        uppercase
                        text-sm 
                        hover:bg-blue-800 
                        focus:bg-blue-500 
                        acive:bg-blue-900' onClick={()=>setContactLandlord(true)}>
                            contact landlord
                        </button>
                    </div>
                )}
                {contactLandlord && (
                    <Contact userRef={listing.userRef} listing={listing}/>
                )}
            </div>
            <div className='bg-white w-full h-[200px] lg-[400px] overflow-x-hidden 
            z-10 mt-6 md:mt-0 md:ml-2'>
            <MapContainer center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false} 
            style={{height:"100%", width:"100%"}}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
      <Popup>
        {listing.address}
      </Popup>
    </Marker>
  </MapContainer>     
            </div>
        </div>
    </main>
}
