import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Livada Biotope
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Button color="inherit" href="/">Home</Button>
          <Button color="inherit" href="/projects">Projects</Button>
          <Button color="inherit" href="/blog">Blog</Button>
          <Button color="inherit" href="/about">About</Button>
          <Button color="inherit" href="/contact">Contact</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
