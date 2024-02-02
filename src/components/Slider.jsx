import React, { useEffect, useState,} from 'react'
import { db } from '../firebase';
import { collection, limit, orderBy, query, getDoc } from 'firebase/firestore';
import Spinner from './Spinner';
import { Swiper } from 'swiper/react';
import { SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router';
import SwiperCore,{Navigation,Pagination,EffectFade,Autoplay} from 'swiper'

export default function Slider() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    SwiperCore.use(Autoplay,Navigation,Pagination)
    useEffect(() => {
        async function fetchListing(){
            const listingRef = collection(db, "listings");
            const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
            const querySnap = await getDoc(q)
            let listings = []
            querySnap.map((doc)=>{
                return listings.push({
                    id:doc.id,
                    data:doc.data()
                })
            })
            setListings(listings);
            setLoading(false)
        }
        fetchListing()
    }, []);
    if(loading){
        return <Spinner/>
    }
    if(listings.length===0){
        return <></>
    }
  return (
    listings && (
        <>
        <Swiper slidesPerView={1} 
        navigation
        modules={{EffectFade}}
        pagination={{type:'progressbar'}}
        effect='fade'
        autoplay={{delay: 3000}} > 
        {listings.map(({data,id})=>(
            <SwiperSlide key={id} onClick={()=>navigate(`/category/${data.type}/${id}`)}>
                <div style={{background:`url(${data.imgUrls[0]}) center,no-repeat`, backgroundSize:"cover"}} 
                className='w-full h-[300px] overflow-hidden'>
                </div>
                <p className='text-[#f1faee] absolute left-1 top-3 
                shadow-lg bg-black rounded-br-3xl 
                font-medium max-w-[90%]'>{data.name}</p>
                <p className='bg-red text-[#f1faee] 
                absolute left-1
                 bottom-1 shadow-lg 
                 rounded-br-3xl 
                 max-w-[90%]'>{data.discountedPrice}-{data.regularPrice} {data.type === "rent" && " /month"}</p>
            </SwiperSlide>
        ))}
        </Swiper> 
        </>
    )
    
  )
}
