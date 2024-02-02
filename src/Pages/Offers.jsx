import React, { useEffect, useState } from 'react'
import { collection, where, limit, orderBy, query, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

export default function Offers() {
  const [listings, setListings] = useState(null);
  const [loading,setLoading] = useState(true);
  const [lastFetchedListings, setLastFetchedListings] = useState(null)

  useEffect(() => {
    try {
      async function fetchListings(){
        const listingRef = collection(db, "listings")
        const q = query(listingRef,where("offer", "==", true), 
        orderBy("timeStamp", "desc"), limit(4));
        const querySnap = await getDoc(q);
        const lastVisible = querySnap.docs[querySnap.docs.lenght-1];
        setLastFetchedListings(lastVisible);
        let listings = [];
        querySnap.forEach(doc => {
          return listings.push({
            id:doc.id,
            data:doc.data()
          })
        });
        setListings(listings);
        setLoading(false);
      }
      fetchListings();
    } catch (error) {
      
    } 
  }, [])
      return (
    <div className='max-w-6xl ms-auto mt-6'>
      <h1 className='text-3xl text-center font-bold'>Offers</h1>
      {loading ? (
        <Spinner/>
      ): listings && listings.lenght>0 ? (
        <>
          <main>
            <ul className='sm:grid 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4 2xl:grid-cols-5'>
              {listings.map(listing=>(
                <ListingItem key={listing.id} 
                id={listing.id} 
                listing={listing.data}/>
              ))}
            </ul>
          </main>
          {lastFetchedListings && (
            <div className='flex 
            justify-center items-center'>
              <button type="submit" className=' 
              px-3 py-1.5 
              text-sm
              bg-white
               border
              border-gray-300 
               mt-6 mb-6'>Load more</button>
            </div>
          )}
        </>
      ):(
        <p>There is no listings</p>
      )}
    </div>
  )
}
