import axios from 'axios';
import React, { useState } from 'react';
import LoginWithGoogle from './LoginWithGoogle';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    
    const onSubmitHandler = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/users/authenticate', { email, password })
            .then(res => {
                if(res.data.error)
                {
                    setError(res.data.error)
                    setTimeout(() => setError(""), 2000)
                }
                else
                {
                    localStorage.setItem('accessToken', res.data.accessToken)
                    localStorage.setItem('user', JSON.stringify(res.data))
                    console.log(localStorage);
                }
                
            })
            .catch(err => {
                console.log(err);
            })
    }
    return (
    <div>
        Login
        <form onSubmit={onSubmitHandler}>
            {error ? <span style={{color:"red"}}>{error}<br/></span> : <br/>}
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input><br/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input><br/>
            <input type="submit"></input>
        </form>
        <LoginWithGoogle />
    </div>
    )
}

export default Login