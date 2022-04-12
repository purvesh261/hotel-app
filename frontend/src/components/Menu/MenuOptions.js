import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel } from '@mui/material';
import { FormControl } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const sortOptions = [
    'Price: Low to High',
    'Price: High to Low',
    'Newest',
    'Oldest',
]

function MenuOptions(props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sort, setSort] = useState("");
    const { allItems, items, setItems } = props;

    const search = (value) => {   
        setSearchQuery(value);
        if(value === "")
        {
            setItems([ ...allItems ]);
        }
        else
        {
            setItems([ ...allItems ].filter(item => {
                return item.itemName.toLowerCase().includes(value.toLowerCase());
            }));
        }
    }

    const sortItems = (value) => {
        setSort(value);
        switch(value)
        {
            case sortOptions[0]:
                setItems([ ...items ].sort((a, b) => (Number(a.price) > Number(b.price)) ? 1 : -1));
                break;
            case sortOptions[1]:
                setItems([ ...items ].sort((a, b) => (Number(a.price) < Number(b.price)) ? 1 : -1));
                break;
            case sortOptions[2]:
                setItems([ ...items ].sort((a, b) => (a.createdOn < b.createdOn) ? 1 : -1));
                break;
            case sortOptions[3]:
                setItems([ ...items ].sort((a, b) => (a.createdOn > b.createdOn) ? 1 : -1));
                break;
            default:
                setItems(items)
        }
    }

    return (
        <div>
            <Grid container spacing={2} >
                <Grid item xs={0} lg={4}/>
                <Grid item xs={12} sm={12} md={12} lg={4}>
                    <TextField name='searchQuery' label="Search" type="search" value={searchQuery} onChange={(e) => search(e.target.value)} sx={{ width:"100%", margin:"10px" }}/>
                </Grid>
                <Grid item xs={12} lg={2}>
                    <FormControl fullWidth sx={{ margin:"10px" }}>
                    <InputLabel id="sort">Sort</InputLabel>
                    <Select
                        id="sort"
                        value={sort}
                        onChange={(e) => sortItems(e.target.value)}
                        label="Sort">
                            {sortOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option} </MenuItem>
                            ))}
                    </Select>
                    </FormControl>
                </Grid>
                {props.children}
            </Grid>
        </div>
    )
}

export default MenuOptions;