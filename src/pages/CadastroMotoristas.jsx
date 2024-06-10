import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api';  // Importar a configuração da API

const CadastroMotoristas = () => {
    const [motoristas, setMotoristas] = useState([]);
    const [nome, setNome] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchMotoristas = async () => {
            try {
                const response = await api.get('/motoristas');
                setMotoristas(response.data);
            } catch (error) {
                console.error("Erro ao buscar motoristas:", error);
            }
        };
        fetchMotoristas();
    }, []);

    const addOrUpdateMotorista = async () => {
        if (editId) {
            try {
                const updatedMotorista = { id: editId, nome };
                await api.put(`/motoristas/${editId}`, updatedMotorista);
                setMotoristas(motoristas.map(motorista => motorista.id === editId ? updatedMotorista : motorista));
                setEditId(null);
            } catch (error) {
                console.error("Erro ao atualizar motorista:", error);
            }
        } else {
            try {
                const novoMotorista = { id: motoristas.length + 1, nome };
                const response = await api.post('/motoristas', novoMotorista);
                setMotoristas([...motoristas, response.data]);
            } catch (error) {
                console.error("Erro ao adicionar motorista:", error);
            }
        }
        setNome('');
    };

    const deleteMotorista = async (id) => {
        try {
            await api.delete(`/motoristas/${id}`);
            setMotoristas(motoristas.filter(motorista => motorista.id !== id));
        } catch (error) {
            console.error("Erro ao deletar motorista:", error);
        }
    };

    const editMotorista = (motorista) => {
        setEditId(motorista.id);
        setNome(motorista.nome);
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
                Cadastro de Motoristas
            </Typography>
            <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={addOrUpdateMotorista} fullWidth>
                {editId ? 'Atualizar Motorista' : 'Adicionar Motorista'}
            </Button>
            <List>
                {motoristas.map((motorista) => (
                    <ListItem key={motorista.id} divider>
                        <ListItemText primary={`Nome: ${motorista.nome}`} />
                        <IconButton edge="end" aria-label="edit" onClick={() => editMotorista(motorista)}>
                            <Edit />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteMotorista(motorista.id)}>
                            <Delete />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default CadastroMotoristas;
