import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import api from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CentralControle = () => {
    const [totalRoteiros, setTotalRoteiros] = useState(0);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [totalMotoristas, setTotalMotoristas] = useState(0);
    const [totalVeiculos, setTotalVeiculos] = useState(0);
    const [pedidos, setPedidos] = useState([]);
    const [roteiros, setRoteiros] = useState([]);
    const [veiculos, setVeiculos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roteirosRes, pedidosRes, motoristasRes, veiculosRes] = await Promise.all([
                    api.get('/roteiros'),
                    api.get('/pedidos'),
                    api.get('/motoristas'),
                    api.get('/veiculos')
                ]);

                setRoteiros(roteirosRes.data);
                setPedidos(pedidosRes.data);
                setVeiculos(veiculosRes.data);

                setTotalRoteiros(roteirosRes.data.length);
                setTotalPedidos(pedidosRes.data.length);
                setTotalMotoristas(motoristasRes.data.length);
                setTotalVeiculos(veiculosRes.data.length);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, []);

    const pedidosEntregues = pedidos.filter(pedido => pedido.status === 'Entregue').length;
    const pedidosPendentes = totalPedidos - pedidosEntregues;

    const roteirosFinalizados = roteiros.filter(roteiro => roteiro.status === 'Rota Finalizada').length;
    const roteirosPendentes = totalRoteiros - roteirosFinalizados;

    const veiculosDisponiveis = veiculos.filter(veiculo => veiculo.disponivel).length;
    const veiculosNaoDisponiveis = totalVeiculos - veiculosDisponiveis;

    const fretesPagos = roteiros.filter(roteiro => roteiro.statusPagamento === 'Pago').length;
    const fretesAPagar = totalRoteiros - fretesPagos;

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

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Notas Entregues vs Pendentes</Typography>
                        <PieChart width={200} height={200}>
                            <Pie
                                data={[
                                    { name: 'Entregues', value: pedidosEntregues },
                                    { name: 'Pendentes', value: pedidosPendentes },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Roteiros Finalizados vs Pendentes</Typography>
                        <PieChart width={200} height={200}>
                            <Pie
                                data={[
                                    { name: 'Finalizados', value: roteirosFinalizados },
                                    { name: 'Pendentes', value: roteirosPendentes },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Veículos Disponíveis vs Não Disponíveis</Typography>
                        <PieChart width={200} height={200}>
                            <Pie
                                data={[
                                    { name: 'Disponíveis', value: veiculosDisponiveis },
                                    { name: 'Não Disponíveis', value: veiculosNaoDisponiveis },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Fretes Pagos vs A Pagar</Typography>
                        <PieChart width={200} height={200}>
                            <Pie
                                data={[
                                    { name: 'Pagos', value: fretesPagos },
                                    { name: 'A Pagar', value: fretesAPagar },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CentralControle;
