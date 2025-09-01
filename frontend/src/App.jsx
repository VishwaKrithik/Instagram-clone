import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotifications } from './redux/RTNslice'
import ProtectedRoute from './components/ProtectedRoute'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: 'profile/:id',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: 'account/edit',
        element: <ProtectedRoute><EditProfile /></ProtectedRoute>
      },
      {
        path: "chat",
        element: <ProtectedRoute><ChatPage /></ProtectedRoute>
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Signup />
  }
])

function App() {

  const { user } = useSelector(store=>store.auth);
  const { socket } = useSelector(store=>store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('https://instagram-clone-w149.onrender.com', {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      })

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotifications(notification));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App;