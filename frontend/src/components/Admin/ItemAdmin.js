import React, { useState, useEffect } from 'react';
import MenuOptions from '../Menu/MenuOptions';
import axios from 'axios';
import ItemTable from './ItemTable';

function ItemAdmin() {
    const [ items, setItems ] = useState([]);
    const [ tempItems, setTempItems ] = useState([])
    const [ error, setError ] = useState("");

    const getItems = async () => {
        try
        {
            var response = await axios.get('http://localhost:5000/items/',
                {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
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
            <MenuOptions allItems={items} items={tempItems} setItems={setTempItems} />
            {error && <span>{error}</span>}
            <ItemTable rows={tempItems}/>
        </div>
    )
}

export default ItemAdmin;