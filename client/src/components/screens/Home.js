import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'
import {Link} from "react-router-dom"


const Home = () => {

  const [data,setData] = useState([])
 const {state} =useContext(UserContext)
  
  useEffect(() =>{
    fetch("/allpost",{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result =>{
      // console.log(result)
      setData(result.posts)
    })
  },[])

  const likepost = (id) =>{
    fetch("/like",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    window.location.reload()
    .then(result=>{
      const newData = data.map(item=>{
        if(item._id===result._id){
          return result
        }else{
          return item
        }

      })
    
      setData(newData)
      
    
    }).catch(err=>{
      console.log(err);
    })
  }

  const unlikepost = (id) =>{
    fetch("/unlike",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.map(item=>{
        if(item._id===result._id){
          return result
        }else{
          return item
        }
        

      })

      setData(newData)
      window.location.reload()

    }).catch(err=>{
      console.log(err);
    })
  }


  const makeComment = (text,postId)=>{
    fetch("/comment",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId,
        text
      })
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.map(item=>{
        if(item._id===result._id){
          return result
        }else{
        
          return item
        }

      })
      setData(newData)
      window.location.reload()
    }).catch(err=>{
      console.log(err);
    })
  } 

  const deletepost = (postid) =>{
    fetch(`/deletepost/${postid}`,{
      method:"delete",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.filter(item=>{
        return item._id !== result._id
      })
      M.toast({html:"Post Deleted Successfully" ,displayLength: 2000, classes: 'red'})
      setData(newData)

    })
  }

  const deleteComment = (postId,commentId)=>{
 
    fetch(`/deletecomment/${postId}/${commentId}`,{
      method:"delete",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.map(item=>{
        if(item._id===result._id){
          result.postedBy=item.postedBy;
          return result
        }
        else{
          return item
        }
    })
    setData(newData);
    M.toast({html:"Comment Deleted Successfully" ,displayLength: 1000, classes: 'red'})
    window.location.reload()
  })
  }


  return (
    <>
      <div className="home">

        {
          data.map(item=>{
            return(
              <div className="card home-card" key={item._id} >
                <h5 className='poster-name'>
                <Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile" }>
                <img src={item.postedBy.pic} className="post-dp" alt="" />
                </Link>
                <Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile" } className="post-dp-text"> {item.postedBy.name}</Link>  
                 
                {item.postedBy._id === state._id &&
                  <i className="material-icons delete-icon"
                  onClick={()=>{deletepost(item._id)}}
                  >delete</i>
                }
                
                </h5>
                <div className='card-image'>
                  <img src={item.photo} alt="" />
                </div>
                <div className="card-content">
                  {/* <i class="material-icons" style={{color:"red"}}>favorite</i> */}

                  {item.likes.includes(state._id)
                            ? 
                             <i className="material-icons like-dislike" style={{color:"red"}}
                                    onClick={()=>{unlikepost(item._id)}}
                              >favorite</i>
                            : 
                            <i className="material-icons like-dislike" style={{color:"grey"}}
                            onClick={()=>{likepost(item._id)}}
                            >favorite</i>
                  }

                  <h6>{item.likes.length} Likes</h6>
                  <h6>{item.title}</h6>
                  <p>{item.body}</p>
                  {
                    item.comments.map(record=>{
                      return(
                        <div className='user-comment'>
                          <h6 key={record._id}>
                            <span className='comment-name'>{record.postedBy.name} </span>
                            <span>{record.text}</span>

                            {item.postedBy._id === state._id  &&  
                            <i className="material-icons user-comment-icon" 
                                style={{fontSize:"20px"}}
                                onClick={()=>deleteComment(item._id,record._id)}>
                                delete</i>}
                            
                            </h6>

                         

                        </div>
                        
                      )
                    })
                  }

                  <form action="" onSubmit={(e)=>{
                      e.preventDefault()
                      makeComment(e.target[0].value,item._id)
                  }}>
                      <input type="text" placeholder='Add Comment' />
                  </form>

                  
                </div>
              </div>
            )
          })
        }

      </div>
    </>
  )
}

export default Home