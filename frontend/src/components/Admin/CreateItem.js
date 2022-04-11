import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, List, ListItem, IconButton, ListItemIcon, Button, CssBaseline, Container, Typography, FormControlLabel, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme();

function CreateItem() {
    const [formValues, setFormValues] = useState({itemName:'',
                                                description:'',
                                                category:'',
                                                price:'',
                                                image:[]})
    const [alert, setAlert] = useState('');
    const navigate = useNavigate();

    var removeImage = (index) => {
        let imageArray = formValues.image;
        imageArray.splice(index, 1);
        setFormValues({ ...formValues, image: [ ...imageArray ]});
    }

    var onChangeHandler = (event) => {
        let {name, value} = event.target;
        if(name === "image")
        {
            const file = event.target.files[0];

            if(file === undefined) {
            } 
            else if(file.type === "image/png" || file.type === "image/jpeg")
            {
                let imageArray = formValues.image;
                setFormValues({...formValues, [name]: [ ...imageArray, file]});
            }
            else {
                setAlert("Please upload a valid image file");
                setTimeout(() => {
                    setAlert("");
                }, 3000);
            }
        }
        else
        {
            setFormValues({...formValues, [name]: value});
        }
        console.log(formValues)

    }
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        var formData = new FormData();
        formData.append('itemName', formValues.itemName);
        formData.append('description', formValues.description);
        formData.append('category', formValues.category);
        formData.append('price', formValues.price);
        formValues.image.forEach((img) => formData.append('image', img))
        console.log(formData)
        axios.post('http://localhost:5000/items/create', formData,
        {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
        .then(res => {
            navigate('/admin')
        })
        .catch(err => {
            setAlert("Something went wrong. Try again later.")
            setTimeout(() => {setAlert("")}, 3000)
        })
    }
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <Box
                    sx={{
                        marginTop: 8,
                        mb: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                       <Typography component="h1" variant="h5">
                            Create Item
                        </Typography> 
                        <Box component="form" onSubmit={onSubmitHandler} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography component="span" gutterBottom variant="body1" sx={{color:"red"}}>
                                        {alert}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="itemName"
                                    label="Item Name"
                                    name="itemName"
                                    value={formValues.itemName}
                                    onChange={onChangeHandler}
                                />
                                    {/* <input type='text' name='itemName' value={formValues.itemName} placeholder='Name' onChange={onChangeHandler} required></input><br/> */}
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    id="description"
                                    label="Description"
                                    name="description"
                                    value={formValues.description}
                                    onChange={onChangeHandler}
                                />
                                    {/* <textarea name='description' value={formValues.description} placeholder='Write a description' onChange={onChangeHandler}></textarea><br/> */}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="category"
                                        label="Category"
                                        name="category"
                                        value={formValues.category}
                                        onChange={onChangeHandler}
                                    />
                                    {/* <input type='text' name='category' value={formValues.category} placeholder='Category' onChange={onChangeHandler} required></input><br/> */}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        id="price"
                                        label="Price"
                                        name="price"
                                        inputProps={{min:0, step:0.01}}
                                        value={formValues.price}
                                        onChange={onChangeHandler}
                                    />
                                    {/* <input type='number' name='price' value={formValues.price} placeholder='Price' onChange={onChangeHandler} min={0}></input><br/> */}
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper elevation={1} variant="outlined" sx={{margin:"5px"}}>
                                        <Grid container sx={{padding:"10px"}}>
                                            <Grid item xs={9}>
                                                <Typography variant="h6">
                                                    Upload Images
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <input
                                                    style={{ display: "none" }}
                                                    id="contained-button-file"
                                                    type="file"
                                                    name="image"
                                                    onChange={onChangeHandler}
                                                />
                                                <label htmlFor="contained-button-file">
                                                    <Button variant="contained" color="primary" component="span">
                                                        Upload
                                                    </Button>
                                                </label>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {
                                                    formValues.image.length > 0 ?
                                                    <List>
                                                        {formValues.image.map((img, index) => {
                                                            return <ListItem disablePadding
                                                                    key={index}
                                                                    secondaryAction={
                                                                        <IconButton edge="end" aria-label="delete" onClick={() => removeImage(index)}>
                                                                            <DeleteIcon />
                                                                        </IconButton>}
                                                                    >
                                                                        <ListItemIcon>
                                                                            <ImageIcon/>
                                                                        </ListItemIcon>
                                                                        {img.name}
                                                                        {/* <Button onClick={() => removeImage(index)}><DeleteIcon sx={{color:"#757575"}}/></Button> */}
                                                                    </ListItem>
                                                        })}

                                                    </List>
                                                    :
                                                    <Typography color="text.secondary">Uploaded images will be listed here...</Typography>
                                                }
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                Create
                                </Button>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            {/* Create Item
            <form onSubmit={onSubmitHandler}>
                { alert && <span>{alert}<br/></span>}
                <input type='file' name='image' style={fileInputStyle} onChange={onChangeHandler}></input><br/>

                Uploaded images:<br/>
                {
                    formValues.image.length > 0 ?
                    formValues.image.map((img, index) => {
                        return <span key={index}>{img.name}<button onClick={() => removeImage(index)}>X</button><br/></span>
                    })
                    :
                    <span>Uploaded images will be listed here...<br/></span>
                } */}
                {/* <input type='submit' value='Create Item'></input> */}
            {/* </form> */}
        </div>
    )
}

export default CreateItem;