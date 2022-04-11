import axios from 'axios';
import React, { useState, useEffect } from 'react';
import LoginWithGoogle from './LoginWithGoogle';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // redirect to appropriate page if user is already logged in
        if(user)
        {
            redirectUser(user.admin);
        }        
    }, [])

    const validateCredentials = () => {
      if(email === "")
      {
        setEmailError(true)
      }

      if(password === "")
      {
        setPasswordError(true)
      }
      
      let validEmail = email.toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      console.log(validEmail,"u")

      if(!validEmail)
      {
        setEmailError(true)
      }

      let validPassword = password
        .match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/
        );

      if(!validPassword)
      {
        setPasswordError(true)
      }

      return validEmail && validPassword;

    };

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
        setEmailError(false);
        setPasswordError(false);
        if(validateCredentials())
        {
          axios.post('http://localhost:5000/users/authenticate', { email, password })
            .then(res => authenticationSuccess(res))
            .catch(err => authenticationFail(err))
        }
    }

    return (
    <div>
        <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#0d6efd' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={onSubmitHandler} noValidate sx={{ mt: 1 }}>
            <Typography component="span" variant="body1" sx={{color:"red"}}>
              {error}
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError || error ? true : false}
              autoFocus
            />  
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError || error ? true : false}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
                <Grid item xs={12}>
                    <LoginWithGoogle authenticationSuccess={authenticationSuccess} authenticationFail={authenticationFail}/>
                </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <Link href="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    
    </div>
    )
}

export default Login;