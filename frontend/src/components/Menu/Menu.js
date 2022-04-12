import React, { useState, useEffect } from 'react';
import MenuOptions from './MenuOptions';
import axios from 'axios';
import ItemCard from './ItemCard';
import Grid from '@mui/material/Grid';
import { Typography, Pagination } from '@mui/material';
import defaultImage from '../../assets/defaultFood.jpg';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [tempItems, setTempItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const CARDS_PER_PAGE = 12;

    const onPageChange = (event, newPage) => {
        var start = (newPage-1) * CARDS_PER_PAGE
        setVisibleItems(tempItems.slice(start, start + CARDS_PER_PAGE));
        setPage(newPage)
        window.scrollTo(0,0);
    }

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

    useEffect(() => {
        setVisibleItems(tempItems.slice(0, CARDS_PER_PAGE));
    }, [tempItems])

    return (
    <div>
        <MenuOptions allItems={menuItems} items={tempItems} setItems={setTempItems} />
                    {error && <div>{error}</div>}
                        {tempItems.length > 0  ? 
                        <>
                        <Grid container spacing={2} alignItems="center">
                            {visibleItems.map((item, index) => {
                                return <Grid item xs={12} sm={6} md={4} lg={3} key={index}> <ItemCard item={item} /> </Grid>
                            })}
                        </Grid>
                        <Pagination
                            count={Math.ceil(tempItems.length / CARDS_PER_PAGE)} 
                            page={page}
                            onChange={onPageChange}
                            color="primary" 
                            sx={{maxWidth:"fit-content", margin:"auto", mt:3,mb:3}}
                        />
                        </>
                        :
                        <Grid container spacing={2} alignItems="center">
                            <Typography component="h3" variant="h4" color="text.secondary" sx={{margin:"auto", mt:"30px"}}>
                                No products found
                            </Typography>
                        </Grid>

                    }
                        {/* </Grid> */}

    </div>
    )
}

export default Menu