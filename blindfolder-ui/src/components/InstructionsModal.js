import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

function InstructionsModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Instructions Manual</DialogTitle>
      <DialogContent dividers>
        <Box>
          {/* Overview Section */}
          <Typography variant="h6" gutterBottom>Overview</Typography>
          <Typography paragraph>
            BlindFolder 2.0 is an Electron-based application for automating the blinding of files generated through confocal microscopy of Drosophila cells. It offers a modern, user-friendly interface with customization options like dark mode and persistent settings.
          </Typography>

          {/* Getting Started Section */}
          <Typography variant="h6" gutterBottom>Getting Started</Typography>
          <Typography paragraph>
            1. <strong>Launch the Application</strong>: Open the application by running the executable file.
            <br/>
            2. <strong>Initial Setup</strong>: On the first launch, an instructions popup will appear. You can disable this popup for future launches by toggling the "Show Instructions on Startup" switch in the settings panel.
          </Typography>

          {/* Main Sections Overview */}
          <Typography variant="h6" gutterBottom>Main Sections</Typography>
          <Typography paragraph>
            The application is divided into three main sections:
          </Typography>
          <Box component="div" mb={2}>
            {/* App Selector Section */}
            <Typography component="div" paragraph>
              1. <strong>App Selector</strong>: Choose the specific blinding application you want to use.
            </Typography>

            {/* Main App View Section */}
            <Typography component="div" paragraph>
              2. <strong>Main App View</strong>:
              <ul>
                <li><strong>Add Folders</strong>: Click the "Add Folder" button to select multiple folders for blinding.</li>
                <li><strong>Rename</strong>: Click the "Rename" button to start the blinding process.</li>
                <li><strong>Remove Folder</strong>: Click the "Remove" button next to a folder to remove it from the list.</li>
              </ul>
            </Typography>

            {/* Settings Panel Section */}
            <Typography component="div" paragraph>
              3. <strong>Settings Panel</strong>:
              <ul>
                <li><strong>Naming Prefix</strong>: Enter a prefix for file names.</li>
                <li><strong>File Format</strong>: Choose the file format (Excel or CSV) for exporting data.</li>
                <li><strong>Automatic File Opening</strong>: Toggle this switch to enable or disable automatic opening of files after processing.</li>
                <li><strong>Dark Mode</strong>: Toggle this switch to enable or disable dark mode.</li>
                <li><strong>Show Instructions on Startup</strong>: Toggle this switch to enable or disable the instructions popup on startup.</li>
                <li><strong>Show Instructions Button</strong>: Click this button to display the instructions popup.</li>
              </ul>
            </Typography>
          </Box>

          {/* Blinding Process Section */}
          <Typography variant="h6" gutterBottom>Blinding Process</Typography>
          <Typography paragraph>
            1. <strong>Add Folders</strong>: In the Main App View, click "Add Folder" to select the folders you want to blind.
            <br/>
            2. <strong>Start Blinding</strong>: Click the "Rename" button. You will be prompted to select a destination folder.
            <br/>
            3. <strong>Name Folder</strong>: Enter a name for the destination folder in the popup dialog.
            <br/>
            4. <strong>Complete Blinding</strong>: The application will process the selected folders and generate blinded files in the specified format. A success message will appear once the process is complete.
          </Typography>

          {/* Additional Information Section */}
          <Typography variant="h6" gutterBottom>Additional Information</Typography>
          <Typography paragraph>
            - <strong>Persistent Settings</strong>: Your settings are saved automatically and will be loaded the next time you open the application.
            <br/>
            - <strong>Help and Support</strong>: If you encounter any issues or need further assistance, please refer to the documentation or contact support.
          </Typography>

          {/* Conclusion Section */}
          <Typography variant="h6" gutterBottom>Conclusion</Typography>
          <Typography paragraph>
            BlindFolder 2.0 is designed to streamline the blinding process, making it faster and more efficient. With its user-friendly interface and customizable settings, it aims to enhance your workflow and reduce bias in data analysis.
            <br/>
            Enjoy using BlindFolder 2.0!
          </Typography>

          {/* Creators Section */}
          <Typography variant="h6" gutterBottom>Creators</Typography>
          <Typography paragraph>
            This application was developed in collaboration between Ian Klein (Software Developer), Jost Wiggering (Doctoral Student), and the department of Nephrology at the University of Freiburg.
          </Typography>

          {/* Copyright Section */}
          <Typography variant="h6" gutterBottom>Copyright</Typography>
          <Typography paragraph>
            © 2024 Blindfolder, All Rights Reserved by Ian Klein and Jost Wiggering.
          </Typography>
        </Box>
      </DialogContent>
      
      {/* Dialog Action Buttons */}
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default InstructionsModal;
