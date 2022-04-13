import React from 'react';
import { Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Page404() {
  const navigate = useNavigate();
  const USER = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      <Stack>
        <Typography variant="h1" align='center' sx={{mt:5, fontWeight:"bolder"}}>
          404
        </Typography>
        <Typography variant="h3" align='center' sx={{}}>
          Not Found
        </Typography>
        <Typography variant="h6" align='center' sx={{color:"text.secondary"}}>
          The requested resource could not be found!
        </Typography>
        <Button sx={{margin:'auto', mt:3}} onClick={() => USER.admin ? navigate('/admin') : navigate('/')} >Go back</Button>
      </Stack>
    </div>
  )
}

export default Page404;