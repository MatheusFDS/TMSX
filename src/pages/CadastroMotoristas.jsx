import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

const CadastroMotoristas = () => {
    const [motoristas, setMotoristas] = useState([]);
    const [nome, setNome] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const storedMotoristas = getFromLocalStorage('motoristas');
        if (storedMotoristas) setMotoristas(storedMotoristas);
    }, []);

    const addOrUpdateMotorista = () => {
        if (editId) {
            const updatedMotoristas = motoristas.map(motorista =>
                motorista.id === editId ? { ...motorista, nome } : motorista
            );
            setMotoristas(updatedMotoristas);
            saveToLocalStorage('motoristas', updatedMotoristas);
            setEditId(null);
        } else {
            const novoMotorista = {
                id: motoristas.length + 1,
                nome
            };
            const updatedMotoristas = [...motoristas, novoMotorista];
            setMotoristas(updatedMotoristas);
            saveToLocalStorage('motoristas', updatedMotoristas);
        }
        setNome('');
    };

    const deleteMotorista = (id) => {
        const updatedMotoristas = motoristas.filter(motorista => motorista.id !== id);
        setMotoristas(updatedMotoristas);
        saveToLocalStorage('motoristas', updatedMotoristas);
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
