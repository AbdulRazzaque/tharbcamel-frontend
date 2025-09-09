import React from 'react'
import "./SignIn.scss"
import {connect} from 'react-redux'
import {setUser} from '../redux/user/userActions'
import { TextField,Button, Alert } from '@mui/material'
import {useForm} from 'react-hook-form'
import axios from 'axios'
function SignUp(props) {
  const {handleSubmit,register,formState:{errors}}=useForm()
  const [error,setError]=React.useState("")
  const onSubmit = (data)=>{
    axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/user/createUser`,{...data})
    .then(res=>{
      console.log(res)
      setError("")
      props.setUser(res.data.result)
      props.history.push("/")
    })
    .catch(err=>{
      console.log(err)
      console.log(err.response)
      if(err.response.data.msg){
        setError(err.response.data.result)
      }
    })
  }
  return (
    <div>
      <div className="auth-div">
      <h1>SignUp</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register('email',{required:true})} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Email" />
        <TextField {...register('password',{required:true})} className="my-3" fullWidth variant="outlined" id="outlined-basic" label="Password" />
        {error.length>0&&<Alert severity="error">{error}</Alert>}
        <div style={{textAlign:"center"}}>
        <Button variant="contained" type="submit">SignUp</Button>
        </div>
        </form>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch)=>{
  return {
    setUser:(token)=>dispatch(setUser(token))
  }
}

export default connect(null,mapDispatchToProps)(SignUp)