import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';
import { getFromLocalStorage } from '../utils/storage';

const CentralControle = () => {
    const [totalRoteiros, setTotalRoteiros] = useState(0);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [totalMotoristas, setTotalMotoristas] = useState(0);
    const [totalVeiculos, setTotalVeiculos] = useState(0);

    useEffect(() => {
        const roteiros = getFromLocalStorage('roteiros');
        const pedidos = getFromLocalStorage('pedidos');
        const motoristas = getFromLocalStorage('motoristas');
        const veiculos = getFromLocalStorage('veiculos');

        setTotalRoteiros(roteiros ? roteiros.length : 0);
        setTotalPedidos(pedidos ? pedidos.length : 0);
        setTotalMotoristas(motoristas ? motoristas.length : 0);
        setTotalVeiculos(veiculos ? veiculos.length : 0);
    }, []);

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Central de Controle
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Total de Roteiros</Typography>
                        <Typography variant="h4">{totalRoteiros}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Total de Pedidos</Typography>
                        <Typography variant="h4">{totalPedidos}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Total de Motoristas</Typography>
                        <Typography variant="h4">{totalMotoristas}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Total de Veículos</Typography>
                        <Typography variant="h4">{totalVeiculos}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CentralControle;
