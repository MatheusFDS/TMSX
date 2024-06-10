import React, { useState, useEffect } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Paper, TextField, Grid, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api';  // Importar a configuração da API

const ConsultaPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [numero, setNumero] = useState('');
    const [cliente, setCliente] = useState('');
    const [cep, setCep] = useState('');
    const [valor, setValor] = useState('');
    const [peso, setPeso] = useState('');
    const [filtro, setFiltro] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await api.get('/pedidos');
                setPedidos(response.data);
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            }
        };
        fetchPedidos();
    }, []);

    const addOrUpdatePedido = async () => {
        if (editId) {
            try {
                const updatedPedido = { id: editId, numero, cliente, cep, valor, peso, dataFaturamento: new Date().toISOString().split('T')[0], status: 'Pendente' };
                await api.put(`/pedidos/${editId}`, updatedPedido);
                setPedidos(pedidos.map(p => p.id === editId ? updatedPedido : p));
                setEditId(null);
            } catch (error) {
                console.error("Erro ao atualizar pedido:", error);
            }
        } else {
            try {
                const novoPedido = { id: pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1, numero, cliente, cep, valor, peso, dataFaturamento: new Date().toISOString().split('T')[0], status: 'Pendente' };
                const response = await api.post('/pedidos', novoPedido);
                setPedidos([...pedidos, response.data]);
            } catch (error) {
                console.error("Erro ao adicionar pedido:", error);
            }
        }
        setNumero('');
        setCliente('');
        setCep('');
        setValor('');
        setPeso('');
    };

    const deletePedido = async (id) => {
        try {
            await api.delete(`/pedidos/${id}`);
            setPedidos(pedidos.filter(p => p.id !== id));
        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
        }
    };

    const editPedido = (pedido) => {
        setEditId(pedido.id);
        setNumero(pedido.numero);
        setCliente(pedido.cliente);
        setCep(pedido.cep);
        setValor(pedido.valor);
        setPeso(pedido.peso);
    };

    const filteredPedidos = pedidos.filter(p =>
        p.numero.includes(filtro) || p.cliente.includes(filtro) || p.cep.includes(filtro)
    );

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
                Consulta e Cadastro de Pedidos
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={10}>
                    <TextField
                        label="Filtrar pedidos (Número, Cliente ou CEP)"
                        variant="outlined"
                        fullWidth
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained" color="primary" onClick={addOrUpdatePedido} fullWidth>
                        {editId ? 'Atualizar Pedido' : 'Adicionar Pedido'}
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <TextField
                        label="Número"
                        variant="outlined"
                        fullWidth
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Cliente"
                        variant="outlined"
                        fullWidth
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="CEP"
                        variant="outlined"
                        fullWidth
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Valor do Pedido"
                        variant="outlined"
                        fullWidth
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Peso do Pedido (kg)"
                        variant="outlined"
                        fullWidth
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                    />
                </Grid>
            </Grid>
            <List>
                {filteredPedidos.map((pedido) => (
                    <ListItem key={pedido.id} divider>
                        <ListItemText
                            primary={`Pedido ${pedido.numero} - Cliente: ${pedido.cliente}`}
                            secondary={`Data de Faturamento: ${pedido.dataFaturamento}, Status: ${pedido.status}, CEP: ${pedido.cep}, Valor: ${pedido.valor}, Peso: ${pedido.peso}, Rota ID: ${pedido.roteiroId || 'N/A'}`}
                        />
                        <IconButton edge="end" aria-label="edit" onClick={() => editPedido(pedido)}>
                            <Edit />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => deletePedido(pedido.id)}>
                            <Delete />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default ConsultaPedidos;
