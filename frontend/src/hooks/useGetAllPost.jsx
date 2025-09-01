import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("https://instagram-clone-w149.onrender.com/api/v1/post/all", {withCredentials: true});
        if(res.data.success) {
          dispatch(setPost(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllPost();
  }, [])
}
 
export default useGetAllPost;