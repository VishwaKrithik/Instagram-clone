import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPost } from '@/redux/postSlice'

const CreatePost = ({ open, setOpen }) => {

  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post("https://instagram-clone-w149.onrender.com/api/v1/post/addPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      if (res.data.success) {
        // console.log(res.data);
        dispatch(setPost([res.data.post, ...posts]))
        toast.success(res.data.message);
        setOpen(false);
        setFile("");
        setImagePreview("");
        setCaption("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  const interactOutsideHandler = () => {
    setOpen(false);
    setFile("");
    setImagePreview(false);
    setCaption("");
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={interactOutsideHandler}>
        <DialogHeader className="font-semibold mx-auto">Create new post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user.profilePicture} alt="alt_img"></AvatarImage>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2>{user.username}</h2>
            <p>{user.bio}</p>
          </div>
        </div>
        <Textarea onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-0 border-none" placeholder="Write a caption" />
        {
          imagePreview && (
            <div className='w-full h-64 flex justify-center items-center'>
              <img src={imagePreview} alt="uploaded_img" className='object-contain h-full w-full' />
            </div>
          )
        }
        <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />
        <Button onClick={() => { imageRef.current.click() }} className="mx-auto rouned-md bg-[#0095F6] text-white hover:bg-[#016bb2] transition-colors duration-250">Select from computer</Button>
        {
          imagePreview && (
            loading ? (
              <Button>
                <Loader2 className='animate-spin' />
              </Button>
            ) : (
              <Button onClick={createPostHandler} type="submit" className="w-full bg-black text-white cursor-pointer">Post</Button>
            )
          )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost