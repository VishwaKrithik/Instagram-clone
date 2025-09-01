import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlics'
import CreatePost from './CreatePost'
import { setPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftsideBar = () => {

  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const { likeNotifications } = useSelector(store => store.realTimeNotification);
  // const likeNotifications = ["vishwa krithik", "otha otha otha otha", "otha otha otha otha", "otha otha otha otha"];
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6 text-xs">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" },
  ]

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout");
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPost([]));
        // dispatch(setSelectedPost(null));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const createPostHandler = () => {
    setOpen(true);
  }

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') {
      logoutHandler();
    } else if (textType === "Create") {
      createPostHandler();
    } else if (textType === "Profile") {
      navigate(`/profile/${user._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  }

  return (
    <div className='fixed top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen'>
      <div className='flex flex-col'>
        <h1 className='my-5 pl-3 text-xl font-bold'>INSTAGRAM</h1>
        <div>
          {
            sidebarItems.map((item, index) => {
              if (item.text === "Notifications") {
                return (
                  <>
                    <Popover key={index}>
                      <PopoverTrigger asChild>
                        <div className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                          {item.icon}
                          <span>{item.text}</span>
                          {
                            likeNotifications.length > 0 && (
                              <span className='flex items-center justify-center rounded-full absolute bottom-6 left-6 bg-red-600 text-white text-xs size-5'>{likeNotifications.length}</span>
                            )
                          }
                        </div>
                      </PopoverTrigger>
                      <PopoverContent>
                        {
                          likeNotifications.length === 0 ? (
                            <p>NO NEW NOTIFICATIONS</p>
                          ) : (
                            likeNotifications.map((notification) => {
                              return (
                                <div key={notification?.user} className='flex gap-2 items-center my-2' >
                                  <Avatar>
                                    <AvatarImage src={notification?.userDetails?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className='text-sm'><span className='font-bold'>{notification?.userDetails?.username}</span> liked your post</p>
                                </div>
                              )
                            })
                          )
                        }
                      </PopoverContent>
                    </Popover>
                  </>
                )
              }
              return (
                <div onClick={() => sidebarHandler(item.text)} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3' key={index}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              )
            })
          }
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  )
}

export default LeftsideBar