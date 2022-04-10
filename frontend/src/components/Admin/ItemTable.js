import * as React from 'react';
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
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
    const createdOn = formatDate(new Date(row.createdOn))
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
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                    {row.itemName}
                </Typography>
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
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
        </React.Fragment>
    );
}

export default function ItemTable(props) {
    const [visibleRows, setVisibleRows] = React.useState(props.rows)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    };
    
    const getVisibleRows = () => {
        let start = page * rowsPerPage;
        let newRows = props.rows.slice(start, start + rowsPerPage)      
        console.log(newRows,"new rows")  
        setVisibleRows(newRows)
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
                </TableRow>
                </TableHead>
                <TableBody>
                {visibleRows.map((row) => (
                    <Row key={row.itemName} row={row} />
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={props.rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
}
