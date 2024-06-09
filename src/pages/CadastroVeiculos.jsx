import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

const CadastroVeiculos = () => {
    const [veiculos, setVeiculos] = useState([]);
    const [motoristas, setMotoristas] = useState([]);
    const [modelo, setModelo] = useState('');
    const [valorVeiculo, setValorVeiculo] = useState('');
    const [motoristaId, setMotoristaId] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const storedVeiculos = getFromLocalStorage('veiculos');
        const storedMotoristas = getFromLocalStorage('motoristas');
        if (storedVeiculos) setVeiculos(storedVeiculos);
        if (storedMotoristas) setMotoristas(storedMotoristas);
    }, []);

    const addOrUpdateVeiculo = () => {
        if (editId) {
            const updatedVeiculos = veiculos.map(veiculo =>
                veiculo.id === editId ? { ...veiculo, modelo, valorVeiculo, motoristaId } : veiculo
            );
            setVeiculos(updatedVeiculos);
            saveToLocalStorage('veiculos', updatedVeiculos);
            setEditId(null);
        } else {
            const novoVeiculo = {
                id: veiculos.length + 1,
                modelo,
                valorVeiculo,
                motoristaId
            };
            const updatedVeiculos = [...veiculos, novoVeiculo];
            setVeiculos(updatedVeiculos);
            saveToLocalStorage('veiculos', updatedVeiculos);
        }
        setModelo('');
        setValorVeiculo('');
        setMotoristaId('');
    };

    const deleteVeiculo = (id) => {
        const updatedVeiculos = veiculos.filter(veiculo => veiculo.id !== id);
        setVeiculos(updatedVeiculos);
        saveToLocalStorage('veiculos', updatedVeiculos);
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
