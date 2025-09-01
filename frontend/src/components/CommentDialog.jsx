import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setPost } from '@/redux/postSlice'
import { toast } from 'sonner'
import Comment from './Comment'

const CommentDialog = ({ open, setOpen }) => {

  const [text, setText] = useState("");
  const {selectedPost, posts} = useSelector(store => store.post);
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (selectedPost) {
      setComments(selectedPost.comments);
    }
  }, [selectedPost]);

  const eventChangeHandler = (e) => {
    const inputText = e.target.value;
    if(inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`https://instagram-clone-w149.onrender.com/api/v1/post/delete/${selectedPost?._id}`, { withCredentials: true });
      if (res.data.success) {
        const updatedPosts = posts.filter((postItem) => postItem?._id != selectedPost?._id)
        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`https://instagram-clone-w149.onrender.com/api/v1/post/${selectedPost._id}/comment`, { content: text }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedPostData = posts.map((postEntry) => 
          postEntry._id === selectedPost._id ? {...postEntry, comments: updatedComments} : postEntry
        )

        // console.log(updatedPostData);

        dispatch(setPost(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="flex flex-col p-0 !max-w-5xl">
        <div className='flex flex-1'>
          <div className='w-1/2'>
            <img
              src={selectedPost.image}
              alt_img="post_image"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar className="bg-gray-200">
                    <AvatarImage src={selectedPost.author?.profilePicture} />
                    <AvatarFallback className="">CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-sm'>{selectedPost.author?.username}</Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer'/>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center">
                  <Button variant="ghost" className="text-red-500 w-fit">Unfollow</Button>
                  <Button variant="ghost" className="">Favorite</Button>
                  <Button variant="ghost" className="" onClick={deletePostHandler}>Delete</Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr className='text-gray-400' />
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              {
                comments.map((comment) => <Comment comment={comment} />)
              }
            </div>
            <div className='p-4'>
              <div className='flex gap-2 items-center'>
                <Input 
                 type="text"
                 value={text}
                 onChange={eventChangeHandler}
                 placeholder="Add a comment..."
                 className="focus-visible:ring-transparent"
                />
                <Button disabled={!text.trim()} className="border-1" onClick={sendMessageHandler}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog;