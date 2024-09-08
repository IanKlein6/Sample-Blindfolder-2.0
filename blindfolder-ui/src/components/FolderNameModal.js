import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

function FolderNameModal({ open, onClose, onSave }) {
  const [folderName, setFolderName] = useState(''); // State to track folder name input

  // Function to handle saving the folder name and resetting the input field
  const handleSave = () => {
    onSave(folderName); // Pass the folder name back to the parent component via onSave callback
    setFolderName('');  // Reset the folder name after saving
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Modal title */}
      <DialogTitle>Enter Folder Name</DialogTitle>

      {/* Modal content */}
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

      {/* Modal actions */}
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button> 
        <Button onClick={handleSave} color="primary">Save</Button>  
      </DialogActions>
    </Dialog>
  );
}

export default FolderNameModal;
