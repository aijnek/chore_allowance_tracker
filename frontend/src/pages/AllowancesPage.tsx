import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PageTitle from '../components/PageTitle';
import { Allowance } from '../types';
import { getAllowances } from '../services/api';
import { getCurrentMonth, getCurrentYear, getMonthOptions, getYearOptions } from '../utils/dateUtils';

const AllowancesPage: React.FC = () => {
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  
  const monthOptions = getMonthOptions();
  const yearOptions = getYearOptions();

  useEffect(() => {
    fetchAllowances();
  }, [selectedMonth, selectedYear]);

  const fetchAllowances = async () => {
    try {
      setLoading(true);
      const data = await getAllowances(selectedMonth, selectedYear);
      setAllowances(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch allowances');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageTitle title="Monthly Allowances" subtitle="View allowance calculations for each child" />

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="month-select-label">Month</InputLabel>
          <Select
            labelId="month-select-label"
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthOptions.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {yearOptions.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>Loading allowances...</Typography>
      ) : allowances.length === 0 ? (
        <Typography>No allowance data found for the selected month and year.</Typography>
      ) : (
        <Grid container spacing={3}>
          {allowances.map((allowance) => (
            <Grid item xs={12} md={6} key={allowance.childId}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {allowance.childName}
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    ¥{allowance.amount}
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Chore Breakdown:
                  </Typography>
                  
                  {allowance.records.length === 0 ? (
                    <Typography>No chores completed this month.</Typography>
                  ) : (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Chore</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Count</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {allowance.records.map((record) => (
                            <TableRow key={record.choreId}>
                              <TableCell>{record.choreName}</TableCell>
                              <TableCell align="right">¥{record.price}</TableCell>
                              <TableCell align="right">{record.count}</TableCell>
                              <TableCell align="right">¥{record.subtotal}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                              Total:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              ¥{allowance.amount}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AllowancesPage;
