import useGetUserProfile from '@/hooks/useGetUserProfile';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle, SoapDispenserDroplet } from 'lucide-react';
import { FaHeart } from 'react-icons/fa';
import { setSelectedChatter } from '@/redux/chatSlice';
import CommentDialog from './CommentDialog';
import { setSelectedPost } from '@/redux/postSlice';

const Profile = () => {

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = params.id;
  const [open, setOpen] = useState(false);
  useGetUserProfile(userId);

  const { selectedUser, user } = useSelector(store => store.auth);
  const { selectedPost } = useSelector(store => store.post);
  const [activeTab, setActiveTab] = useState('posts');

  const isLoggedInUser = selectedUser?._id === user?._id;
  const isFollowing = true;


  const displayedPost = activeTab === "posts" ? selectedUser?.posts : (activeTab === "saved" ? selectedUser?.bookmarks : []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const handleGoToMessages = () => {
    dispatch(setSelectedChatter(selectedUser));
    navigate('/chat');
  }

  return (
    <div className='flex mx-auto justify-center max-w-4xl pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className="w-32 h-32">
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span className='font-semibold'>{selectedUser?.username}</span>
                {
                  isLoggedInUser ? (
                    <>
                      <Link to="/account/edit"><Button className="bg-gray-200 h-7 font-semibold hover:bg-gray-300">Edit profile</Button></Link>
                      <Button className="bg-gray-200 h-7 font-semibold hover:bg-gray-300">View archives</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button className="bg-gray-200 h-7 font-semibold hover:bg-gray-300">Unfollow</Button>
                        <Button className="bg-gray-200 h-7 font-semibold hover:bg-gray-300" onClick={handleGoToMessages}>Message</Button>
                      </>
                    ) : (
                      <>
                        <Button className="bg-[#0095f6] hover:bg-[#0279c8] text-white">Follow</Button>
                      </>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{selectedUser?.posts?.length}</span> posts</p>
                <p><span className='font-semibold'>{selectedUser?.followers?.length}</span> followers</p>
                <p><span className='font-semibold'>{selectedUser?.following?.length}</span> following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{selectedUser?.bio || 'bio here...'}</span>
                <Badge className="bg-gray-200 rounded-2xl w-fit"><AtSign /><span className=''>{selectedUser?.username}</span></Badge>
                <span>🤯Sauce and ketchup are not the same</span>
                <span>🤯Sauce and ketchup are not the same</span>
                <span>🤯Sauce and ketchup are not the same</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-300'>
          <div className='flex gap-10 items-center justify-center text-sm'>
            <span className={`cursor-pointer py-3 ${activeTab === "posts" ? "font-bold" : ""}`} onClick={() => handleTabChange("posts")}>
              POSTS
            </span>
            <span className={`cursor-pointer py-3 ${activeTab === "saved" ? "font-bold" : ""}`} onClick={() => handleTabChange("saved")}>
              SAVED
            </span>
            <span className={`cursor-pointer py-3 ${activeTab === "reels" ? "font-bold" : ""}`} onClick={() => handleTabChange("reels")}>
              REELS
            </span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer' onClick={() => { setOpen(true); dispatch(setSelectedPost(post)); }} >
                    <img src={post.image} className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-90 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <Button className='flex items-center gap-2 hover:text-gray-300'>
                          <FaHeart className='fill-white' />
                          <span>{post?.likes?.length}</span>
                        </Button>
                        <Button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle className='fill-white' />
                          <span>{post?.comments?.length}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      {selectedPost && <CommentDialog open={open} setOpen={setOpen} />}
    </div>
  )
}

export default Profile