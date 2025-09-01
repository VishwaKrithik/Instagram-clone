import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';

const SuggestedUsers = () => {

  const { suggestedUsers } = useSelector(store => store.auth);

  return (
    <div className='my-8'>
      <div className='flex items-center justify-between gap-3 text-sm'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See All</span>
      </div>
      {
        suggestedUsers.map((user) => {
          return (
            <div key={user._id} className='flex items-center justify-between my-5'>
              <div className='flex gap-2 items-center'>
                <Link to={`/profile/${user._id}`}>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to={`/profile/${user._id}`}><h1 className='font-semibold cursor-pointer'>{user?.username}</h1></Link>
                  <span className='text-gray-600 text-sm cursor-default'>{user?.bio || "bio here..."}</span>
                </div>
              </div>
              <span className='text-[#3BADF8] hover:text-[#2b7eb4] cursor-pointer text-sm font-semibold'>Follow</span>
            </div>
          )
        })
      }
    </div>
  )
}

export default SuggestedUsers