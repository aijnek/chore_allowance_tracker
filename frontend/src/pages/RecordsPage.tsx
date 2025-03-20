import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageTitle from '../components/PageTitle';
import ConfirmDialog from '../components/ConfirmDialog';
import { Child, Chore, ChoreRecord, ChoreRecordWithDetails } from '../types';
import { 
  getRecords, 
  getChores, 
  getChildren, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from '../services/api';
import { formatDate, formatDateDisplay } from '../utils/dateUtils';

const RecordsPage: React.FC = () => {
  const [records, setRecords] = useState<ChoreRecordWithDetails[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentRecord, setCurrentRecord] = useState<ChoreRecord | null>(null);
  const [selectedChoreId, setSelectedChoreId] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<ChoreRecordWithDetails | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsData, choresData, childrenData] = await Promise.all([
        getRecords(),
        getChores(),
        getChildren(),
      ]);
      
      // Create a map for quick lookups
      const choresMap = new Map(choresData.map(chore => [chore.id, chore]));
      const childrenMap = new Map(childrenData.map(child => [child.id, child]));
      
      // Enhance records with chore and child details
      const enhancedRecords = recordsData.map(record => {
        const chore = choresMap.get(record.choreId);
        const child = childrenMap.get(record.childId);
        
        return {
          ...record,
          choreName: chore?.name || 'Unknown Chore',
          childName: child?.name || 'Unknown Child',
          price: chore?.price || 0,
        };
      });
      
      setRecords(enhancedRecords);
      setChores(choresData);
      setChildren(childrenData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setSelectedChoreId(chores.length > 0 ? chores[0].id : '');
    setSelectedChildId(children.length > 0 ? children[0].id : '');
    setSelectedDate(new Date());
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (record: ChoreRecordWithDetails) => {
    setDialogMode('edit');
    setCurrentRecord(record);
    setSelectedChoreId(record.choreId);
    setSelectedChildId(record.childId);
    setSelectedDate(new Date(record.date));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedChoreId('');
    setSelectedChildId('');
    setSelectedDate(null);
    setCurrentRecord(null);
  };

  const handleOpenDeleteDialog = (record: ChoreRecordWithDetails) => {
    setRecordToDelete(record);
    setOpenConfirmDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenConfirmDialog(false);
    setRecordToDelete(null);
  };

  const handleSubmitRecord = async () => {
    try {
      if (!selectedChoreId) {
        setError('Chore is required');
        return;
      }

      if (!selectedChildId) {
        setError('Child is required');
        return;
      }

      if (!selectedDate) {
        setError('Date is required');
        return;
      }

      const recordData = {
        choreId: selectedChoreId,
        childId: selectedChildId,
        date: formatDate(selectedDate.toISOString()),
      };

      if (dialogMode === 'add') {
        await createRecord(recordData);
      } else if (dialogMode === 'edit' && currentRecord) {
        await updateRecord(currentRecord.id, recordData);
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save record');
    }
  };

  const handleDeleteRecord = async () => {
    try {
      if (recordToDelete) {
        await deleteRecord(recordToDelete.id);
        handleCloseDeleteDialog();
        fetchData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
    }
  };

  return (
    <Box>
      <PageTitle title="Chore Records" subtitle="Track completed chores" />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Records List</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          disabled={chores.length === 0 || children.length === 0}
        >
          Add Record
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {chores.length === 0 || children.length === 0 ? (
        <Typography>
          {chores.length === 0 ? 'Please add chores before creating records. ' : ''}
          {children.length === 0 ? 'Please add children before creating records.' : ''}
        </Typography>
      ) : loading ? (
        <Typography>Loading records...</Typography>
      ) : records.length === 0 ? (
        <Typography>No records found. Add your first record!</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Child</TableCell>
                <TableCell>Chore</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDateDisplay(record.date)}</TableCell>
                  <TableCell>{record.childName}</TableCell>
                  <TableCell>{record.choreName}</TableCell>
                  <TableCell align="right">¥{record.price}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(record)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(record)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Record Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Record' : 'Edit Record'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="chore-select-label">Chore</InputLabel>
            <Select
              labelId="chore-select-label"
              value={selectedChoreId}
              label="Chore"
              onChange={(e) => setSelectedChoreId(e.target.value)}
            >
              {chores.map((chore) => (
                <MenuItem key={chore.id} value={chore.id}>
                  {chore.name} (¥{chore.price})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="child-select-label">Child</InputLabel>
            <Select
              labelId="child-select-label"
              value={selectedChildId}
              label="Child"
              onChange={(e) => setSelectedChildId(e.target.value)}
            >
              {children.map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2 }}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitRecord} color="primary">
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={openConfirmDialog}
        title="Delete Record"
        message={`Are you sure you want to delete this record?`}
        onConfirm={handleDeleteRecord}
        onCancel={handleCloseDeleteDialog}
      />
    </Box>
  );
};

export default RecordsPage;
