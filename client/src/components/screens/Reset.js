import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const Reset = () => {

  const navigate = useNavigate()
  const [email,setEmail] = useState("")

  const PostData = () =>{
    fetch("/reset-pass",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
      })
    }).then(res => res.json())
      .then(data=>{
        
        if(data.error){
          M.toast({html: data.error ,displayLength: 2000, classes: 'red'})
        }
        else{

            M.toast({html: data.message, displayLength: 2000 , classes: 'green'})
          navigate("/signin")
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
         

          <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
          onClick={() => PostData()}
          >
            Reset Password
          </button>

        </div>
      </div>
    </>
  )
}

export default Reset