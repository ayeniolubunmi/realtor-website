import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment';
import {MdLocationOn} from 'react-icons/md'
import {FaTrash} from 'react-icons/fa';
import {MdEdit} from 'react-icons/md'

export default function ListingItem({listing, id, onDelete, onEdit}) {
  return(
    <li>
        <Link to={`/category/${listing.type}/${id}`}>
            <img src={listing.imgUrls[0]} alt=""/>
            <Moment fromNow> {listing.timeStamp?.toDate()}</Moment>
            <div>
                <div>
                    <MdLocationOn/>
                    <p>{listing.address}</p>
                </div>
                <p>{listing.name}</p>
                <p>${listing.offer ? listing.discountedPrice
                    .toString().replace(/\B(?=(\d{3})+(?!\d))/g,",") : listing.regularPrice}
                    {listing.type === "rent" && "/month"}
                    </p>
                    <div>
                        <div>
                            <p>{listing.bedrooms > 1? `${listing.bedrooms} Beds`:"1 Bed"}</p>
                        </div>
                        <div>
                            <p>{listing.bathrooms > 1? `${listing.bathrooms} Baths`:"1 Bath"}</p>
                        </div>
                    </div>
            </div>
        </Link>
        {onDelete && (
            <FaTrash className='absolute 
            bottom-2 
            right-2 
            h-[14px] text-red-500 cursor-pointer' 
            onClick={()=>onDelete(listing.id)} />
        )}
        {onEdit && (
            <MdEdit className='absolute
            bottom-2 
            right-7 
            h-[14px] text-red-500 cursor-pointer' 
            onClick={()=>onEdit(listing.id)}/>
        )}
    </li>
  )
}
