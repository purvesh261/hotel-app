import React, {useState, useEffect} from 'react';
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const theme = createTheme();

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // redirect to appropriate page if user is already logged in
    if(user)
    {
      if(user.admin)
      {
        navigate('/admin');
      }
      else
      {
        navigate('/')
      }
    }        
    }, [])

  const validateForm = () => {
    if(email === "" || password === "" || confirmPassword === "")
    {
      setErrorMessage("Enter all fields");
      setTimeout(() => setErrorMessage(""), 3000)
      return false;
    }
    if(!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    {
      setEmailError(true);
      setErrorMessage("Not a valid email");
      setTimeout(() => setErrorMessage(""), 3000)
      return false;
    }
    if(!password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/))
    {
      setPasswordError(true);
      setErrorMessage("Not a valid password");
      setTimeout(() => setErrorMessage(""), 3000)
      return false;
    }
    if(password != confirmPassword)
    {
      setPasswordError(true)
      setErrorMessage("Passwords do not match");
      setTimeout(() => setErrorMessage(""), 3000)
      return false;
    }
    return true;
  }

  const signUpSuccess = (res) => {
    if(res.data.error)
    {
        setErrorMessage(res.data.error)
        setTimeout(() => setErrorMessage(""), 2000)
    }
    else
    {
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate('/')
    }
  }

  const signUpFailure = (err) => {
    if (err.response && err.response.data) {
      if(err.response.data.error)
      {
        setErrorMessage(err.response.data.error)
      }
      else{
        setErrorMessage(err.response.data)
      }
    }
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    if(validateForm())
    {
      let form = {
        email:email,
        password:password,
        admin:false
      }

      axios.post("http://localhost:5000/users/create", form)
        .then(res => signUpSuccess(res))
        .catch(err => signUpFailure(err))
    }
  };

  return (
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
            Sign up
          </Typography>
          <Box component="form" onSubmit={onSubmitHandler} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="span" gutterBottom variant="body1" sx={{color:"red"}}>
                  {errorMessage}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  error={emailError}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  error={passwordError}
                  onChange={(e) => setPassword(e.target.value)}

                />
                <Typography component="div" variant="body2" color="text.secondary" sx={{mt:"5px"}}>
                  Password must be combination of one uppercase, one lower case, one special character, one digit and min 6 char long
                </Typography>

              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  error={passwordError}
                  onChange={(e) => setConfirmPassword(e.target.value)}

                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" required color="primary" />}
                  label="I agree to the terms and conditions."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}