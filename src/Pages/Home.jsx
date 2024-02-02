import React, { useEffect, useState } from 'react';
import Slider from '../components/Slider';
import { db } from '../firebase';
import { collection, getDoc, orderBy, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Home = () => {
  const [offerListings, setOffereListings] = useState(null)
  useEffect(() => {
    async function fetchListing(){
      try {
        const listingRef = collection(db, "listings");
        const q  = query(listingRef,where("offer","==", true), orderBy("timestamp","desc"));
        const querySnap = await getDoc(q);
        const listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data:doc.data
          });
        })
        setOffereListings(listings);
      } catch (error) {
      }
    }
    fetchListing();
  }, [])

  const [rentListings, setRentListings] = useState(null)
  useEffect(() => {
    async function fetchListing(){
      try {
        const listingRef = collection(db, "listings");
        const q  = query(listingRef,where("type","==",'rent'),orderBy("timestamp","desc"));
        const querySnap = await getDoc(q);
        console.log(querySnap)
        const listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data:doc.data
          });
        })
        setRentListings(listings);
      } catch (error) { 
      }
    }
    fetchListing();
  }, [])
  const [saleListings, setSaleListings] = useState(null)
  useEffect(() => {
    async function fetchListing(){
      try {
        const listingRef = collection(db, "listings");
        const q  = query(listingRef,where("type","==", 'sale'), orderBy("timestamp","desc"));
        const querySnap = await getDoc(q);
        const listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data:doc.data
          });
        })
        setSaleListings(listings);
      } catch (error) { 
      }
    }
    fetchListing();
  }, [])
  return (
    <div>
      <Slider />
      <div className='max-w-6xl mx-auto pt-4 space-y-6'>
        {offerListings && offerListings.lenght > 0 &&(
          <div className='m-3 mt-3'>
            <h2 className='p-3 text-2xl mt-3'>Recent offers</h2>
            <Link to='/offers'>
              <div>Show more offers</div>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {offerListings.map((listing)=>(
                <ListingItem 
                key={listing.id}
                 id={listing.id} 
                listing={listing.data} />
              ))}
            </ul>
          </div>
        )}
        {rentListings && rentListings.lenght > 0 &&(
          <div className='m-3 mt-3'>
            <h2 className='p-3 text-2xl mt-3'>Places for rent</h2>
            <Link to='/offers'>
              <div>Show some places for rent</div>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {rentListings.map((listing)=>(
                <ListingItem 
                key={listing.id}
                 id={listing.id} 
                listing={listing.data} />
              ))}
            </ul>
          </div>
        )}
         {saleListings && saleListings.lenght > 0 &&(
          <div className='m-3 mt-3'>
            <h2 className='p-3 text-2xl mt-3'>Places for sale</h2>
            <Link to='/offers'>
              <div>Show some places to sale </div>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {rentListings.map((listing)=>(
                <ListingItem 
                key={listing.id}
                 id={listing.id} 
                listing={listing.data} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
export default Home;
