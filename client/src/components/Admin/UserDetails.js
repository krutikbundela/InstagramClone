import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'
import {Link} from "react-router-dom"


const UserDetails = () => {

  const [userdata,setUserdata] = useState([])
 const {state} =useContext(UserContext)
  
  useEffect(() =>{
    fetch("/userlist",{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result =>{
    //   console.log(result)
      setUserdata(result.user)
    })
  },[])

  const deleteuser = (userid) =>{
    fetch(`/deleteuser/${userid}`,{
        method:"delete",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
    }).then(res=>res.json())
    .then(result=>{
      const newData = userdata.filter(item=>{
        return item._id !== result._id
      })
      
      M.toast({html:"User Deleted Successfully" ,displayLength: 7000, classes: 'red'})
      setUserdata(newData)
    })
  }

  return (
    <>
      <div className="home">
        
         {
            userdata.map(item=>{
                return(
                    <div className="card home-card" key={item._id} >
                        <h5 className='user-poster-name'>
                            <img src={item.pic} className="user-post-dp" alt="" />
                            
                            <span className='username'>{item.name}</span>

                            <h6 style={{fontWeight:"bolder"}} className="email">{item.email}</h6>
                        </h5>
                            
                            <hr/>

                        <div className="card-content delete-user">
                            
                        <span className='userid'>User ID:  {item._id}</span>

                            <button className='btn delete-user-btn logout-btn waves-effect waves-light #64b5f6 red darken-1'
                                onClick={() =>{deleteuser(item._id)}}
                            >
                            Delete User
                            </button>

                        </div>
                    </div>       
                )
            })
         }
           
              

                
             
            

      </div>
    </>
  )
}

export default UserDetails