import React, { useState, useEffect } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import ItemDetails from './ItemDetails';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions, Box, Typography } from '@mui/material';

export default function ItemCard({ item }) {
  const navigate = useNavigate();

  const styles =  theme => ({ 
      maxWidth: 345,
      margin:"10px",
      maxHeight:400,
      height: "100%",
      backgroundColor:"rgb(228, 237, 239)",
      [theme.breakpoints.down('sm')]: {
          margin: 'auto',
          maxWidth: "90%",
          maxHeight:350
      }
  })

  return (
    <Card sx={styles} className="itemCard">
      <CardActionArea onClick={() => navigate("/items/" + item._id)}>
        <CardMedia
          component="img"
          height="160"
          image={item.displayImage}
          alt={item.itemName}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.itemName}
          </Typography>
          <Typography variant="body2" color="text.info">
            {"₹ " + item.price}
          </Typography>
          <Typography variant="body2" noWrap color="text.secondary">
            {item.description || item.category}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => navigate("/items/" + item._id)} >
          View More
        </Button>
      </CardActions>
    </Card>
  );
}
