import React, { useMemo } from 'react';
import { Box, Paper, Typography, Stack, Link } from '@mui/material';

// Header component with reordered columns
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

// Main component with reordered data columns
export default function ProjectList({ projects }) {
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

  return (
    <Stack>
      <ProjectListHeader />
      {groupedProjects.map((group, groupIndex) => (
        <Paper
          key={`${group[0].project_id}-${groupIndex}`}
          sx={{
            p: 2,
            borderTop: '1px solid #ddd',
            borderRadius: 0,
            backgroundColor: groupIndex % 2 === 0 ? 'white' : '#DFF2FF',
          }}
        >
          {group.sort((a, b) => a.project_year - b.project_year).map((project, grantIndex) => {
            const isFirstInGroup = grantIndex === 0;

            return (
              <Box key={`${project.project_id}-${grantIndex}`} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: grantIndex < group.length - 1 ? 2 : 0 }}>
                {/* == Columns reordered to match header == */}
                <Typography sx={flexStyles.funding_year}>{project.funding_year}</Typography>
                <Typography sx={flexStyles.project_type}>{project.project_type}</Typography>
                
                <Box sx={flexStyles.pi}>
                  {isFirstInGroup && <Typography>{project.pi_name}</Typography>}
                </Box>
                <Box sx={flexStyles.faculty}>
                  {isFirstInGroup && <Typography>{project.project_faculty}</Typography>}
                </Box>
                <Box sx={flexStyles.title}>
                  {isFirstInGroup && (
                    <Link href={`/summary/${project.id}`} underline="hover" target="_blank" rel="noopener noreferrer">
                      {project.title || "Title Not Available"}
                    </Link>
                  )}
                </Box>

                <Typography sx={flexStyles.project_year}>{project.project_year}</Typography>
                <Typography sx={{...flexStyles.amount, color: "green" }}>
                  {parseInt(project.funding_amount).toLocaleString("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0 })}
                </Typography>
                <Typography sx={{ ...flexStyles.status, color: project.status === "Active" ? "#1976d2" : "#6c757d" }}>
                  {project.status}
                </Typography>
                <Typography sx={flexStyles.report}>
                  {project.report ? <a href={project.report} target='_blank' rel='noreferrer'>Report</a> : ""}
                </Typography>
                
                <Box sx={flexStyles.poster}>
                    {isFirstInGroup && project.poster && (
                        <a href={project.poster} target='_blank' rel='noreferrer' style={{ cursor: 'pointer' }}>
                            <img src={project.poster} style={{ width: "100%", height: "auto" }} alt="Project Poster"/>
                        </a>
                    )}
                </Box>
              </Box>
            );
          })}
        </Paper>
      ))}
    </Stack>
  );
}