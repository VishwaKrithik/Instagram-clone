import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import useGetAllMessages from '@/hooks/useGetAllMessages';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = () => {

  useGetRTM();
  useGetAllMessages();
  const { selectedChatter, messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({"behavior": "auto"});
  }, [messages]);

  return (
    <div className='overflow-y-auto flex-1 p-4'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedChatter?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedChatter?.username}</span>
          <Link to={`/profile/${selectedChatter?._id}`}><Button className="bg-gray-200 text-black h-8 my-2">View profile</Button></Link>
        </div>
      </div>
      <div className='felx flex-col gap-3'>
        {
          messages && messages.map((msg) => {
            return (
              <div className={`flex ${user?._id === msg?.senderId ? "justify-end" : "justify-start"} mt-2.5`}>
                <div className={`${user?._id === msg?.senderId ? "bg-blue-500 text-white": "bg-gray-200 text-black"} p-2 rounded-lg max-w-xs break-words`}>
                  {msg.message}
                </div>
              </div>
            )
          })
        }
        <div ref={bottomRef} ></div>
      </div>
    </div>
  )
}

export default Messages