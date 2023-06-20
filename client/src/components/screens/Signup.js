import React,{useEffect, useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {

  const navigate = useNavigate()
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")
  const [image,setImage] = useState("")
  const [url,setUrl] = useState(undefined)


  useEffect(() =>{
    if(url){
      uploadfiled()
    }
  },[url])


  const uploadpic = () =>{
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
            setUrl(data.url)
        }).catch(err => {
            console.log(err)
        })

  }


  const uploadfiled = () =>{
    fetch("/signup",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        password,
        email,
        pic:url
      })
    }).then(res => res.json())
      .then(data=>{
        if(data.error){
          M.toast({html: data.error ,displayLength: 2000, classes: 'red'})
        }
        else{
          M.toast({html: data.message , displayLength: 2000 , classes: 'green'})
          navigate("/signin")
        }
      }).catch(err => {
        console.log(err);
      })
  }


  const PostData = () =>{
    if(image){
      uploadpic()
    }else{
      uploadfiled()
    }
    
  }


  


  return (
    <>
      <div className='mycard'>
        <div className='card auth-card input-field'>
          <h2 className='brand-logo'>Instagram</h2>
          <input type="text" placeholder='Name'
            value={name} onChange={(e =>setName(e.target.value))}
          />
          <input type="email" placeholder='Email'
            value={email} onChange={(e =>setEmail(e.target.value))}
          />
          <input type="password" placeholder='Password'
            value={password} onChange={(e =>setPassword(e.target.value))}
          />

          <div className="file-field input-field">

            <div className="btn #64b5f6 blue darken-1">
                <span>Upload Profile Picture</span>
                <input type="file"  onChange={(e) => setImage(e.target.files[0])} />
            </div>

            <div className="file-path-wrapper">
                <input type="text" className='file-path validate' />
            </div>
          </div>

          <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
            onClick={() => PostData()}
          >
            SignUp
          </button>

          <h5>
            <Link to='/signin'><span className='have-acc'>Already Have An Account?</span></Link>
          </h5>

        </div>
      </div>
    </>
  )
}

export default Signup