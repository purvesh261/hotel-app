import React, { useState, useEffect } from 'react';
import { Button, Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


function valuetext(value) {
    return `${"₹ " + value}`;
  }

function ratingValuetext(value) {
return `${value}`;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

  
function Filters(props) {
    const [tabValue, setTabValue] = useState(0);
    const [totalPriceRange, setTotalPriceRange] = useState([0, 300]);
    const [priceRange, setPriceRange] = useState([0, 300]);
    const [ratingRange, setRatingRange] = useState([0, 5]);
    const [categories, setCategories] = useState([]);
    const [activeCategories, setActiveCategories] = useState({});
    const initialAfterDate = new Date('2022-01-01');
    const initialBeforeDate = new Date();
    const [afterDate, setAfterDate] = useState(initialAfterDate);
    const [beforeDate, setBeforeDate] = useState(initialBeforeDate);

    const setInitialSlider = () => {
        if(props.allItems.length)
        {
            let max = Number(props.allItems[0].price);
            for(let i = 0; i < props.allItems.length; i++)
            {
                if(Number(props.allItems[i].price) > max)
                {
                    max = Number(props.allItems[i].price);
                }
            }
            setTotalPriceRange([0, max]);
            setPriceRange([0, max]);
        }
    }

    useEffect(() => {
        setInitialSlider();
        // find all the unique categories
        var categoriesArray = [ ...new Set(props.allItems.map((item) => item.category))]
        setCategories(categoriesArray);
        var categoriesObj = {};
        categoriesArray.map((category) => categoriesObj[category] = true)
        setActiveCategories(categoriesObj);
    }, [props.allItems])

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleRatingChange = (event, newValue) => {
        setRatingRange(newValue)
    }
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };  

    const onCategoryChange = (event) => {
        var { name, checked } = event.target;
        setActiveCategories({ ...activeCategories, [name]: checked});
    }

    const applyFilters = () => {
        var { allItems } = props;

        var newTempItems = allItems.filter((item) => {
            var filterPrice = Number(item.price) >= priceRange[0] && Number(item.price) <= priceRange[1];
            var filterCategory = activeCategories[item.category];
            var itemDate = new Date(item.createdOn);
            var filterDate = itemDate >= afterDate && itemDate <= beforeDate;
            var filterRating = Number(item.averageRating) >= ratingRange[0] && Number(item.averageRating) <= ratingRange[1];

            return filterPrice && filterCategory && filterDate && filterRating;
        })

        // set the filtered data and sort it
        props.setTempItems(newTempItems);
        props.setReSort(!props.reSort);
        props.setOpenFilter(false);
    };

    const resetFilters = () => {
        setPriceRange(totalPriceRange);
        var categoriesObj = {};
        categories.map((category) => categoriesObj[category] = true)
        setActiveCategories({ ...categoriesObj });
        setAfterDate(initialAfterDate);
        setBeforeDate(initialBeforeDate);
        setRatingRange([0,5])
        props.setTempItems(props.allItems);
        props.setReSort(!props.reSort);
        props.setOpenFilter(false);
    }

    return (
        <Modal
        open={props.openFilter}
        onClose={() => props.setOpenFilter(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Filter Data
            </Typography>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Price" {...a11yProps(0)} />
                    <Tab label="Category" {...a11yProps(1)} />
                    <Tab label="Date" {...a11yProps(2)} />
                    <Tab label="Rating" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ width: 300 }}>
                        Set price range:
                        <Slider
                            getAriaLabel={() => 'Price range'}
                            value={priceRange}
                            min={totalPriceRange[0]}
                            max={totalPriceRange[1]}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                        />
                        <Box sx={{display:"flex", justifyContent:"space-between"}}>
                            <div>{"₹ " + priceRange[0]}</div>
                            <div>{"₹ " + priceRange[1]}</div>
                        </Box>
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                <FormGroup>
                    { categories && categories.map((category, index) => {
                        return <FormControlLabel key={index} control={<Checkbox checked={activeCategories[category]} />} onChange={onCategoryChange} name={category} label={category} />
                    })}                    
                </FormGroup>

                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="After"
                            inputFormat="dd/MM/yyyy"
                            value={afterDate}
                            onChange={(newDate) => setAfterDate(newDate)}

                            renderInput={(params) => <TextField {...params} sx={{margin:1}}/>}
                        />
                        <DesktopDatePicker
                            label="Before"
                            inputFormat="dd/MM/yyyy"
                            value={beforeDate}
                            onChange={(newDate) => setBeforeDate(newDate)}
                            renderInput={(params) => <TextField {...params} sx={{margin:1}}/>}
                        />
                    </LocalizationProvider>
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <Box sx={{ width: 300 }}>
                        Set rating range:
                        <Slider
                            // getAriaLabel={() => 'Rating range'}
                            value={ratingRange}
                            min={0}
                            max={5}
                            onChange={handleRatingChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={ratingValuetext}
                        />
                        <Box sx={{display:"flex", justifyContent:"space-between"}}>
                            <div>{ratingRange[0]}</div>
                            <div>{ratingRange[1]}</div>
                        </Box>
                    </Box>
                </TabPanel>
            </Box>
            <Button variant="contained" sx={{mt:"10px", ml:"10px"}} onClick={() => applyFilters()} >Apply filters</Button>
            <Button sx={{mt:"10px", ml:"10px"}} onClick={() => resetFilters()} >Reset</Button>
            </Box>
        </Modal>
    )
}

export default Filters;