import axios from 'axios';
import React, { useState, useEffect } from 'react';
import LoginWithGoogle from './LoginWithGoogle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // redirect to appropriate page if user is already logged in
        if(user)
        {
            redirectUser(user.admin);
        }        
    }, [])

    const redirectUser = (isAdmin) =>
    {
        if(isAdmin)
        {
            navigate('/admin')
        }
        else
        {
            navigate('/')
        }
    }

    const authenticationSuccess = (res) => {
        if(res.data.error)
        {
            setError(res.data.error)
            setTimeout(() => setError(""), 2000)
        }
        else
        {
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('user', JSON.stringify(res.data))
            redirectUser(res.data.admin);
        }
    }

    const authenticationFail = (err) => {
        if (err.response && err.response.data) {
            if(err.response.data.error)
            {
                setError(err.response.data.error)
            }
            else{
                setError(err.response.data)
            }
        }
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/users/authenticate', { email, password })
            .then(res => authenticationSuccess(res))
            .catch(err => authenticationFail(err))
    }

    return (
    <div>
        Login
        <form onSubmit={onSubmitHandler}>
            {error ? <span style={{color:"red"}}>{error}<br/></span> : <br/>}
            <div style={{padding:"10px"}}>
                <TextField required id="outlined" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={error? true : false}/><br/>
            </div>
            <div style={{padding:"10px"}}>
                <TextField required id="outlined-password-input" label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}  error={error? true : false}/><br/>
            </div>
            {/* <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input><br/> */}
            {/* <input type="submit"></input> */}
            <div style={{padding:"10px"}}>
                <Button variant="outlined" type='submit'>Login</Button>
            </div>
        </form>
        <LoginWithGoogle authenticationSuccess={authenticationSuccess} authenticationFail={authenticationFail}/>
    </div>
    )
}

export default Login