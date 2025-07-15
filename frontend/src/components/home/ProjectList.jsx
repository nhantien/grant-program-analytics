import React, { useMemo, useState } from 'react';
import { Box, Paper, Typography, Stack, Link, IconButton, Select, MenuItem, FormControl, TableSortLabel } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';


// Header component updated with sorting controls on every column
function ProjectListHeader({ order, orderBy, onRequestSort }) {
  const headerStyles = {
    fontWeight: 'bold',
    color: 'white',
  };

  const flexStyles = {
    funding_year: { flex: '1 1 10%' },
    project_type: { flex: '1 1 8%' },
    pi: { flex: '1 1 15%' },
    faculty: { flex: '1 1 12%' },
    title: { flex: '1 1 25%' },
    project_year: { flex: '1 1 5%' },
    amount: { flex: '1 1 8%' },
    status: { flex: '1 1 8%' },
    report: { flex: '1 1 8%' },
    poster: { flex: '0 0 120px' },
  };

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  // Configuration for all header cells to make them sortable
  const headCells = [
    { id: 'funding_year', label: 'Funding Year', style: flexStyles.funding_year },
    { id: 'project_type', label: 'Project Type', style: flexStyles.project_type },
    { id: 'pi_name', label: 'Principal Investigator', style: flexStyles.pi },
    { id: 'project_faculty', label: 'Faculty', style: flexStyles.faculty },
    { id: 'title', label: 'Title', style: flexStyles.title },
    { id: 'project_year', label: 'Project Year', style: flexStyles.project_year },
    { id: 'funding_amount', label: 'Amount', style: flexStyles.amount },
    { id: 'status', label: 'Status', style: flexStyles.status },
    { id: 'report', label: 'Report', style: flexStyles.report },
    { id: 'poster', label: 'Poster', style: flexStyles.poster },
  ];

  return (
    <Paper sx={{ display: 'flex', p: 2, backgroundColor: '#081252', gap: 2 }}>
      {headCells.map((headCell) => (
        <Box key={headCell.id} sx={headCell.style}>
          <TableSortLabel
            active={orderBy === headCell.id}
            direction={orderBy === headCell.id ? order : 'asc'}
            onClick={createSortHandler(headCell.id)}
            sx={{ '& .MuiTableSortLabel-icon': { color: 'white !important' } }}
          >
            <Typography sx={headerStyles}>{headCell.label}</Typography>
            {orderBy === headCell.id ? <Box component="span" sx={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box> : null}
          </TableSortLabel>
        </Box>
      ))}
    </Paper>
  );
}


// Custom pagination component remains the same
function CustomPaginationControls({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) {
    const handleBackButtonClick = () => {
        onPageChange(null, page - 1);
    };

    const handleNextButtonClick = () => {
        onPageChange(null, page + 1);
    };

    const from = count === 0 ? 0 : page * rowsPerPage + 1;
    const to = rowsPerPage === -1 ? count : Math.min(count, (page + 1) * rowsPerPage);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2, gap: 2 }}>
            <Typography variant="body2">Rows per page:</Typography>
            <FormControl sx={{ minWidth: 60 }}>
                <Select
                    value={rowsPerPage}
                    onChange={onRowsPerPageChange}
                    variant="standard"
                    sx={{ '.MuiSelect-select': { p: 0.5 } }}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={-1}>All</MenuItem>
                </Select>
            </FormControl>
            <Typography variant="body2" sx={{ mx: 2 }}>{from}–{to} of {count}</Typography>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page"><KeyboardArrowLeft /></IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1 && rowsPerPage !== -1}
                aria-label="next page"
            ><KeyboardArrowRight /></IconButton>
        </Box>
    );
}


