import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
export const AppContext = createContext()
const AppContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const location = useLocation()

  const logInuser = async (email, password,resetCallback) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        console.log('Login Successfully', data.token);
        toast.success('Login Successfully')
        resetCallback()
        if(location.key==='default'){
          navigate('/')
        }
        else{
          navigate(-1)
        }
        
      }
      else {
        console.log(data.message);
        toast.error(data.message)
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error)
    }

  }

  const registerUser = async (formData)=>{
    try {
      const {data} =await axios.post(backendUrl+'/api/user/createuser',formData)
      if(data.success){
          console.log(data.message);
          toast.success(data.message)      
        // localStorage.setItem('token', data.token)
        //   setToken(data.token)
      }
      else{
          console.log(data.message);  
          toast.error(data.message) 
      }
  } 
  catch (error) {
     console.log(error);
      toast.error(error)
  }
  console.log('Signup data:', formData);
  }

  const changePassword = async (formData,resetCallback)=>{
    const {data} = await axios.post(backendUrl+'/api/user/changepassword',{password:formData.password,email:formData.email,confirmationCode:formData.confirmationCode})
    if(data.success){
      console.log(data.message);
      resetCallback()
      toast.success(data.message)
      
    }
    else{
      console.log(data.message);
      toast.error(data.message)
    }
  }

  const sendConfirmationCode =async (email) => {
    const {data}=await  axios.post(backendUrl+'/api/user/sendconfirmationcode',{email})
    if(data.success){
        console.log('Confirmation code send successfully',data.message); 
        toast.success(data.message)
    }
    else{
        console.log(data.message);
        toast.error(data.message)
    }
};


  const value = { backendUrl, setToken, token, logInuser,registerUser,sendConfirmationCode,changePassword};

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
export default AppContextProvider