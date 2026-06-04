import React from 'react';
import { CircularProgress, Modal, Box } from '@mui/material';

const Preloader = ({ visible }) => (
  <Modal open={visible}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  </Modal>
);

export default Preloader;