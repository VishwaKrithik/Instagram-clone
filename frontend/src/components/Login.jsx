import React, { useState } from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlics';
import { setPost } from '@/redux/postSlice';

const Login = () => {

  const [input, setInput] = useState(
    {
      username: "",
      email: "",
      password: ""
    }
  );

  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        dispatch(setPost([]));
        toast.success(res.data.message);
        navigate('/');
        setInput({
          username: "",
          email: "",
          password: ""
        })
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return (
      <Navigate to="/" replace />
    )
  } else {
    return (
      <>
        <div className='flex items-center w-screen h-screen justify-center'>
          <form className='shadow-lg flex flex-col gap-5 p-8 w-90' onSubmit={signupHandler}>
            <div className='my-4'>
              <h1 className='text-center font-bold text-xl'>INSTAGRAM</h1>
              <p className='text-center text-sm'>Signup to insta</p>
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" value={input.email} className="focus-visible:ring-transparent my-2" onChange={changeEventHandler} />
            </div>
            <div>
              <Label>password</Label>
              <Input type="password" name="password" value={input.password} className="focus-visible:ring-transparent my-2" onChange={changeEventHandler} />
            </div>
            {
              loading ? (
                <Button>
                  <Loader2 className='mr-2 h-4 animate-spin' />
                  Please wait
                </Button>
              ) : (
                // <Button type="submit" className="bg-black text-white ">Submit</Button>
                <Button type="submit" className="bg-black text-white">Submit</Button>
              )
            }
            <span className='text-center'>Do not have an account? <Link to="/register" className="text-blue-600">Signup</Link></span>
          </form>
        </div>
      </>
    )
  }
}

export default Login;