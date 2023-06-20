import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import M from 'materialize-css'


const Createpost = () => {

    const navigate = useNavigate()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")


    useEffect(() =>{
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json", 
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                title,
                body,
                pic:url
            })
            }).then(res => res.json())
                .then(data=>{
                if(data.error){
                M.toast({html: data.error ,displayLength: 2000, classes: 'red'})
                }
                else{
                M.toast({html: "Created Post Successfully" , displayLength: 2000 , classes: 'green'})
                navigate("/")
                }
            }).catch(err => {
                console.log(err);
            })
        }
    },[url])

        //aa url change thsse tyaare use effect activate thsseee
        // aa [ setUrl(data.url) ] aa url change thsse tyaare............

    function postDetails() {
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

        // ------------------------------------
    }

  return (
    <>
        <div className="card input-field create-post">

            <input type="text" placeholder='Title' 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            
            <input type="text" placeholder='Body' 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            />  

            <div className="file-field input-field">

                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file"  onChange={(e) => setImage(e.target.files[0])} />
                </div>

                <div className="file-path-wrapper">
                    <input type="text" className='file-path validate' />
                </div>
            </div>

            <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
                onClick={() => postDetails()}
            >
                Create Post
            </button>
        </div>
    </>
  )
}

export default Createpost



// FILE UPLOADING  : FormData ...

// const formData = new FormData();
// const fileField = document.querySelector('input[type="file"]');

// formData.append('username', 'abc123');
// formData.append('avatar', fileField.files[0]);

// fetch('https://example.com/profile/avatar', {
//   method: 'PUT',
//   body: formData
// })
// .then(response => response.json())
// .then(result => {
//   console.log('Success:', result);
// })
// .catch(error => {
//   console.error('Error:', error);
// });


