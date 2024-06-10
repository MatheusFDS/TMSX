import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../api'; // Importar a configuração da API

const FechamentoFrete = () => {
    const [roteiros, setRoteiros] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMotorista, setSelectedMotorista] = useState(null);
    const [agrupados, setAgrupados] = useState({});
    const [statusFiltro, setStatusFiltro] = useState('Pendentes');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRoteiros = useCallback(async () => {
        try {
            const response = await api.get('/roteiros');
            setRoteiros(response.data);
        } catch (error) {
            console.error("Erro ao buscar roteiros:", error);
        }
    }, []);

    useEffect(() => {
        fetchRoteiros();
    }, [fetchRoteiros]);

    const filtrarRoteiros = useCallback(() => {
        const finalizados = roteiros.filter(roteiro => 
            roteiro.status === 'Rota Finalizada' && 
            (statusFiltro === 'Todos' || (statusFiltro === 'Pendentes' && roteiro.statusPagamento === 'Pendente') || (statusFiltro === 'Pago' && roteiro.statusPagamento === 'Pago'))
        );

        const agrupados = finalizados.reduce((acc, roteiro) => {
            if (!acc[roteiro.motorista]) {
                acc[roteiro.motorista] = [];
            }
            acc[roteiro.motorista].push(roteiro);
            return acc;
        }, {});

        setAgrupados(agrupados);
    }, [roteiros, statusFiltro]);

    useEffect(() => {
        filtrarRoteiros();
    }, [roteiros, statusFiltro, filtrarRoteiros]);

    const handleOpenDialog = (motorista) => {
        setSelectedMotorista(motorista);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMotorista(null);
    };

    const handlePagar = async (motorista) => {
        const updatedRoteiros = roteiros.map(roteiro => {
            if (roteiro.motorista === motorista) {
                return { ...roteiro, statusPagamento: 'Pago' };
            }
            return roteiro;
        });

        setRoteiros(updatedRoteiros);
        try {
            for (let roteiro of updatedRoteiros.filter(roteiro => roteiro.motorista === motorista)) {
                await api.put(`/roteiros/${roteiro.id}`, roteiro);
            }
        } catch (error) {
            console.error("Erro ao atualizar status de pagamento:", error);
        }
        handleCloseDialog();
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        if (searchTerm.trim() === '') {
            filtrarRoteiros();
            return;
        }

        const filtered = roteiros.filter(roteiro => {
            return (
                roteiro.motorista.toLowerCase().includes(searchTerm) ||
                roteiro.veiculo.toLowerCase().includes(searchTerm) ||
                roteiro.statusPagamento.toLowerCase().includes(searchTerm) ||
                roteiro.valorFrete.toString().includes(searchTerm) ||
                roteiro.id.toString().includes(searchTerm)
            );
        });

        const agrupadosFiltrados = filtered.reduce((acc, roteiro) => {
            if (!acc[roteiro.motorista]) {
                acc[roteiro.motorista] = [];
            }
            acc[roteiro.motorista].push(roteiro);
            return acc;
        }, {});

        setAgrupados(agrupadosFiltrados);
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
                Fechamento de Frete
            </Typography>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Status do Pagamento</InputLabel>
                <Select
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value)}
                >
                    <MenuItem value="Pendentes">Pendentes</MenuItem>
                    <MenuItem value="Pago">Pagos</MenuItem>
                    <MenuItem value="Todos">Todos</MenuItem>
                </Select>
            </FormControl>
            <TextField
                fullWidth
                variant="outlined"
                label="Pesquisar"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ marginBottom: 2 }}
            />
            <List>
                {Object.keys(agrupados).map(motorista => {
                    const rotas = agrupados[motorista];
                    const totalFrete = rotas.reduce((acc, rota) => acc + rota.valorFrete, 0);
                    const dataInicio = new Date(Math.min(...rotas.map(rota => new Date(rota.dataInicio)))).toLocaleString();
                    const dataFim = new Date(Math.max(...rotas.map(rota => new Date(rota.dataFim)))).toLocaleString();

                    return (
                        <Accordion key={motorista}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>{motorista}</Typography>
                                <Typography sx={{ marginLeft: 2 }}>Total Frete: R$ {totalFrete.toFixed(2)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Data de Início: {dataInicio}</Typography>
                                <Typography>Data de Fim: {dataFim}</Typography>
                                <Button variant="contained" color="primary" onClick={() => handleOpenDialog(motorista)}>
                                    Ver Detalhes
                                </Button>
                                {rotas.some(rota => rota.statusPagamento === 'Pago') ? (
                                    <Typography sx={{ marginLeft: 2 }}>Frete Pago</Typography>
                                ) : (
                                    <Button variant="contained" color="secondary" onClick={() => handlePagar(motorista)} sx={{ marginLeft: 2 }}>
                                        Pagar
                                    </Button>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </List>
            {selectedMotorista && (
                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                    <DialogTitle>Detalhes do Fechamento - {selectedMotorista}</DialogTitle>
                    <DialogContent>
                        <List>
                            {agrupados[selectedMotorista].map((roteiro, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText
                                        primary={`Rota ID: ${roteiro.id}`}
                                        secondary={`Data de Início: ${new Date(roteiro.dataInicio).toLocaleString()}, Data de Fim: ${new Date(roteiro.dataFim).toLocaleString()}, Valor do Frete: R$ ${roteiro.valorFrete.toFixed(2)}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                            Cancelar
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Paper>
    );
};

export default FechamentoFrete;
