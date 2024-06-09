import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        const users = getFromLocalStorage('users') || [];
        if (users.find(user => user.username === username)) {
            alert('Nome de usuário já existe!');
            return;
        }
        const newUser = { username, password };
        saveToLocalStorage('users', [...users, newUser]);
        alert('Registro bem-sucedido!');
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={3} sx={{ padding: 4, width: 300 }}>
                <Typography variant="h5" gutterBottom>
                    Registrar
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                    Registrar
                </Button>
            </Paper>
        </Box>
    );
};

export default Register;
