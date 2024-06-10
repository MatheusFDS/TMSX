import React, { useState, useEffect } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Paper, TextField, Grid, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api';  // Importar a configuração da API

const CadastroDirecoes = () => {
    const [direcoes, setDirecoes] = useState([]);
    const [rangeInicio, setRangeInicio] = useState('');
    const [rangeFim, setRangeFim] = useState('');
    const [valorDirecao, setValorDirecao] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchDirecoes = async () => {
            try {
                const response = await api.get('/direcoes');
                setDirecoes(response.data);
            } catch (error) {
                console.error("Erro ao buscar direções:", error);
            }
        };
        fetchDirecoes();
    }, []);

    const addOrUpdateDirecao = async () => {
        if (editId) {
            try {
                const updatedDirecao = { id: editId, rangeInicio, rangeFim, valorDirecao };
                await api.put(`/direcoes/${editId}`, updatedDirecao);
                setDirecoes(direcoes.map(direcao => direcao.id === editId ? updatedDirecao : direcao));
                setEditId(null);
            } catch (error) {
                console.error("Erro ao atualizar direção:", error);
            }
        } else {
            try {
                const novaDirecao = { id: direcoes.length + 1, rangeInicio, rangeFim, valorDirecao };
                const response = await api.post('/direcoes', novaDirecao);
                setDirecoes([...direcoes, response.data]);
            } catch (error) {
                console.error("Erro ao adicionar direção:", error);
            }
        }
        setRangeInicio('');
        setRangeFim('');
        setValorDirecao('');
    };

    const deleteDirecao = async (id) => {
        try {
            await api.delete(`/direcoes/${id}`);
            setDirecoes(direcoes.filter(direcao => direcao.id !== id));
        } catch (error) {
            console.error("Erro ao deletar direção:", error);
        }
    };

    const editDirecao = (direcao) => {
        setEditId(direcao.id);
        setRangeInicio(direcao.rangeInicio);
        setRangeFim(direcao.rangeFim);
        setValorDirecao(direcao.valorDirecao);
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
                Cadastro de Direções
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={4}>
                    <TextField
                        label="Range de Início"
                        variant="outlined"
                        fullWidth
                        value={rangeInicio}
                        onChange={(e) => setRangeInicio(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Range de Fim"
                        variant="outlined"
                        fullWidth
                        value={rangeFim}
                        onChange={(e) => setRangeFim(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Valor da Direção"
                        variant="outlined"
                        fullWidth
                        value={valorDirecao}
                        onChange={(e) => setValorDirecao(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={addOrUpdateDirecao} sx={{ marginBottom: 2 }}>
                {editId ? 'Atualizar Direção' : 'Adicionar Direção'}
            </Button>
            <List>
                {direcoes.map((direcao) => (
                    <ListItem key={direcao.id} divider>
                        <ListItemText
                            primary={`Direção ${direcao.id}`}
                            secondary={`Range: ${direcao.rangeInicio} - ${direcao.rangeFim}, Valor da Direção: ${direcao.valorDirecao}`}
                        />
                        <IconButton edge="end" aria-label="edit" onClick={() => editDirecao(direcao)}>
                            <Edit />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteDirecao(direcao.id)}>
                            <Delete />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default CadastroDirecoes;
