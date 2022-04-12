import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
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
    const { id } = useParams();
    const [disabled, setDisabled] = useState(false);
    const [update, setUpdate] = useState(false);

    const getItem = async () => {
        try
        {
            const res = await axios.get(`http://localhost:5000/items/${id}`, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
            
            var newFormValues = { itemName: res.data.itemName , description: res.data.description, category: res.data.category, price: res.data.price}
            setFormValues(newFormValues);
        }
        catch(err){
            if (err.response && err.response.data) {
                if(err.response.status === 404)
                {
                    setDisabled(true);
                }
                setAlert(err.response.data)
            }
        }
    }

    useEffect(() => {
        if(id)
        {
            setUpdate(true);
            getItem();
        }
        console.log(update)
    }, [])

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
    }

    const createItem = async (formData) => {
        try {
            await axios.post('http://localhost:5000/items/create', formData,
                {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
            navigate('/admin');

        }
        catch(err) {
            setAlert("Something went wrong. Try again later.");
            setTimeout(() => setAlert(""), 3000);
        }
    }

    const updateItem = async () => {
        try {
            var res = await axios.put(`http://localhost:5000/items/${id}`, formValues,
                {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
            console.log(res)
        }
        catch(err) {
            setAlert("Something went wrong. Try again later.");
            setTimeout(() => setAlert(""), 3000);
        }
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if(!update)
        {
            var formData = new FormData();
            formData.append('itemName', formValues.itemName);
            formData.append('description', formValues.description);
            formData.append('category', formValues.category);
            formData.append('price', formValues.price);
            if(formValues.image.length > 0)
            {
                formValues.image.forEach((img) => formData.append('image', img))
            }
            createItem(formData);
        }
        else {
            updateItem();
        }
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
                            { update ? "Edit Item" : "Create Item" }
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
                                    disabled={disabled}
                                    id="itemName"
                                    label="Item Name"
                                    name="itemName"
                                    value={formValues.itemName}
                                    onChange={onChangeHandler}
                                />
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    disabled={disabled}
                                    rows={4}
                                    id="description"
                                    label="Description"
                                    name="description"
                                    value={formValues.description}
                                    onChange={onChangeHandler}
                                />                                    
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        disabled={disabled}
                                        id="category"
                                        label="Category"
                                        name="category"
                                        value={formValues.category}
                                        onChange={onChangeHandler}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        disabled={disabled}
                                        type="number"
                                        id="price"
                                        label="Price"
                                        name="price"
                                        inputProps={{min:0, step:0.01}}
                                        value={formValues.price}
                                        onChange={onChangeHandler}
                                    />
                                </Grid>
                                {!update && 
                                <Grid item xs={12}>
                                    <Paper variant="outlined" sx={{margin:"5px"}}>
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
                                                                        {img.name ? img.name : img}
                                                                    </ListItem>
                                                        })}

                                                    </List>
                                                    :
                                                    <Typography color="text.secondary">Uploaded images will be listed here...</Typography>
                                                }
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>}
                                <Button
                                type="submit"
                                fullWidth
                                disabled={disabled}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                {update ? "Update" : "Create" }
                                </Button>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    )
}

export default CreateItem;