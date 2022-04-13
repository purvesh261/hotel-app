import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ItemImageList from './ItemImages';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AlertSnackbar from '../AlertSnackbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function formatDate(date) {
    const dateMonth = date.getMonth() + 1;
    const monthString = dateMonth >= 10 ? dateMonth : `0${dateMonth}`;
    const dateDate = date.getDate();
    const dateString = dateDate >= 10 ? dateDate : `0${dateDate}`;
    return `${dateString}/${monthString}/${date.getFullYear()}`;
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [imgData, setImgData] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const createdOn = formatDate(new Date(row.createdOn));
    const [snackbar, setSnackbar] = React.useState({ message:"", severity:"" });
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const navigate = useNavigate();
    
    const deleteItem = async () => {
        try{
            var res = await axios.delete(`http://localhost:5000/items/${row._id}`,
                {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
            setOpenDialog(false);
            setOpenSnackbar(true);
            setSnackbar({severity:"success", message:`${row.itemName} deleted!`});
            props.removeRow();
        }
        catch(err) {
            if (err.response && err.response.data) {
                setOpenSnackbar(true);
                setSnackbar({severity:"error", message:err.response.data});
            }
        }
    }

    return (
        <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
            >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            </TableCell>
            <TableCell align="right">{row.itemName}</TableCell>
            <TableCell align="right">{"₹ " + row.price}</TableCell>
            <TableCell align="right">{row.category}</TableCell>
            <TableCell align="right">{createdOn}</TableCell>
            <TableCell align="right">
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate('/admin/edit/' + row._id)} sx={{mr:1}}>
                    Edit
                </Button>
                <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => setOpenDialog(true)}>
                    Delete
                </Button>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                    <Box sx={{display:"flex", justifyContent:"space-between"}}>
                        <Typography variant="h6" gutterBottom component="div">
                            {row.itemName}
                        </Typography>
                        <Button onClick={() => navigate('/items/' + row._id)}>Preview Item</Button>
                    </Box>
                <Typography variant="body2" noWrap color="text.secondary">
                    {row.description}
                </Typography>
                <Typography variant="body2" noWrap color="text.secondary">
                    Price: {"₹ " + row.price}
                </Typography>
                <Typography variant="body2" noWrap color="text.secondary">
                    Category: {row.category}
                </Typography>
                <Typography variant="body2" noWrap color="text.secondary">
                    Created on: {createdOn}
                </Typography>
                <Typography variant="body2" noWrap color="text.secondary">
                    Status: {row.status ? "Active": "Deleted"}
                </Typography>
                <ItemImageList itemData={row.image} setImgData={setImgData} id={row._id}/>
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
        <Dialog
            open={openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpenDialog(false)}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Delete " + row.itemName}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete this item?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={deleteItem} sx={{color:"red"}}>Delete</Button>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
        {openSnackbar && <AlertSnackbar open={openSnackbar} setOpenSnackbar={setOpenSnackbar} severity={snackbar.severity} message={snackbar.message}/>}
        </React.Fragment>
    );
}

export default function ItemTable(props) {
    const [visibleRows, setVisibleRows] = React.useState(props.rows)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    const removeRow = () => {
        props.getItems();
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    const getVisibleRows = () => {
        let start = page * rowsPerPage;
        let newRows = props.rows.slice(start, start + rowsPerPage);
        setVisibleRows(newRows);
    }

    React.useEffect(() => {
        getVisibleRows();
    }, [page, rowsPerPage, props.rows])

    return (
        <>
            <TableContainer component={Paper}>
            <Table aria-label="collapsible table" >
                <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Category</TableCell>
                    <TableCell align="right">Created On</TableCell>
                    <TableCell align="right">Actions
                    </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {visibleRows.map((row, index) => (
                    <Row key={index} row={row} removeRow={removeRow} index />
                ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={props.rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </TableContainer>
        </>
    );
}
