import React, { useContext, useEffect, useState } from 'react'
import {UserContext} from '../../App'

const Profile = () => {

  const [mypics,setMypics] = useState([])

  const {state,dispatch} = useContext(UserContext)

  const [image,setImage] = useState("")
  // const [url,setUrl] = useState(undefined)  

  useEffect(() =>{
    fetch('/mypost',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      setMypics(result.mypost)
    })
  })


  useEffect(()=>{
    if(image){
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "instagram") // cloudinary ma upload nu naam
      data.append("cloud_name", "krutikbundela") //cloudname che
      fetch("http://api.cloudinary.com/v1_1/krutikbundela/image/upload", {
        method: "post",
        body: data
         })
        .then(res => res.json())
        .then(data => {
            // setUrl(data.url)
            // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
            // dispatch({type:"UPDATEPIC",payload:data.url})
            fetch("/updatepic",{
              method: "put",
              headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                pic:data.url
              })
            }).then(res=>res.json())
            .then(result=>{
              localStorage.setItem("user",JSON.stringify({...state,pic:data.pic}))
              dispatch({type:"UPDATEPIC",payload:result.pic})
            })
            // window.location.reload()

        }).catch(err => {
            console.log(err)
      })
    }
  },[image])


  const updatephoto = (file) =>{
    setImage(file)
    
  }





  return (
   <>
    <div className="profile-page">
      {/* Profile Data */}
      <div className='profile'>
        {/* //left--------------------- */}
        <div className='propic-update'>
          <img src={state? state.pic : "loading..."} alt="" className='pro-pic'/>
        
          {/* <button className='btn pro-update waves-effect waves-light #64b5f6 blue darken-1'
            onClick={() => updatephoto() }
          >
            Updatephoto
        </button> */}

            <div class="upload-btn-wrapper">
              <button class="btn2">Update Pic</button>
              <input type="file" name="myfile" onChange={(e) => updatephoto(e.target.files[0])} />
            </div>
{/* 
          <div className="file-field input-field">

            <div className="btn #64b5f6 blue darken-1">
                <span>Update Pic</span>
                <input type="file"  />
            </div>

            <div className="file-path-wrapper">
              <input type="text" className='file-path validate' />
            </div>  
          </div>  

 */}

        </div>

        {/* //right--------------------- */}
        <div className='pro-data'>
          <h4>{state?state.name:"loading"}</h4>
          <div className='follow-count'>
            <h6><span className='count-follower'>{mypics.length}</span> Posts</h6>
            <h6><span className='count-follower'>{state.followers.length}</span> Followers</h6>
            <h6><span className='count-follower'>{state.following.length}</span> Following</h6>
          </div>
        </div>
      </div>

    {/* Profile Photos */}

      <div className='gallary'>

        {
          mypics.map(item =>{
            return(
              <img className='item' src={item.photo} alt={item.title} />
            )
          })
        }


        
      </div>
    </div>
   </>
  )
}

export default Profile