import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateItem() {
    const [formValues, setFormValues] = useState({itemName:'',
                                                description:'',
                                                category:'',
                                                price:'',
                                                image:[]})
    const [alert, setAlert] = useState('');

    var removeImage = (index) => {
        let imageArray = formValues.image;
        imageArray.splice(index, 1);
        setFormValues({ ...formValues, image: [ ...imageArray ]});
    }

    var onChangeHandler = (event) => {
        let {name, value} = event.target;
        if(name === "image")
        {
            const file = event.target.files[0];

            if(file === undefined) {
            } 
            else if(file.type === "image/png" || file.type === "image/jpeg")
            {
                let imageArray = formValues.image;
                setFormValues({...formValues, [name]: [ ...imageArray, file]});
            }
            else {
                setAlert("Please upload a valid image file");
                setTimeout(() => {
                    setAlert("");
                }, 3000);
            }
        }
        else
        {
            setFormValues({...formValues, [name]: value});
        }
        console.log(formValues)

    }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        // let form = {
        //     itemName: formValues.itemName,
        //     description: formValues.description,
        //     category: formValues.category,
        //     price: Number(formValues.price),
        //     image: 
        // }
        var formData = new FormData();
        formData.append('itemName', formValues.itemName);
        formData.append('description', formValues.description);
        formData.append('category', formValues.category);
        formData.append('price', formValues.price);
        // formData.append('image', formValues.image[0]);
        formValues.image.forEach((img) => formData.append('image', img))
        console.log(formData)
        axios.post('http://localhost:5000/items/create', formData,
        {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }
    return (
        <div>
            Create Item
            <form onSubmit={onSubmitHandler}>
                { alert && <span>{alert}<br/></span>}
                <input type='text' name='itemName' value={formValues.itemName} placeholder='Name' onChange={onChangeHandler} required></input><br/>
                <textarea name='description' value={formValues.description} placeholder='Write a description' onChange={onChangeHandler}></textarea><br/>
                <input type='text' name='category' value={formValues.category} placeholder='Category' onChange={onChangeHandler} required></input><br/>
                <input type='number' name='price' value={formValues.price} placeholder='Price' onChange={onChangeHandler} min={0}></input><br/>
                <input type='file' name='image' onChange={onChangeHandler}></input><br/>
                Uploaded images:<br/>
                {
                    formValues.image.length > 0 ?
                    formValues.image.map((img, index) => {
                        return <span key={index}>{img.name}<button onClick={() => removeImage(index)}>X</button><br/></span>
                    })
                    :
                    <span>Uploaded images will be listed here...<br/></span>
                }
                <input type='submit' value='Create Item'></input>
            </form>
        </div>
    )
}

export default CreateItem;