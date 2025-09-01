import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
  const dispatch = useDispatch();

  const { selectedChatter } = useSelector(store=>store.chat);

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(`https://instagram-clone-w149.onrender.com/api/v1/message/all/${selectedChatter?._id}`, {withCredentials: true});
        if(res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllMessages();
  }, [selectedChatter])
}
 
export default useGetAllMessages;