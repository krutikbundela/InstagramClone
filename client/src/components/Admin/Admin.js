import React, { useState,useContext } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from "../../App"
import M from 'materialize-css'
import "./admin.css"

const Admin = () => {

    const {dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
  
    const PostData = () =>{
      fetch("/signin",{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
      }).then(res => res.json())
        .then(data=>{
          console.log(data)
          if(data.error){
            M.toast({html: data.error ,displayLength: 2000, classes: 'red'})
          }
          else{
            if(data.user.email === "admin123@gmail.com"){
              localStorage.setItem("jwt",data.token)
              localStorage.setItem("user",JSON.stringify(data.user))
              dispatch({type:"USER",payload:data.user})
              M.toast({html: "Welcome To Admin Pannel" , displayLength: 2000 , classes: 'green'})
              navigate("/dashboard")
            }
            else{
              M.toast({html: "This Is Admin Pannel!!!! Please Try To Login As User" ,displayLength: 4000, classes: 'red'})
              navigate("/signin")
            }
            
          }
        }).catch(err => {
          console.log(err);
        })
    }
  
  
  
  return (
    <>
        
        <div className='mycard'>
        <div className='card auth-card input-field'>
          <h2 className='brand-logo'>Admin Panel</h2>


          <input type="email" placeholder='Email'
            value={email} onChange={(e =>setEmail(e.target.value))}
          />
          <input type="password" placeholder='Password'
            value={password} onChange={(e =>setPassword(e.target.value))}
          />

          <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
          onClick={() => PostData()}
          >
            LogIn
          </button>

         


        </div>
      </div>  
   
   

    </>
  )
}

export default Admin