import * as React from 'react';
import '../../App.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';


export default function ItemCard({ item }) {

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
      <CardActionArea>
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
            {item.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          View More
        </Button>
      </CardActions>
    </Card>
  );
}
