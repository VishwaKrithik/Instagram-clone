import React, { useEffect, useState } from 'react'
import { setMessages, setSelectedChatter } from '@/redux/chatSlice';
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageCircleCode } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Messages from './Messages';
import { Form, Link } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {

  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers } = useSelector(store => store.auth);
  const { selectedChatter, onlineUsers, messages } = useSelector(store => store.chat);

  const dispatch = useDispatch();

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`https://instagram-clone-w149.onrender.com/api/v1/message/send/${selectedChatter?._id}`, { textMessage }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    return () => {
      if (window.location.pathname !== "/chat") {
        dispatch(setSelectedChatter(null));
      }
    }
  }, []);

  return (
    <div className='ml-[16%] h-screen flex'>
      <section className='w-full md:w-1/4 my-10'>
        <h1 className='text-xl font-semibold mb-4 px-3'>{user?.username}</h1>
        <hr className='mb-4 border-gray-300' />
        <div className='overflow-y-auto h-[80vh]'>
          {
            suggestedUsers.map((sugUser) => {

              const isOnline = onlineUsers?.includes(sugUser?._id);

              return (
                <div className='flex gap-3 p-3 items-center hover:bg-gray-50 cursor-pointer rounded-r-md' onClick={() => dispatch(setSelectedChatter(sugUser))}>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={sugUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{sugUser?.username}</span>
                    <span className={`text-xs font-bold ${isOnline ? "text-green-600" : "text-red-600"}`} >{isOnline ? "online" : "offline"}</span>
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>

      {
        selectedChatter ? (
          <section className='flex-1 border-l border-l-gray-300 h-full flex flex-col'>
            <div className='flex gap-3 border-b border-gray-300 bg-white sticky z-10 top-0 px-3 py-2 items-center'>
              <Link to={`/profile/${selectedChatter?._id}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedChatter?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <Link to={`/profile/${selectedChatter?._id}`}>
                <div className='flex flex-col'>
                  <span className='font-semibold text-[18px]'>{selectedChatter?.username}</span>
                </div>
              </Link>
            </div>
            <Messages />
            {/* <div className='flex gap-2 p-4 items-center border-t border-t-gray-300'> */}
            <form onSubmit={(e) => {
              e.preventDefault();
              sendMessageHandler();
            }} className='flex gap-2 p-4 items-center border-t border-t-gray-300'>
              <Input value={textMessage} onChange={(e) => { setTextMessage(e.target.value) }} className="focus-visible:ring-0" placeholder="Send a message..." />
              <Button className="text-white bg-black" onClick={sendMessageHandler}>Send</Button>
            </form>
          </section>
        ) : (
          <div className='flex flex-col items-center justify-center mx-auto'>
            <MessageCircleCode className='w-24 h-24' />
            <h1 className='font-medium'>Your messages</h1>
            <span>Send a message to start a chat</span>
          </div>
        )
      }

    </div>
  )
}

export default ChatPage