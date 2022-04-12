import React, { useState, useEffect } from 'react';
import { Grid, Button, Box } from "@mui/material";
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
    const [value, setValue] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [totalPriceRange, setTotalPriceRange] = useState([0, 100]);
    const [categories, setCategories] = useState([]);
    const [beforeDate, setBeforeDate] = useState(new Date('2020-01-01'));
    const [afterDate, setAfterDate] = useState(new Date());


    const setInitialSlider = () => {
        if(props.tempItems.length > 0)
        {
            let min = props.tempItems[0].price;
            let max = props.tempItems[0].price;
            for(let i = 0; i < props.tempItems.length; i++)
            {
                if(Number(props.tempItems[i].price) < min )
                {
                    min = Number(props.tempItems[i].price);
                }
                if(props.tempItems[i].price > max)
                {
                    max = Number(props.tempItems[i].price);
                }
            }
            setTotalPriceRange([min, max]);
            setPriceRange([min, max]);
            console.log(min, max)
        }
    }

    useEffect(() => {
        setInitialSlider();
        setCategories([ ...new Set(props.tempItems.map((item) => item.category))]);

    }, [props.tempItems])
    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Price" {...a11yProps(0)} />
                    <Tab label="Category" {...a11yProps(1)} />
                    <Tab label="Date" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
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
                <TabPanel value={value} index={1}>
                <FormGroup>
                    { categories && categories.map((category, index) => {
                        return <FormControlLabel control={<Checkbox defaultChecked />} label={category} />
                    })}                    
                </FormGroup>

                </TabPanel>
                <TabPanel value={value} index={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="After"
                            inputFormat="dd/MM/yyyy"
                            value={beforeDate}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} sx={{margin:1}}/>}
                        />
                        <DesktopDatePicker
                            label="Before"
                            inputFormat="dd/MM/yyyy"
                            value={afterDate}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} sx={{margin:1}}/>}
                        />
                    </LocalizationProvider>
                </TabPanel>
            </Box>
            <Button variant="contained" sx={{mt:"10px", ml:"20px",height:"70%"}} onClick={() => props.setOpenFilter(false)} >Done</Button>
            </Box>
        </Modal>
    )
}

export default Filters;