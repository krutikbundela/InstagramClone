import React, { useState,useContext } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from "../../App"
import M from 'materialize-css'

const Signin = () => {

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
        if(data.error){
          M.toast({html: data.error ,displayLength: 2000, classes: 'red'})
        }
        else{
          localStorage.setItem("jwt",data.token)
          localStorage.setItem("user",JSON.stringify(data.user))
          dispatch({type:"USER",payload:data.user})
          M.toast({html: "Log In Successfully" , displayLength: 2000 , classes: 'green'})
          navigate("/profile")
        }
      }).catch(err => {
        console.log(err);
      })
  }



  return (
    <>
      <div className='mycard'>
        <div className='card auth-card input-field'>
          <h2 className='brand-logo'>Instagram</h2>


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

          <h5>
            <Link to='/signup' ><span className='have-acc'>Don't Have An Account?</span></Link>
          </h5>


        </div>
      </div>
    </>
  )
}

export default Signin