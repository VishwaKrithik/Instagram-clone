import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPost, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'

const Post = ({ post }) => {

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts, selectedPost } = useSelector(store => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getAllComments = posts.find((postEntry => postEntry._id === post._id));
    setComments(getAllComments.comments);
  }, [posts]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`https://instagram-clone-w149.onrender.com/api/v1/post/delete/${post?._id}`, { withCredentials: true });
      if (res.data.success) {
        const updatedPosts = posts.filter((postItem) => postItem?._id != post?._id)
        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const likeOrDislikePostHandler = async () => {
    try {
      const res = await axios.get(`https://instagram-clone-w149.onrender.com/api/v1/post/${post._id}/toggleLike`, { withCredentials: true });
      if (res.data.message == "Post liked") {
        setLiked(true);
        const updatedPosts = posts.map((postEntry) =>
          postEntry._id === post._id ? {
            ...postEntry,
            likes: [...postEntry.likes, user._id]
          } : postEntry
        );
        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
      } else {
        setLiked(false);
        const updatedPosts = posts.map((postEntry) =>
          postEntry._id === post._id ? {
            ...postEntry,
            likes: postEntry.likes.filter(id => id !== user._id)
          } : postEntry
        );
        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addCommentHandler = async () => {
    try {
      const res = await axios.post(`https://instagram-clone-w149.onrender.com/api/v1/post/${post._id}/comment`, { content: text }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedPostData = posts.map((postEntry) =>
          postEntry._id === post._id ? { ...postEntry, comments: updatedComments } : postEntry
        )

        dispatch(setPost(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`https://instagram-clone-w149.onrender.com/api/v1/post/${post._id}/bookmark`, { withCredentials: true });
      console.log(res);
      if(res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link to={`/profile/${post?.author?._id}`}>
            <Avatar className="text-black bg-gray-200">
              <AvatarImage src={post.author?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className='flex items-center gap-4'>
            <Link to={`/profile/${post?.author?._id}`}><h1>{post.author?.username}</h1></Link>
            {post?.author?._id === user?._id && <Badge className="bg-gray-200 rounded-2xl">Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center">
            {
              post?.author?._id !== user?._id && <Button variant="ghost" className="text-red-500 w-fit">Unfollow</Button>
            }
            <Button variant="ghost">Favorite</Button>
            {
              user && (user._id === post.author._id) && <Button onClick={deletePostHandler} variant="ghost">Delete</Button>
            }
          </DialogContent>
        </Dialog>
      </div>
      <img src={post.image}
        alt_img="post_image"
        className='rounded-sm my-2 aspect-square object-cover w-full'
      />
      <div>
        <div className='flex items-center justify-between my-2'>
          <div className='flex items-center gap-3'>
            {liked ? <FaHeart onClick={likeOrDislikePostHandler} className='w-6 h-6 fill-red-500 transition-colors duration-500 cursor-pointer' /> : <FaRegHeart onClick={likeOrDislikePostHandler} className='w-6 h-6 cursor-pointer' />}
            <MessageCircle onClick={() => { setOpen(true); dispatch(setSelectedPost(post)) }} className='cursor-pointer hover:text-gray-600' />
            <Send className='cursor-pointer hover:text-gray-600' />
          </div>
          <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
        </div>
        <span className='font-medium block mb-2'>{post.likes.length} likes</span>
        <p>
          {post.caption && <><span className='font-medium mr-2'>{post.author?.username}</span>{post.caption}</>}
        </p>
        {
          comments.length > 0 && <span onClick={() => { setOpen(true); dispatch(setSelectedPost(post)) }} className='cursor-pointer text-sm text-gray-500'>View all {comments.length} comments</span>
        }
        { selectedPost && <CommentDialog open={open} setOpen={setOpen} /> }
        <div className='flex'>
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            className='outline-none text-sm w-full'
          />
          {
            text && <span onClick={addCommentHandler} className='text-blue-600 cursor-pointer'>Post</span>
          }
        </div>
      </div>
    </div>
  )
}

export default Post