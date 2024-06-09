import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getFromLocalStorage, removeFromLocalStorage } from '../utils/storage';

const Navbar = () => {
    const navigate = useNavigate();
    const user = getFromLocalStorage('user');

    const [anchorEl, setAnchorEl] = useState(null);
    const [menu, setMenu] = useState('');

    const handleMenuOpen = (event, menuType) => {
        setAnchorEl(event.currentTarget);
        setMenu(menuType);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenu('');
    };

    const handleLogout = () => {
        removeFromLocalStorage('user');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TMS System
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                {user && (
                    <>
                        <Button color="inherit" component={Link} to="/consulta-pedidos">
                            Pedidos
                        </Button>
                        <Button color="inherit" onClick={(event) => handleMenuOpen(event, 'roteiros')}>
                            Roteiros
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={menu === 'roteiros'}
                            onClose={handleMenuClose}
                        >
                            <MenuItem component={Link} to="/consulta-rotas" onClick={handleMenuClose}>
                                Consulta de Rotas
                            </MenuItem>
                            <MenuItem component={Link} to="/roteirizacao" onClick={handleMenuClose}>
                                Roteirização
                            </MenuItem>
                            <MenuItem component={Link} to="/fechamento-frete" onClick={handleMenuClose}>
                                Fechamento de Frete
                            </MenuItem>
                        </Menu>
                        <Button color="inherit" onClick={(event) => handleMenuOpen(event, 'cadastros')}>
                            Cadastros
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={menu === 'cadastros'}
                            onClose={handleMenuClose}
                        >
                            <MenuItem component={Link} to="/cadastro-direcoes" onClick={handleMenuClose}>
                                Direções
                            </MenuItem>
                            <MenuItem component={Link} to="/cadastro-motoristas" onClick={handleMenuClose}>
                                Motoristas
                            </MenuItem>
                            <MenuItem component={Link} to="/cadastro-veiculos" onClick={handleMenuClose}>
                                Veículos
                            </MenuItem>
                        </Menu>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                )}
                {!user && (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Registrar
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
