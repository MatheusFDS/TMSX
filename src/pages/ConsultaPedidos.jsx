import React, { useState, useEffect } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Paper, TextField, Grid, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

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
        const storedPedidos = getFromLocalStorage('pedidos');
        if (storedPedidos) {
            setPedidos(storedPedidos);
        }
    }, []);

    const addOrUpdatePedido = () => {
        if (editId) {
            const updatedPedidos = pedidos.map(pedido => 
                pedido.id === editId ? { ...pedido, numero, cliente, cep, valor, peso } : pedido
            );
            setPedidos(updatedPedidos);
            saveToLocalStorage('pedidos', updatedPedidos);
            setEditId(null);
        } else {
            const novoPedido = {
                id: pedidos.length + 1,
                numero,
                cliente,
                cep,
                valor,
                peso,
                dataFaturamento: new Date().toISOString().split('T')[0],
                status: 'Pendente'
            };
            const updatedPedidos = [...pedidos, novoPedido];
            setPedidos(updatedPedidos);
            saveToLocalStorage('pedidos', updatedPedidos);
        }
        setNumero('');
        setCliente('');
        setCep('');
        setValor('');
        setPeso('');
    };

    const deletePedido = (id) => {
        const updatedPedidos = pedidos.filter(pedido => pedido.id !== id);
        setPedidos(updatedPedidos);
        saveToLocalStorage('pedidos', updatedPedidos);
    };

    const editPedido = (pedido) => {
        setEditId(pedido.id);
        setNumero(pedido.numero);
        setCliente(pedido.cliente);
        setCep(pedido.cep);
        setValor(pedido.valor);
        setPeso(pedido.peso);
    };

    const filteredPedidos = pedidos.filter(pedido =>
        (pedido.numero && pedido.numero.includes(filtro)) ||
        (pedido.cliente && pedido.cliente.includes(filtro)) ||
        (pedido.cep && pedido.cep.includes(filtro))
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
                            secondary={`Data de Faturamento: ${pedido.dataFaturamento}, Status: ${pedido.status}, CEP: ${pedido.cep}, Valor: ${pedido.valor}, Peso: ${pedido.peso}`}
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
