import React, { useState, useEffect } from 'react';
import MenuOptions from './MenuOptions';
import axios from 'axios';
import ItemCard from './ItemCard';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import defaultImage from '../../assets/defaultFood.jpg';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [tempItems, setTempItems] = useState([]);
    const [error, setError] = useState('');

    const getItems = async () => {
        try
        {
            var response = await axios.get('http://localhost:5000/items/',
                {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
            let items = response.data;
            items.forEach(item => {
                if("image" in item && item.image.length > 0)
                {
                  item.displayImage = "http://localhost:5000/static/items/" + item._id + "/" + item.image[0];
                }
                else
                {
                    item.displayImage = defaultImage;
                }
            });
            setMenuItems(items);
            setTempItems(items);
        }
        catch(err)
        {
            if (err.response && err.response.data) {
                setError(err.response.data)
            }
        }
    }

    useEffect(() => {
        getItems();
    }, [])

    return (
    <div>
        <MenuOptions allItems={menuItems} items={tempItems} setItems={setTempItems} />
            <Grid container spacing={2} >
                    {error && <div>{error}</div>}
                        {tempItems.length > 0  ? tempItems.map((item, index) => {
                            return <Grid item xs={12} sm={6} md={4} lg={3} key={index}> <ItemCard item={item} /> </Grid>
                        })
                        :
                        <Typography component="h3" variant="h4" color="text.secondary" sx={{margin:"auto", mt:"30px"}}>
                            No products found
                        </Typography>
                    }

            </Grid>
    </div>
    )
}

export default Menu