// Main component's sorting logic already supports this
export default function ProjectList({ projects }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('pi_name');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0); // Reset to first page after sorting
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedAndGroupedProjects = useMemo(() => {
    const groups = projects.reduce((acc, p) => {
      const key = `${p.pi_name}|${p.title}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(p);
      return acc;
    }, {});

    const groupedArray = Object.values(groups);
    
    // sort entries in subarrays by funding_year
    groupedArray.forEach(subarray => {
      subarray.sort((a, b) => {
        const valA = a.funding_year || '';
        const valB = b.funding_year || '';
        return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    });

    // This logic already works for any column by checking the first item in each group.
    groupedArray.sort((a, b) => {
      const valA = a[0][orderBy] || '';
      const valB = b[0][orderBy] || '';

      // Handle numeric sorting for amount
      if (orderBy === 'funding_amount') {
        const numA = parseFloat(valA) || 0;
        const numB = parseFloat(valB) || 0;
        return order === 'asc' ? numA - numB : numB - numA;
      }

      // Default to string comparison
      return order === 'asc'
      ? valA.toString().localeCompare(valB.toString(), undefined, { sensitivity: 'base' })
      : valB.toString().localeCompare(valA.toString(), undefined, { sensitivity: 'base' });
    });

    return groupedArray;
  }, [projects, order, orderBy]);

  const flexStyles = {
    funding_year: { flex: '1 1 10%', pr: 1 },
    project_type: { flex: '1 1 8%', pr: 1 },
    pi: { flex: '1 1 15%', pr: 1 },
    faculty: { flex: '1 1 12%', pr: 1 },
    title: { flex: '1 1 25%', pr: 1 },
    project_year: { flex: '1 1 5%', pr: 1 },
    amount: { flex: '1 1 8%', pr: 1 },
    status: { flex: '1 1 8%', pr: 1 },
    report: { flex: '1 1 8%', pr: 1 },
    poster: { flex: '0 0 120px' },
  };

  const paginatedGroups = useMemo(() =>
    rowsPerPage > 0
      ? sortedAndGroupedProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedAndGroupedProjects,
    [sortedAndGroupedProjects, page, rowsPerPage]
  );

  return (
    <Stack>
      <ProjectListHeader
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
      />
      {paginatedGroups.map((group, groupIndex) => (
        <Paper
          key={`${group[0].project_id}-${groupIndex}`}
          sx={{
            p: 2,
            borderTop: '1px solid #ddd',
            borderRadius: 0,
            backgroundColor: (page * rowsPerPage + groupIndex) % 2 === 0 ? 'white' : '#DFF2FF',
          }}
        >
          {group.map((project, grantIndex) => {
            const isFirstInGroup = grantIndex === 0;
            return (
              <Box key={project.id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: grantIndex < group.length - 1 ? 2 : 0 }}>
                <Typography sx={flexStyles.funding_year}>{project.funding_year}</Typography>
                <Typography sx={flexStyles.project_type}>{project.project_type}</Typography>
                <Box sx={flexStyles.pi}>{isFirstInGroup && <Typography>{project.pi_name}</Typography>}</Box>
                <Box sx={flexStyles.faculty}>{isFirstInGroup && <Typography>{project.project_faculty}</Typography>}</Box>
                <Box sx={flexStyles.title}>
                  {isFirstInGroup && <Link href={`/summary/${project.id}`} underline="hover" target="_blank" rel="noopener noreferrer">{project.title || "Title Not Available"}</Link>}
                </Box>
                <Typography sx={flexStyles.project_year}>{project.project_year}</Typography>
                <Typography sx={{ ...flexStyles.amount, color: "green" }}>{parseInt(project.funding_amount).toLocaleString("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0 })}</Typography>
                <Typography sx={{ ...flexStyles.status, color: project.status === "Active" ? "#1976d2" : "#6c757d" }}>{project.status}</Typography>
                <Typography sx={flexStyles.report}>{project.report ? <a href={project.report} target='_blank' rel='noreferrer'>Report</a> : ""}</Typography>
                <Box sx={flexStyles.poster}>{isFirstInGroup && project.poster && <a href={project.poster} target='_blank' rel='noreferrer' style={{ cursor: 'pointer' }}><img src={project.poster} style={{ width: "100%", height: "auto" }} alt="Project Poster"/></a>}</Box>
              </Box>
            );
          })}
        </Paper>
      ))}
      <CustomPaginationControls
        count={sortedAndGroupedProjects.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Stack>
  );
}