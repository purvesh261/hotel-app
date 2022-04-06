import React, { useState } from 'react';

const sortOptions = [
    'Sort By',
    'Price: Low to High',
    'Price: High to Low',
    'Newest',
    'Oldest'
]

function MenuOptions(props) {
    const [searchQuery, setSearchQuery] = useState([]);
    const [sort, setSort] = useState(sortOptions[0]);
    const { items, setItems } = props;

    const search = (value) => {   
        setSearchQuery(value);
        
        if(value === "")
        {
            setItems([ ...items ]);
        }
        else
        {
            setItems([ ...items ].filter(item => {
                return item.itemName.toLowerCase().includes(value.toLowerCase());
            }));
        }
    } 

    const sortItems = (value) => {
        setSort(value);
        switch(value)
        {
            case sortOptions[1]:
                setItems([ ...items ].sort((a, b) => (a.price > b.price) ? 1 : -1));
                break;
            case sortOptions[2]:
                setItems([ ...items ].sort((a, b) => (a.price < b.price) ? 1 : -1));
                break;
            case sortOptions[3]:
                setItems([ ...items ].sort((a, b) => (a.createdOn < b.createdOn) ? 1 : -1));
                break;
            case sortOptions[4]:
                setItems([ ...items ].sort((a, b) => (a.createdOn > b.createdOn) ? 1 : -1));
                break;
            default:
                setItems(items)
        }
    }

    return (
        <div>
            <input type='text' name='searchQuery' value={searchQuery} onChange={(e) => search(e.target.value)}></input>
            <select name='sort' value={sort} onChange={(e) => sortItems(e.target.value)}>
                {sortOptions.map((option, index) => {
                    return <option key={index}>{option}</option>
                })}
            </select>
        </div>
    )
}

export default MenuOptions;