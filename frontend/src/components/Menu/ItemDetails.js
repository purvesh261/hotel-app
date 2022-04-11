import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Pagination, Zoom } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import './swiperCSS.css';
import defaultImage from '../../assets/defaultFood.jpg';

const itemStyle = theme => ({
    paddingLeft: "40px",
    [theme.breakpoints.down('md')]: {
        margin: 'auto',
        paddingLeft: "10px",
        paddingBottom:"30px"
    }})

function ItemDetails() {
    const [item, setItem] = useState();
    const [error, setError] = useState("");
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));

    const getItem = async () => {
        try
        {
            const res = await axios.get(`http://localhost:5000/items/${id}`, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
            setItem(res.data);
            console.log(res)
        }
        catch(err){
            if (err.response && err.response.data) {
                setError(err.response.data)
            }
        }
    }
    useEffect(() => {
        getItem();
    }, [])
    return (
        <Box>
            {item && 
            <>
            <Grid container sx={{mt:"30px"}}>
                <Grid item xs={12} md={6}>

                    <Swiper
                        spaceBetween={50}
                        modules={[Navigation, Pagination, Zoom]}
                        navigation
                        pagination={{ clickable: true }}
                        className="swiper"
                        zoom={true}
                        loop={true}
                        slidesPerView={1}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}>
                        {
                            item && item.image.length > 0 ?
                            item.image.map((img, index) => {
                                return <SwiperSlide key={index} className="swiper-slide">
                                            <div className="swiper-zoom-container">
                                                <img src={"http://localhost:5000/static/items/" + item._id + "/" + img} alt={img}></img>
                                            </div>
                                        </SwiperSlide>
                            })
                            :
                            <SwiperSlide className="swiper-slide">
                                <div className="swiper-zoom-container"><img src={defaultImage}></img></div>
                            </SwiperSlide>
                        }
                    </Swiper>
                </Grid>
                <Grid item xs={12} md={6} sx={itemStyle}>
                    <Typography variant="h3">
                        {item.itemName}
                    </Typography>
                    <Typography variant="h6" sx={{mt:"10px"}}>
                        Price: <span style={{color:"#B12704", fontWeight:"bolder"}}>{"₹ " + item.price}</span>
                    </Typography>
                    <Typography variant="h6">
                        Category: {item.category}
                    </Typography>
                    <Typography variant="h6">
                        About this item:
                    </Typography>
                    <Typography color="text.secondary">
                    {item.description || "No description"}
                    </Typography>
                </Grid>
            </Grid>
            </>}
        </Box>
    )
}

export default ItemDetails