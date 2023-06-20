import React, { useContext, useEffect, useState } from 'react'
import {UserContext} from '../../App'
import { useParams } from 'react-router-dom'

const Userprofile = () => {

  const [userprofile,setUserprofile] = useState(null)

  const {state,dispatch} = useContext(UserContext)

  const{userid} = useParams()

  const[showfollow,setShowfollow] = useState(state ? !state.following.includes(userid) : true)

  useEffect(() =>{
    fetch(`/user/${userid}`,{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      // console.log(result)
      
      setUserprofile(result)
    })
  })


  const followuser = () =>{
    fetch("/follow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        followId:userid
      })
    }).then(res=>res.json())
    .then(data=>{

      dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
      localStorage.setItem("user",JSON.stringify(data))
      setUserprofile((prevState)=>{
        return{
          ...prevState,
          user:{
            ...prevState.user,
            folllowers:[...prevState.user.followers,data._id]
          }
        }
      })
      setShowfollow(false)
    })
  }


  const unfollowuser = () =>{
    fetch("/unfollow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        unfollowId:userid
      })
    }).then(res=>res.json())
    .then(data=>{

      dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
      localStorage.setItem("user",JSON.stringify(data))
      
      setUserprofile((prevState)=>{
        // const newFollower = prevState.user.followers.filter(item=> item !== data._id)
        return{
          ...prevState,
          user:{
            ...prevState.user,
            folllowers:[...prevState.user.followers,data._id]
          }
        }
      })
      setShowfollow(true)
    })
  }




  return (
   <>

    {userprofile ? 
    
    <div className="profile-page">
      {/* Profile Data */}
      <div className='profile'>
        {/* //left--------------------- */}
        <div>
          <img src={userprofile.user.pic} alt="" className='pro-pic'/>
        </div>
        {/* //right--------------------- */}
        <div className='pro-data'>
          <h4>{userprofile.user.name}</h4>
          <h5>{userprofile.user.email}</h5>
          <div className='follow-count'>
            <h6><span className='count-follower'>{userprofile.posts.length}</span> Posts</h6>
            <h6><span className='count-follower'>{userprofile.user.followers.length}</span> Followers</h6>
            <h6><span className='count-follower'>{userprofile.user.following.length}</span> Following</h6>
          </div>

          {showfollow ? 
            <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
            onClick={() => followuser()}
            >
              Follow
            </button>
          :
          <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
          onClick={() => unfollowuser()}
          >
            UnFollow
          </button>
          
          }

          
          
        </div>
      </div>

        {/* Profile Photos */}

      <div className='gallary'>

        {
          userprofile.posts.map(item =>{
            return(
              <img key={item._id} className='item' src={item.photo} alt={item.title} />
            )
          })
        }


        
      </div>
    </div>
    
    
    : <h1>Loading.....</h1>}


    
   </>
  )
}

export default Userprofile