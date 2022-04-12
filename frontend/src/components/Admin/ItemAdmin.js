import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuOptions from '../Menu/MenuOptions';
import { Grid, Button, Box } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import ItemTable from './ItemTable';
import FilterListIcon from '@mui/icons-material/FilterList';
import Typography from '@mui/material/Typography';
import Filters from './Filters';

function ItemAdmin() {
    const [ items, setItems ] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
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
                    <Stack>
                        <Button variant="contained" sx={{mt:"10px", ml:"20px",height:"70%"}} onClick={() => setOpenFilter(true)} ><FilterListIcon /> Filter</Button>
                        <Button variant="contained" sx={{mt:"10px", ml:"20px",height:"70%"}} onClick={() => navigate('/admin/create-item')}><AddCircleIcon></AddCircleIcon> Create Item</Button>                        
                    </Stack>
                </Grid>
            </MenuOptions>
            {error && <span>{error}</span>}
            <ItemTable rows={tempItems} getItems={getItems}/>
            <Filters openFilter={openFilter} setOpenFilter={setOpenFilter} tempItems={tempItems} setTempItems={setTempItems}/>
        </div>
    )
}

export default ItemAdmin;