// src/components/FolderNameModal.js
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

function FolderNameModal({ open, onClose, onSave }) {
  const [folderName, setFolderName] = useState('');

  const handleSave = () => {
    onSave(folderName);
    setFolderName('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter Folder Name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Folder Name"
          fullWidth
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FolderNameModal;
