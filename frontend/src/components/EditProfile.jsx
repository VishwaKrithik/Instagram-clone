import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlics';

const EditProfile = () => {

  const imageRef = useRef();
  const { user } = useSelector(store => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender
  })

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePicture: file })
    };
  }

  const genderHandler = (value) => {
    setInput({ ...input, gender: value })
  }

  const backHandler = () => {
    navigate(`/profile/${user?._id}`);
  }

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    if (input.gender) {
      formData.append("gender", input.gender);
    }
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }
    try {
      setLoading(true);
      const res = await axios.post("https://instagram-clone-w149.onrender.com/api/v1/user/profile/edit", formData, {
        headers: {
          "Content-Type": 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        setLoading(false);
        const updatedUserData = {
          ...user,
          bio: res?.data?.user?.bio,
          gender: res?.data?.user?.gender,
          profilePicture: res?.data?.user?.profilePicture
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`)
        toast.success(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <div className='flex mx-auto max-w-2xl pl-10'>
      <section className='flex flex-col gap-6 w-full my-8'>
        <h1 className='font-bold text-xl'>EDIT PROFILE</h1>
        <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-semibold text-[15px]'>{user?.username}</h1>
              <span className='text-gray-600'>{user?.bio || "Bio here..."}</span>
            </div>
          </div>
          <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
          <Button onClick={() => { imageRef.current.click() }} className="bg-[#0095F6] h-8 hover:bg-[#2877ac] text-white">Change photo</Button>
        </div>
        <div>
          <h1 className='font-semibold text-xl mb-2'>Bio</h1>
          <Textarea value={input?.bio} onChange={(e) => { setInput({ ...input, bio: e.target.value }) }} name="bio" className="focus-visible:ring-transparent"></Textarea>
        </div>
        <div>
          <h1 className='font-semibold mb-2 text-xl'>Gender</h1>
          <Select defaultValue={input?.gender} onValueChange={genderHandler}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">male</SelectItem>
                <SelectItem value="female">female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex justify-center gap-20'>
          {
            !loading ? (<Button className="w-fit bg-gray-500 text-white hover:bg-gray-700" onClick={backHandler}>Back</Button>) : (<></>)
          }
          {
            loading ? (
              <Button className="w-fit bg-gray-100">
                <Loader2 className='animate-spin mr-2 h-4 w-4' />
                Please wait
              </Button>
            ) : (
              <Button onClick={editProfileHandler} className="w-fit bg-[#0095F6] hover:bg-[#2a8CCD] text-white" >Submit</Button>
            )
          }
        </div>
      </section>
    </div>
  )
}

export default EditProfile