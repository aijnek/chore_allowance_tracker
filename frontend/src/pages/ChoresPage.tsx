import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageTitle from '../components/PageTitle';
import ConfirmDialog from '../components/ConfirmDialog';
import { Chore } from '../types';
import { getChores, createChore, updateChore, deleteChore } from '../services/api';

const ChoresPage: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentChore, setCurrentChore] = useState<Chore | null>(null);
  const [choreName, setChoreName] = useState('');
  const [chorePrice, setChorePrice] = useState('');
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [choreToDelete, setChoreToDelete] = useState<Chore | null>(null);

  useEffect(() => {
    fetchChores();
  }, []);

  const fetchChores = async () => {
    try {
      setLoading(true);
      const data = await getChores();
      setChores(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chores');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setChoreName('');
    setChorePrice('');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (chore: Chore) => {
    setDialogMode('edit');
    setCurrentChore(chore);
    setChoreName(chore.name);
    setChorePrice(chore.price.toString());
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setChoreName('');
    setChorePrice('');
    setCurrentChore(null);
  };

  const handleOpenDeleteDialog = (chore: Chore) => {
    setChoreToDelete(chore);
    setOpenConfirmDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenConfirmDialog(false);
    setChoreToDelete(null);
  };

  const handleSubmitChore = async () => {
    try {
      if (!choreName.trim()) {
        setError('Chore name is required');
        return;
      }

      const price = parseFloat(chorePrice);
      if (isNaN(price) || price <= 0) {
        setError('Price must be a positive number');
        return;
      }

      if (dialogMode === 'add') {
        await createChore({ name: choreName, price });
      } else if (dialogMode === 'edit' && currentChore) {
        await updateChore(currentChore.id, { name: choreName, price });
      }

      handleCloseDialog();
      fetchChores();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save chore');
    }
  };

  const handleDeleteChore = async () => {
    try {
      if (choreToDelete) {
        await deleteChore(choreToDelete.id);
        handleCloseDeleteDialog();
        fetchChores();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chore');
    }
  };

  return (
    <Box>
      <PageTitle title="Chores" subtitle="Manage chores and their prices" />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Chore List</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Chore
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>Loading chores...</Typography>
      ) : chores.length === 0 ? (
        <Typography>No chores found. Add your first chore!</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chores.map((chore) => (
                <TableRow key={chore.id}>
                  <TableCell>{chore.name}</TableCell>
                  <TableCell align="right">¥{chore.price}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(chore)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(chore)}
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

      {/* Add/Edit Chore Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Chore' : 'Edit Chore'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chore Name"
            type="text"
            fullWidth
            value={choreName}
            onChange={(e) => setChoreName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={chorePrice}
            onChange={(e) => setChorePrice(e.target.value)}
            inputProps={{ min: 0, step: 10 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitChore} color="primary">
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={openConfirmDialog}
        title="Delete Chore"
        message={`Are you sure you want to delete the chore "${choreToDelete?.name}"?`}
        onConfirm={handleDeleteChore}
        onCancel={handleCloseDeleteDialog}
      />
    </Box>
  );
};

export default ChoresPage;
