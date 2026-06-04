import React from 'react';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../stores/authStore';

const HeaderRightLogout = () => {
  const logout = useAuthStore(state => state.logout);

  return (
    <IconButton onClick={logout}>
      <LogoutIcon />
    </IconButton>
  );
};

export default HeaderRightLogout;