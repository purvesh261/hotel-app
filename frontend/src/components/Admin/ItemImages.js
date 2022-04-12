import React, { useState, forwardRef } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertSnackbar from '../AlertSnackbar';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  
  
export default function ItemImageList({ itemData, setImgData, id }) {
    const [alert, setAlert] = useState("");
    const [severity, setSeverity] = useState("");
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const getImageName = (name) => {
        var i = name.indexOf('-');
        return name.slice(i+1);
    }
    const handleClickOpen = (index) => {
        setDeleteIndex(index);
        setOpenDialog(true);
      };
    
    const handleClose = () => {
        setOpenDialog(false);
        setDeleteIndex(null);
    };    

    const deleteImageRequest = async () => {
        try {
            await axios.put(`http://localhost:5000/items/${id}`, { image: itemData },
                {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
            setSeverity("success");
            setAlert("Image deleted!");
            setOpenSnackbar(true);

        }
        catch(err) {
            if (err.response && err.response.data) {
                setSeverity("error");
                setAlert(err.response.data)
                setOpenSnackbar(true);
                setTimeout(() => setAlert(""), 6000);
            }
        }
    }

    const deleteImage = () => {
        itemData.splice(deleteIndex, 1);
        setImgData(itemData);
        deleteImageRequest();
        handleClose();
    }

    const uploadImageRequest = async (formData) => {
        try {
            var res = await axios.put(`http://localhost:5000/items/image/${id}`, formData, 
            {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
            console.log(res);
            itemData.push(res.data.image.at(-1))
            setSeverity("success");
            setAlert("Image uploaded!");
            setOpenSnackbar(true);
        }
        catch(err){
            if (err.response && err.response.data) {
                setSeverity("error");
                setAlert(err.response.data)
                setOpenSnackbar(true);
            }
        }
    }

    const uploadImage = (event) => {
        console.log();
        const file = event.target.files[0];
        if(file === undefined) {
        } 
        else if(file.type === "image/png" || file.type === "image/jpeg")
        {
            var formData = new FormData();
            formData.append('image', file);
            uploadImageRequest(formData)
        }
        else {
            setAlert("Please upload a valid image file");
            setSeverity("error");
            setOpenSnackbar(true);
        }
        
    }

    return (
        <Paper variant="outlined" sx={{margin:"5px"}}>
            <Box container sx={{padding:"10px"}}>
                <Box sx={{display:"flex", justifyContent:"space-between"}}>
                    <Typography variant="h6">
                        Images
                    </Typography>
                    <input
                        style={{ display: "none" }}
                        id="contained-button-file"
                        type="file"
                        name="image"
                        onChange={uploadImage}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" component="span">
                            Upload
                        </Button>
                    </label>
                </Box>
                {itemData.length > 0 ? 
                    <ImageList sx={{ mt:"10px" }} cols={4} rowHeight={200}>
                    {itemData.map((item, index ) => (
                        <ImageListItem key={getImageName(item)}>
                        <img
                            src={`http://localhost:5000/static/items/${id}/${item}`}
                            srcSet={`http://localhost:5000/static/items/${id}/${item}`}
                            style={{maxHeight:200}}
                            alt={item.split("-")[1]}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={getImageName(item)}
                            actionIcon={
                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                aria-label={`info about ${getImageName(item)}`}
                                onClick={() => handleClickOpen(index)}
                            >
                                <DeleteIcon />
                            </IconButton>
                            }
                        />
                        </ImageListItem>
                    ))}
                    </ImageList>
                    :
                        <Typography color="text.secondary">Uploaded images will be displayed here...</Typography>
                    }
            </Box>
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete " + itemData[deleteIndex]}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you want to delete this image?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={deleteImage} sx={{color:"red"}}>Delete</Button>
                <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <AlertSnackbar open={openSnackbar} setOpenSnackbar={setOpenSnackbar} severity={severity} message={alert}/>
        </Paper>
        
    );
}