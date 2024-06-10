import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api';  // Importar a configuração da API

const CadastroVeiculos = () => {
    const [veiculos, setVeiculos] = useState([]);
    const [motoristas, setMotoristas] = useState([]);
    const [modelo, setModelo] = useState('');
    const [valorVeiculo, setValorVeiculo] = useState('');
    const [motoristaId, setMotoristaId] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [veiculosRes, motoristasRes] = await Promise.all([
                    api.get('/veiculos'),
                    api.get('/motoristas')
                ]);
                setVeiculos(veiculosRes.data);
                setMotoristas(motoristasRes.data);
            } catch (error) {
                console.error("Erro ao buscar veículos ou motoristas:", error);
            }
        };
        fetchData();
    }, []);

    const addOrUpdateVeiculo = async () => {
        if (editId) {
            try {
                const updatedVeiculo = { id: editId, modelo, valorVeiculo, motoristaId };
                await api.put(`/veiculos/${editId}`, updatedVeiculo);
                setVeiculos(veiculos.map(veiculo => veiculo.id === editId ? updatedVeiculo : veiculo));
                setEditId(null);
            } catch (error) {
                console.error("Erro ao atualizar veículo:", error);
            }
        } else {
            try {
                const novoVeiculo = { id: veiculos.length + 1, modelo, valorVeiculo, motoristaId };
                const response = await api.post('/veiculos', novoVeiculo);
                setVeiculos([...veiculos, response.data]);
            } catch (error) {
                console.error("Erro ao adicionar veículo:", error);
            }
        }
        setModelo('');
        setValorVeiculo('');
        setMotoristaId('');
    };

    const deleteVeiculo = async (id) => {
        try {
            await api.delete(`/veiculos/${id}`);
            setVeiculos(veiculos.filter(veiculo => veiculo.id !== id));
        } catch (error) {
            console.error("Erro ao deletar veículo:", error);
        }
    };

    const editVeiculo = (veiculo) => {
        setEditId(veiculo.id);
        setModelo(veiculo.modelo);
        setValorVeiculo(veiculo.valorVeiculo);
        setMotoristaId(veiculo.motoristaId);
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
                Cadastro de Veículos
            </Typography>
            <TextField
                label="Modelo"
                variant="outlined"
                fullWidth
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                label="Valor do Veículo"
                variant="outlined"
                fullWidth
                value={valorVeiculo}
                onChange={(e) => setValorVeiculo(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Motorista</InputLabel>
                <Select
                    value={motoristaId}
                    onChange={(e) => setMotoristaId(e.target.value)}
                >
                    {motoristas.map((motorista) => (
                        <MenuItem key={motorista.id} value={motorista.id}>
                            {motorista.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={addOrUpdateVeiculo} fullWidth>
                {editId ? 'Atualizar Veículo' : 'Adicionar Veículo'}
            </Button>
            <List>
                {veiculos.map((veiculo) => (
                    <ListItem key={veiculo.id} divider>
                        <ListItemText
                            primary={`Modelo: ${veiculo.modelo}`}
                            secondary={`Valor: R$ ${veiculo.valorVeiculo}, Motorista: ${motoristas.find(motorista => motorista.id === veiculo.motoristaId)?.nome}`}
                        />
                        <IconButton edge="end" aria-label="edit" onClick={() => editVeiculo(veiculo)}>
                            <Edit />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteVeiculo(veiculo.id)}>
                            <Delete />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default CadastroVeiculos;
