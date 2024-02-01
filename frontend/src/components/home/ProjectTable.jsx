import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { Link } from 'react-router-dom';

function createData(id, name, calories, fat, carbs, protein) {
    return {
        id,
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(2, 'Donut', 452, 25.0, 51, 4.9),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'fundingYear',
        numeric: false,
        disablePadding: false,
        label: 'Funding Year',
    },
    {
        id: 'projectType',
        numeric: false,
        disablePadding: false,
        label: 'Project Type',
    },
    {
        id: 'investigator',
        numeric: false,
        disablePadding: false,
        label: 'Principal Investigator',
    },
    {
        id: 'faculty',
        numeric: false,
        disablePadding: false,
        label: 'Faculty',
    },
    {
        id: 'title',
        numeric: false,
        disablePadding: false,
        label: 'Title',
    },
    {
        id: 'projectYear',
        numeric: true,
        disablePadding: false,
        label: 'Project Year',
    },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'Amount',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'report',
        numeric: false,
        disablePadding: false,
        label: 'Report',
    },
    {
        id: 'poster',
        numeric: false,
        disablePadding: false,
        label: 'Poster',
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ backgroundColor: "#081252" }}>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding="normal"
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ color: "white", fontWeight: 700, height: "3rem" }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            sx={{
                                padding: "0",
                                width: "100%",
                                color: "white",
                                fontWeight: 400,
                                height: "3rem",
                                "&.Mui-active": {
                                    color: "white",
                                    fontWeight: 700,
                                },
                                "& .MuiTableSortLabel-icon": {
                                    color: "white !important",
                                },
                            }}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            <Typography
                sx={{ 
                    flex: '1 1 100%',
                    fontSize: "1.5rem",
                    fontWeight: 600 
                }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                TLEF Funded Projects
            </Typography>
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function ProjectTable({ projects }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('fundingYear');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(-1);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const val = event.target.value;
        if (val === "All") {
            setRowsPerPage(-1);
        } else {
            setRowsPerPage(parseInt(event.target.value, 10));
        }
        setPage(0);
    };

    const formattedAmount = (amount) => {
        return parseInt(amount).toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
            minimumFractionDigits: 0
        });
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleProjects = React.useMemo(
        () =>
            stableSort(projects, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size='small'
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleProjects.map((project, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        onClick={(event) => handleClick(event, project.id)}
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={project.id}
                                        sx={{
                                            cursor: 'pointer',
                                            "&.MuiTableRow-root": {
                                                '&:nth-of-type(odd)': {
                                                    backgroundColor: "#DFF2FF"
                                                },
                                            }
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="normal"
                                            sx={{ height: "3rem" }}
                                        >
                                            {project.fundingYear}
                                        </TableCell>
                                        <TableCell align="left" sx={{ height: "3rem" }}>{project.type}</TableCell>
                                        <TableCell align="left" sx={{ height: "3rem" }}>{project.investigator}</TableCell>
                                        <TableCell align="left" sx={{ height: "3rem" }}>{project.faculty}</TableCell>
                                        <TableCell align="left" sx={{ height: "3rem" }}><Link to={`/summary/${project.id}`}>{project.title}</Link></TableCell>
                                        <TableCell align="right" sx={{ height: "3rem" }}>{project.projectYear}</TableCell>
                                        <TableCell align="right" sx={{ height: "3rem" }}>{formattedAmount(project.amount)}</TableCell>
                                        <TableCell align="left" sx={{ height: "3rem", color: project.status === "Active\r" ? "#d4734c" : "#64b53c" }}>{project.status}</TableCell>
                                        <TableCell align="left" sx={{ height: "3rem" }}> <a href="#">report</a> </TableCell>
                                        <TableCell align="left" sx={{ height: "3rem" }}> <a href="#">poster</a></TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 33 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[
                        { label: '5', value: 5 },
                        { label: '10', value: 10 },
                        { label: '20', value: 20 },
                        { label: 'All', value: -1 }
                    ]}
                    component="div"
                    count={projects.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Displayed per page"
                />
            </Paper>
        </Box>
    );
}