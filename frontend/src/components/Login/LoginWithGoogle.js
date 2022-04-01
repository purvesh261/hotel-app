import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

function LoginWithGoogle() {
    const responseSuccessGoogle = (response) => {
        axios.post("http://localhost:5000/users/auth/google", {tokenId: response.tokenId})
            .then(res => {
                localStorage.setItem("user", JSON.stringify(res.data))
            })
            .catch(err => {
                console.log(err)
            })
    }

    const responseFailureGoogle = (response) => {
        console.log(response);
    }

    return (
    <div>
        <GoogleLogin
            clientId="192480243308-nhs9est1ogdph1eavhnuiprdpdugg7ms.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseSuccessGoogle}
            onFailure={responseFailureGoogle}
            cookiePolicy={'single_host_origin'}
        />
    </div>
    )
}

export default LoginWithGoogle;