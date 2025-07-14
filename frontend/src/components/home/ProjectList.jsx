import React, { useMemo, useState } from 'react';
import { Box, Paper, Typography, Stack, Link, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

// The ProjectListHeader component remains the same.
function ProjectListHeader() {
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

  return (
    <Paper sx={{ display: 'flex', p: 2, backgroundColor: '#081252', gap: 2 }}>
      <Typography sx={{ ...headerStyles, ...flexStyles.funding_year }}>Funding Year</Typography>
      <Typography sx={{ ...headerStyles, ...flexStyles.project_type }}>Project Type</Typography>
      <Typography sx={{ ...headerStyles, ...flexStyles.pi }}>Principal Investigator</Typography>
      <Typography sx={{ ...headerStyles, ...flexStyles.faculty }}>Faculty</Typography>
      <Typography sx={{ ...headerStyles, ...flexStyles.title }}>Title</Typography>
      <Typography sx={{ ...headerStyles, ...flexStyles.project_year }}>Project Year</Typography>
      <Typography sx={{ ...headerStyles, ...flexStyles.amount }}>Amount</Typography>
      <Typography sx={{ ...headerStyles, ...flexStyles.status }}>Status</Typography>
      <Typography sx={{ ...headerStyles, ...flexStyles.report }}>Report</Typography>
      <Typography sx={{ ...headerStyles, ...flexStyles.poster }}>Poster</Typography>
    </Paper>
  );
}


// A new, custom pagination component
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
          sx={{'.MuiSelect-select': {p:0.5}}}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={-1}>All</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="body2" sx={{ mx: 2 }}>
        {from}–{to} of {count}
      </Typography>

      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1 && rowsPerPage !== -1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
}


// Main component using the new custom pagination
export default function ProjectList({ projects }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const groupedProjects = useMemo(() => {
    const groups = projects.reduce((acc, p) => {
      const key = `${p.pi_name}|${p.title}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(p);
      return acc;
    }, {});
    return Object.values(groups);
  }, [projects]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      ? groupedProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : groupedProjects,
    [groupedProjects, page, rowsPerPage]
  );

  return (
    <Stack>
      <ProjectListHeader />
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
          {group.sort((a, b) => parseInt(a.project_year, 10) - parseInt(b.project_year, 10)).map((project, grantIndex) => {
            const isFirstInGroup = grantIndex === 0;

            return (
              <Box key={`${project.project_id}-${grantIndex}`} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: grantIndex < group.length - 1 ? 2 : 0 }}>
                {/* == Columns == */}
                <Typography sx={flexStyles.funding_year}>{project.funding_year}</Typography>
                <Typography sx={flexStyles.project_type}>{project.project_type}</Typography>
                <Box sx={flexStyles.pi}>{isFirstInGroup && <Typography>{project.pi_name}</Typography>}</Box>
                <Box sx={flexStyles.faculty}>{isFirstInGroup && <Typography>{project.project_faculty}</Typography>}</Box>
                <Box sx={flexStyles.title}>
                  {isFirstInGroup && <Link href={`/summary/${project.id}`} underline="hover" target="_blank" rel="noopener noreferrer">{project.title || "Title Not Available"}</Link>}
                </Box>
                <Typography sx={flexStyles.project_year}>{project.project_year}</Typography>
                <Typography sx={{...flexStyles.amount, color: "green" }}>{parseInt(project.funding_amount).toLocaleString("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0 })}</Typography>
                <Typography sx={{ ...flexStyles.status, color: project.status === "Active" ? "#1976d2" : "#6c757d" }}>{project.status}</Typography>
                <Typography sx={flexStyles.report}>{project.report ? <a href={project.report} target='_blank' rel='noreferrer'>Report</a> : ""}</Typography>
                <Box sx={flexStyles.poster}>{isFirstInGroup && project.poster && <a href={project.poster} target='_blank' rel='noreferrer' style={{ cursor: 'pointer' }}><img src={project.poster} style={{ width: "100%", height: "auto" }} alt="Project Poster"/></a>}</Box>
              </Box>
            );
          })}
        </Paper>
      ))}
      <CustomPaginationControls
        count={groupedProjects.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Stack>
  );
}