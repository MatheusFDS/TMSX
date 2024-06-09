import React, { useState, useEffect } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Paper, TextField, Grid, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

const CadastroDirecoes = () => {
    const [direcoes, setDirecoes] = useState([]);
    const [rangeInicio, setRangeInicio] = useState('');
    const [rangeFim, setRangeFim] = useState('');
    const [valorDirecao, setValorDirecao] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const storedDirecoes = getFromLocalStorage('direcoes');
        if (storedDirecoes) {
            setDirecoes(storedDirecoes);
        }
    }, []);

    const addOrUpdateDirecao = () => {
        if (editId) {
            const updatedDirecoes = direcoes.map(direcao =>
                direcao.id === editId ? { ...direcao, rangeInicio, rangeFim, valorDirecao } : direcao
            );
            setDirecoes(updatedDirecoes);
            saveToLocalStorage('direcoes', updatedDirecoes);
            setEditId(null);
        } else {
            const novaDirecao = { id: direcoes.length + 1, rangeInicio, rangeFim, valorDirecao };
            const updatedDirecoes = [...direcoes, novaDirecao];
            setDirecoes(updatedDirecoes);
            saveToLocalStorage('direcoes', updatedDirecoes);
        }
        setRangeInicio('');
        setRangeFim('');
        setValorDirecao('');
    };

    const deleteDirecao = (id) => {
        const updatedDirecoes = direcoes.filter(direcao => direcao.id !== id);
        setDirecoes(updatedDirecoes);
        saveToLocalStorage('direcoes', updatedDirecoes);
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
