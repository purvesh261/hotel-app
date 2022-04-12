import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuOptions from '../Menu/MenuOptions';
import { Grid, Button } from "@mui/material"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import ItemTable from './ItemTable';

function ItemAdmin() {
    const [ items, setItems ] = useState([]);
    const [ tempItems, setTempItems ] = useState([])
    const [ error, setError ] = useState("");
    const navigate = useNavigate();

    const getItems = async () => {
        try
        {
            var response = await axios.get('http://localhost:5000/items/',
                {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
            console.log(response)
            setItems(response.data);
            setTempItems(response.data)
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
            <MenuOptions allItems={items} items={tempItems} setItems={setTempItems}>
                <Grid item xs={12} lg={2}>
                    <Button variant="contained" sx={{mt:"10px", ml:"20px",height:"70%"}} onClick={() => navigate('/admin/create-item')}><AddCircleIcon></AddCircleIcon> Create Item</Button>
                </Grid>
            </MenuOptions>
            {error && <span>{error}</span>}
            <ItemTable rows={tempItems} getItems={getItems}/>
        </div>
    )
}

export default ItemAdmin;