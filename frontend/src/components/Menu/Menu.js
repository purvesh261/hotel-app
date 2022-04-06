import React, { useState, useEffect } from 'react';
import MenuOptions from './MenuOptions';
import axios from 'axios';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [tempItems, setTempItems] = useState([]);
    const [error, setError] = useState('');
    
    const getItems = async () => {
        try
        {
            var response = await axios.get('http://localhost:5000/items/',
                {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
            setMenuItems(response.data);
            setTempItems(response.data);
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
        Menu
        <MenuOptions items={menuItems} setItems={setTempItems}/>
        {error && <div>{error}</div>}
        {tempItems.length > 0  && tempItems.map((item, index) => {
            return <p key={index}>{item.itemName} {item.price}</p>
        })}
    </div>
    
    )
}

export default Menu