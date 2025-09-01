import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import SuggestedUsers from './SuggestedUsers';
import { Link } from 'react-router-dom';

const RightsideBar = () => {

  const { user } = useSelector(store => store.auth);

  return (
    <div className='w-fit pr-28 my-8'>
      <div className='flex gap-2 items-center'>
        <Link to={`profile/${user._id}`}>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link to={`profile/${user._id}`}><h1 className='font-semibold cursor-pointer'>{user?.username}</h1></Link>
          <span className='text-gray-600 text-sm cursor-default'>{user?.bio || "Bio here..."}</span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  )
}

export default RightsideBar