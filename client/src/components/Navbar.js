import React, { useContext , useEffect, useRef, useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'
// import Popup from 'reactjs-popup';


const Navbar = () => {
 
  const navigate = useNavigate()
  const{state,dispatch} = useContext(UserContext)
  const searchModel = useRef(null)
  const [search,setSearch] =useState("")
  const [userdetails , setUserdetails] = useState([])

  
  
  useEffect(() =>{
    M.Modal.init(searchModel.current)
  })

  // console.log(state);
  // console.log(state.email="admin123@gmail.com");

  const renderList = () =>{
    if(state){
      if(state.email === "admin123@gmail.com" ){
        return[
          <li key="1"><Link to="/userdetails">UserDetails</Link></li>,
          <li key="2"><Link to="/dashboard">Dashboard</Link></li>,
           <li key="3">
             <button className='btn logout-btn waves-effect waves-light #64b5f6 red darken-1'
                onClick={() =>{
                  localStorage.clear()
                  dispatch({type:"CLEAR"})
                  navigate("/signin")
                } }
                >
               Admin Logout
             </button>
           </li>
        ]
      }
        
      return[
        

//         <li key="3"> 
//           <Popup
//             trigger={<button className="button"> Open Modal </button>}
//             modal
//             nested
//           >
//             {close => (
//       <div className="modal">
//         <button className="close" onClick={close}>
//           &times;
//         </button>
//         <div className="header"> Modal Title </div>
//         <div className="content">
//           {' '}
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
//           Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
//           delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?
//           <br />
//           Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
//           commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
//           explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae?
//         </div>
//         <div className="actions">
//           <Popup
//             trigger={<button className="button"> Trigger </button>}
//             position="top center"
//             nested
//           >
//             <span>
//               Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
//               magni omnis delectus nemo, maxime molestiae dolorem numquam
//               mollitia, voluptate ea, accusamus excepturi deleniti ratione
//               sapiente! Laudantium, aperiam doloribus. Odit, aut.
//             </span>
//           </Popup>
//           <button
//             className="button"
//             onClick={() => {
//               console.log('modal closed ');
//               close();
//             }}
//           >
//             close modal
//           </button>
//         </div>
//       </div>
//     )}
//   </Popup>
// );
          
//         </li>,
        <li key="4"><i data-target="modal1" className='large material-icons modal-trigger ' options={ {dismissible: false} } style={{color:"black"}}>search</i></li>,
        <li key="5"><Link to="/followingpost">Friends Posts</Link></li>,
        <li key="6"><Link to="/profile">Profile</Link></li>,
        <li key="7"><Link to="/createpost">Create Post</Link></li>,
        <li key="8">
          <button className='btn logout-btn waves-effect waves-light #64b5f6 red darken-1'
          onClick={() =>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            navigate("/signin")
          } }
          >
            Logout
          </button>
        </li>
      ]
      

      
    } 
    

    else{

      return [
        <li key="9"><Link to="/signin">Sign In</Link></li>,
        <li key="10"><Link to="/signup">Sign Up</Link></li>,
        <li key="11"><Link to="/admin">Admin</Link></li>
      ]
    }


   



  }



  const fetchUsers = (query) =>{
    setSearch(query)
    fetch("/search-users",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })

    }).then(res=>res.json())
    .then(results=>{
      // console.log(results);
      setUserdetails(results.user)
    })
  }




  return (
    <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"signin"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>




     <div id="modal1" className="modal" options={ {dismissible: false} } ref={searchModel} >
      <div className="modal-content">
        <div class="input-field col s6">
          <i class="material-icons prefix">account_circle</i>
          <input id="icon_prefix" type="text" class="validate"
          value={search} onChange={(e)=> fetchUsers(e.target.value)}
          />
          <label for="icon_prefix">Find Your Friends</label>
        </div> 

              <ul className="collection">
               {userdetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModel.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
              </ul>
     
      </div>
      <div className="modal-footer">
        <button className="modal-close waves-effect waves-green btn-flat" options={ {dismissible: false} } onClick={()=>setSearch("")}>close</button>
      </div>
   </div> 


  </nav>
  )
}

export default Navbar