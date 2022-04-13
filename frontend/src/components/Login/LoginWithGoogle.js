import React from 'react';
import GoogleLogin from 'react-google-login';
import GoogleButton from 'react-google-button';
import axios from 'axios';

function LoginWithGoogle(props) {
    const responseSuccessGoogle = (response) => {
        axios.post("http://localhost:5000/users/auth/google", {tokenId: response.tokenId})
            .then(res => props.authenticationSuccess(res))
            .catch(err => props.authenticationFail(err))
    }

    const responseFailureGoogle = (response) => {
        props.setError("Something went wrong. Try again.")
    }

    return (
    <div>

        <GoogleLogin
            clientId="192480243308-nhs9est1ogdph1eavhnuiprdpdugg7ms.apps.googleusercontent.com"
            buttonText="Login"
            render={(renderProps) => 
                    <GoogleButton 
                        style={{width:"100%", marginBottom:"10px"}} 
                        label={props.label}
                        onClick={renderProps.onClick} 
                        disabled={renderProps.disabled}/>}
            onSuccess={responseSuccessGoogle}
            onFailure={responseFailureGoogle}
            cookiePolicy={'single_host_origin'}
        />
    </div>
    )
}

export default LoginWithGoogle;