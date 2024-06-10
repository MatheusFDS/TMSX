import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await api.post('/register', { username, password });
            navigate('/login');
        } catch (error) {
            alert('Erro ao registrar!');
        }
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
                <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                    Registrar
                </Button>
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Já tem uma conta? <Link href="/login">Login</Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Register;
