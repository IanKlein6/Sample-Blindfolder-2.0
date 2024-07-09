import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControlLabel, Switch, Typography } from '@mui/material';

function InstructionsModal({ open, onClose, onDisable }) {
  const [disableOnStartup, setDisableOnStartup] = useState(false);

  useEffect(() => {
    if (disableOnStartup) {
      localStorage.setItem('disableInstructions', 'true');
    } else {
      localStorage.removeItem('disableInstructions');
    }
  }, [disableOnStartup]);

  const handleDisableChange = (event) => {
    setDisableOnStartup(event.target.checked);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Instructions</DialogTitle>
      <DialogContent>
        <Typography>Here are the instructions on how to use the program...</Typography>
        <FormControlLabel
          control={<Switch checked={disableOnStartup} onChange={handleDisableChange} />}
          label="Don't show on startup"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onDisable} color="primary">
          Disable
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InstructionsModal;
