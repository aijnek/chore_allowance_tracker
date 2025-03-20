import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import PageTitle from '../components/PageTitle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, linkTo }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', mb: 2, color: 'primary.main' }}>
          {icon}
        </Box>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          component={RouterLink}
          to={linkTo}
          variant="contained"
          color="primary"
          fullWidth
        >
          Go to {title}
        </Button>
      </Box>
    </Card>
  );
};

const HomePage: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      title: 'Chores',
      description: 'Manage chore definitions and their prices. Add, edit, or remove chores as needed.',
      icon: <AssignmentIcon fontSize="large" />,
      linkTo: '/chores',
    },
    {
      title: 'Children',
      description: 'Manage children profiles. Add, edit, or remove children from the system.',
      icon: <ChildCareIcon fontSize="large" />,
      linkTo: '/children',
    },
    {
      title: 'Records',
      description: 'Record completed chores with child and date information. Track who did what and when.',
      icon: <PlaylistAddCheckIcon fontSize="large" />,
      linkTo: '/records',
    },
    {
      title: 'Allowances',
      description: 'View monthly allowance calculations for each child based on completed chores.',
      icon: <MonetizationOnIcon fontSize="large" />,
      linkTo: '/allowances',
    },
  ];

  return (
    <Box>
      <PageTitle 
        title="Chore Allowance Tracker" 
        subtitle="Track chores and calculate monthly allowances for children" 
      />
      
      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item key={feature.title} xs={12} sm={6} md={3}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
