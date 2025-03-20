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
import { Child } from '../types';
import { getChildren, createChild, updateChild, deleteChild } from '../services/api';

const ChildrenPage: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentChild, setCurrentChild] = useState<Child | null>(null);
  const [childName, setChildName] = useState('');
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await getChildren();
      setChildren(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch children');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setChildName('');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (child: Child) => {
    setDialogMode('edit');
    setCurrentChild(child);
    setChildName(child.name);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setChildName('');
    setCurrentChild(null);
  };

  const handleOpenDeleteDialog = (child: Child) => {
    setChildToDelete(child);
    setOpenConfirmDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenConfirmDialog(false);
    setChildToDelete(null);
  };

  const handleSubmitChild = async () => {
    try {
      if (!childName.trim()) {
        setError('Child name is required');
        return;
      }

      if (dialogMode === 'add') {
        await createChild({ name: childName });
      } else if (dialogMode === 'edit' && currentChild) {
        await updateChild(currentChild.id, { name: childName });
      }

      handleCloseDialog();
      fetchChildren();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save child');
    }
  };

  const handleDeleteChild = async () => {
    try {
      if (childToDelete) {
        await deleteChild(childToDelete.id);
        handleCloseDeleteDialog();
        fetchChildren();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete child');
    }
  };

  return (
    <Box>
      <PageTitle title="Children" subtitle="Manage children profiles" />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Children List</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Child
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>Loading children...</Typography>
      ) : children.length === 0 ? (
        <Typography>No children found. Add your first child!</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {children.map((child) => (
                <TableRow key={child.id}>
                  <TableCell>{child.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(child)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(child)}
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

      {/* Add/Edit Child Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Child' : 'Edit Child'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Child Name"
            type="text"
            fullWidth
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitChild} color="primary">
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={openConfirmDialog}
        title="Delete Child"
        message={`Are you sure you want to delete the child "${childToDelete?.name}"?`}
        onConfirm={handleDeleteChild}
        onCancel={handleCloseDeleteDialog}
      />
    </Box>
  );
};

export default ChildrenPage;
