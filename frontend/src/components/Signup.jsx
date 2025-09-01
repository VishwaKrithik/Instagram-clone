import React, { useEffect, useState } from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Signup = () => {

  const [input, setInput] = useState(
    {
      username: "",
      email: "",
      password: ""
    }
  );

  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store=>store.auth);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({...input, [e.target.name]: e.target.value});
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
        headers: {
          'Content-Type': 'application/json'
        }, 
        withCredentials: true
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
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

  useEffect(() => {
    if(user) {
      navigate("/");
    }
  })

  return (
    <>
      <div className='flex items-center w-screen h-screen justify-center'>
        <form className='shadow-lg flex flex-col gap-5 p-8 w-90' onSubmit={signupHandler}>
          <div className='my-4'>
            <h1 className='text-center font-bold text-xl'>INSTAGRAM</h1>
            <p className='text-center text-sm'>Signup to insta</p>
          </div>
          <div>
            <Label>Username</Label>
            <Input type="text" name="username" value={input.username} className="focus-visible:ring-transparent my-2" onChange={changeEventHandler} />
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
                <Loader2 />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="bg-black text-white cursor-pointer">Submit</Button>
            )
          }
          <span className='text-center'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
        </form>
      </div>
    </>
  )
}

export default Signup;