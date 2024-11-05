// react
import * as React from 'react';
// react-router
import { Link } from 'react-router-dom';
// mui
import {
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, TableSortLabel, Paper
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// prop-types
import PropTypes from 'prop-types';


const headCells = [
    {
        id: 'funding_year',
        numeric: false,
        disablePadding: false,
        label: 'Funding Year',
    },
    {
        id: 'project_type',
        numeric: false,
        disablePadding: false,
        label: 'Project Type',
    },
    {
        id: 'pi_name',
        numeric: false,
        disablePadding: false,
        label: 'Principal Investigator',
    },
    {
        id: 'project_faculty',
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
        id: 'project_year',
        numeric: false,
        disablePadding: false,
        label: 'Project Year',
    },
    {
        id: 'funding_amount',
        numeric: false,
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
                                    fontWeight: 700
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
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

export default function ProjectTable({ projects }) {
    const path = window.location.pathname;
    const [order, setOrder] = React.useState('asc'); // sort ascending by default
    // 'funding_year', 'title'
    const [orderBy, setOrderBy] = React.useState('pi_name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projects.length) : 0;
        const project_lists = projects.map(project => {
        const parts = project.id.split('-');
        const newAttribute = [parts[1], parts[3], parts[4], parts[2]].join('-'); 
          
        return {
            ...project,           // Spread existing object properties
               proj_sort_key: newAttribute // Add the new attribute with custom ID
            };
        })

    const visibleProjects = React.useMemo(
        () =>            
            project_lists.sort((p1, p2) => {
                const aVal = p1[orderBy]
                const bVal = p2[orderBy]
                
                // sort by the primary sorting key (column) first
                let sort_cond1 = null
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    // String comparison in descending order
                    sort_cond1 = order === "asc" ? aVal.localeCompare(bVal) : -aVal.localeCompare(bVal)
                } else if (typeof aVal === 'number' && typeof bVal === 'number') {
                    // Number comparison in descending order
                    sort_cond1 = order === "asc" ? bVal - aVal : -(bVal - aVal)
                }
                
                // then sort by a second condition
                const sort_cond2 = p1.proj_sort_key.localeCompare(p2.proj_sort_key)

                return sort_cond1 || sort_cond2
            })
            .slice(
                rowsPerPage === -1 ? 0 : page * rowsPerPage,
                rowsPerPage === -1 ? projects.length : page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, project_lists, projects.length],
    );

    return (
        <Box sx={{ maxWidth: '100%', m: 2 }}>
            <Paper sx={{ maxWidth: '100%', mb: 2 }}>
                <TableContainer sx={{ width: "100%" }}>
                    <Table
                        sx={{ width: "100%" }}
                        aria-labelledby="tableTitle"
                        size='small'
                        padding='normal'
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleProjects
                            .map((project, index) => {
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
                                            sx={{ height: "5rem", maxWidth: "10%" }}
                                        >
                                            {project.funding_year}
                                        </TableCell>
                                        <TableCell align="left" sx={{ height: "5rem", maxWidth: "5%" }}>{project.project_type}</TableCell>
                                        <TableCell align="left" sx={{ height: "5rem", maxWidth: "10%" }}>{project.pi_name}</TableCell>
                                        <TableCell align="left" sx={{ height: "5rem", maxWidth: "5%" }}>{project.project_faculty}</TableCell>
                                        <TableCell align="left" sx={{ height: "5rem", maxWidth: "35%" }}>
                                            <Link to={`${path.includes('staging') ? '/staging' : ''}/summary/${project.id}`}>{project.title}</Link>
                                        </TableCell>
                                        <TableCell align="left" sx={{ height: "5rem", maxWidth: "10%" }}>{project.project_year}</TableCell>
                                        <TableCell align="left" sx={{ height: "5rem", maxWidth: "10%" }}>{formattedAmount(project.funding_amount)}</TableCell>
                                        <TableCell align="left" sx={{ height: "5rem", maxWidth: "5%", color: project.status === "Active" ? "#64b53c" : "#d4734c" }}>{project.status}</TableCell>
                                        <TableCell align="left" sx={{ height: "5rem", maxWidth: "5%" }}>
                                            {project.report ? <a href={project.report} target='_blank' rel='noreferrer'>Report</a> : 'N/A'}
                                        </TableCell>
                                        <TableCell align="left" sx={{ height: "5rem", maxWidth: "5%" }}>
                                            {
                                                project.poster ?
                                                    <a href={project.poster} target='_blank' rel='noreferrer' style={{ cursor: 'pointer' }}>
                                                        <img src={project.poster} style={{ width: "100%", height: "auto" }} />
                                                    </a>
                                                    : "N/A"
                                            }
                                        </TableCell>
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
                    sx={{
                        height: "4rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end"
                    }}
                />
            </Paper>
        </Box>
    );
}