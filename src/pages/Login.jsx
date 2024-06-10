import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post('/login', { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            alert('Credenciais inválidas!');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={3} sx={{ padding: 4, width: 300 }}>
                <Typography variant="h5" gutterBottom>
                    Login
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
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                    Login
                </Button>
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Não tem uma conta? <Link href="/register">Registrar</Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Login;
