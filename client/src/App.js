import React, {createContext,useReducer,useEffect,useContext} from 'react'
import Navbar from './components/Navbar'
import "./App.css"
import {BrowserRouter,Route , Routes,useNavigate} from "react-router-dom"
import Home from "./components/screens/Home"
import Signin from "./components/screens/Signin"
import Profile from "./components/screens/Profile"
import Signup from "./components/screens/Signup"
import Createpost from './components/screens/Createpost'
import Userprofile from './components/screens/Userprofile'
import Followingpost from './components/screens/Followingpost'
import Admin from './components/Admin/Admin'
import Reset from './components/screens/Reset'
import Dashboard from './components/Admin/Dashboard'
import Adminprofile from './components/Admin/Adminprofile'
import UserDetails from './components/Admin/UserDetails'
import { reducer,initialState } from './reducers/userReducer'


export const UserContext = createContext() 

const Routing = () =>{

  const navigate = useNavigate()
  const {dispatch} = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    
    if(user){
      dispatch({type:"USER",payload:user})
      // navigate("/")
    }else{
      if(!window.location.pathname.startsWith("/reset-pass"))
      navigate("/signin")
    }
  },[]) 

  return (
    <>
    <Routes>
          <Route  path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/reset-pass" element={<Reset />} />
          <Route path="/signup" element={<Signup />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/createpost" element={<Createpost />} />
          <Route path="/profile/:userid" element={<Userprofile />} />
          <Route path="/followingpost" element={<Followingpost />} />
          {/* Admin Pages */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adminview/:userid" element={<Adminprofile />} />
          <Route path="/userdetails" element={<UserDetails />} />

         
    </Routes>
    </>
  )
}

const App = () => {

const [state,dispatch] = useReducer(reducer,initialState)

  return (
      <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar />
        <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App