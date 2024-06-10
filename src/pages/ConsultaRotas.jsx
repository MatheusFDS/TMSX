import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Delete, Edit, Map } from '@mui/icons-material';
import api from '../api';  // Importar a configuração da API
import { TabPanel } from '../components/TabPanel';

const ConsultaRotas = () => {
    const [roteiros, setRoteiros] = useState([]);
    const [selectedRoteiro, setSelectedRoteiro] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [motoristas, setMotoristas] = useState([]);
    const [veiculos, setVeiculos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roteirosRes, motoristasRes, veiculosRes] = await Promise.all([
                    api.get('/roteiros'),
                    api.get('/motoristas'),
                    api.get('/veiculos')
                ]);
                setRoteiros(roteirosRes.data);
                setMotoristas(motoristasRes.data);
                setVeiculos(veiculosRes.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
        fetchData();
    }, []);

    const handleOpenDialog = (roteiro) => {
        setSelectedRoteiro({ ...roteiro, status: roteiro.status || 'Em rota' });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRoteiro(null);
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleRemovePedido = async (pedidoId) => {
        const updatedRoteiro = {
            ...selectedRoteiro,
            pedidos: selectedRoteiro.pedidos.filter(pedido => pedido.id !== pedidoId)
        };
        setSelectedRoteiro(updatedRoteiro);

        const updatedRoteiros = roteiros.map(roteiro => 
            roteiro.id === updatedRoteiro.id ? updatedRoteiro : roteiro
        );
        setRoteiros(updatedRoteiros);

        try {
            await api.put(`/roteiros/${updatedRoteiro.id}`, updatedRoteiro);
            await api.put(`/pedidos/${pedidoId}`, { status: 'Retornada' });
        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedRoteiro({ ...selectedRoteiro, [name]: value });
    };

    const handleStatusChange = async () => {
        const newStatus = selectedRoteiro.status === 'Em rota' ? 'Rota Finalizada' : 'Em rota';
        const updatedRoteiro = { ...selectedRoteiro, status: newStatus };

        const updatedRoteiros = roteiros.map(roteiro => 
            roteiro.id === updatedRoteiro.id ? updatedRoteiro : roteiro
        );
        setRoteiros(updatedRoteiros);

        if (newStatus === 'Rota Finalizada') {
            const updatedPedidos = selectedRoteiro.pedidos.map(pedido => ({
                ...pedido,
                status: 'Entregue'
            }));
            try {
                await api.put(`/roteiros/${updatedRoteiro.id}`, updatedRoteiro);
                for (let pedido of updatedPedidos) {
                    await api.put(`/pedidos/${pedido.id}`, pedido);
                }
                updatedRoteiro.dataFim = new Date().toISOString();
            } catch (error) {
                console.error("Erro ao atualizar pedidos:", error);
            }
        }

        handleCloseDialog();
    };

    const handleSaveChanges = async () => {
        try {
            await api.put(`/roteiros/${selectedRoteiro.id}`, selectedRoteiro);
            const updatedRoteiros = roteiros.map(roteiro => 
                roteiro.id === selectedRoteiro.id ? selectedRoteiro : roteiro
            );
            setRoteiros(updatedRoteiros);
            handleCloseDialog();
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
        }
    };

    const handleDeleteRoteiro = async (id) => {
        const rotaParaExcluir = roteiros.find(roteiro => roteiro.id === id);

        if (rotaParaExcluir) {
            try {
                console.log("Excluindo roteiro:", rotaParaExcluir);
                await api.delete(`/roteiros/${id}`);
                console.log("Roteiro excluído:", rotaParaExcluir);

                for (let pedido of rotaParaExcluir.pedidos) {
                    console.log("Atualizando pedido:", pedido);
                    await api.put(`/pedidos/${pedido.id}`, { status: 'Retornada' });
                    console.log("Pedido atualizado:", pedido);
                }

                const updatedRoteiros = roteiros.filter(roteiro => roteiro.id !== id);
                setRoteiros(updatedRoteiros);
                console.log("Roteiros atualizados:", updatedRoteiros);
            } catch (error) {
                console.error("Erro ao excluir roteiro:", error);
            }
        }
    };

    const openInGoogleMaps = (cep) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${cep}`;
        window.open(url, '_blank');
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
                Consulta de Rotas
            </Typography>
            <List>
                {roteiros && roteiros.length > 0 ? (
                    roteiros.map((roteiro) => (
                        <ListItem key={roteiro.id} button>
                            <ListItemText
                                primary={`Rota ID: ${roteiro.id} - Motorista: ${roteiro.motorista} - Veículo: ${roteiro.veiculo} - Status: ${roteiro.status || 'Em rota'}`}
                                secondary={`Valor do Frete: R$ ${roteiro.valorFrete ? roteiro.valorFrete.toFixed(2) : 'N/A'} - Pagamento: ${roteiro.statusPagamento || 'Pendente'}`}
                                onClick={() => handleOpenDialog(roteiro)}
                            />
                            <Typography variant="body2">
                                Data de Início: {roteiro.dataInicio ? new Date(roteiro.dataInicio).toLocaleString() : 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                                Data de Finalização: {roteiro.dataFim ? new Date(roteiro.dataFim).toLocaleString() : 'N/A'}
                            </Typography>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(roteiro)}>
                                <Edit />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRoteiro(roteiro.id)}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body1">Nenhuma rota encontrada.</Typography>
                )}
            </List>
            {selectedRoteiro && (
                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                    <DialogTitle>Editar Rota</DialogTitle>
                    <DialogContent>
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label="Dados" />
                            <Tab label="Notas" />
                        </Tabs>
                        <TabPanel value={tabIndex} index={0}>
                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                <InputLabel>Motorista</InputLabel>
                                <Select
                                    name="motorista"
                                    value={selectedRoteiro.motorista}
                                    onChange={handleChange}
                                >
                                    {motoristas.map((motorista) => (
                                        <MenuItem key={motorista.id} value={motorista.nome}>
                                            {motorista.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                <InputLabel>Veículo</InputLabel>
                                <Select
                                    name="veiculo"
                                    value={selectedRoteiro.veiculo}
                                    onChange={handleChange}
                                >
                                    {veiculos.map((veiculo) => (
                                        <MenuItem key={veiculo.id} value={veiculo.modelo}>
                                            {veiculo.modelo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Valor do Frete"
                                name="valorFrete"
                                type="number"
                                variant="outlined"
                                fullWidth
                                value={selectedRoteiro.valorFrete}
                                onChange={handleChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Status"
                                name="status"
                                variant="outlined"
                                fullWidth
                                value={selectedRoteiro.status}
                                onChange={handleChange}
                                sx={{ marginBottom: 2 }}
                                disabled
                            />
                            <TextField
                                label="Status do Pagamento"
                                name="statusPagamento"
                                variant="outlined"
                                fullWidth
                                value={selectedRoteiro.statusPagamento || 'Pendente'}
                                onChange={handleChange}
                                sx={{ marginBottom: 2 }}
                                disabled
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                                sx={{ marginTop: 2 }}
                            >
                                Salvar Alterações
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleStatusChange}
                                sx={{ marginTop: 2, marginLeft: 2 }}
                            >
                                {selectedRoteiro.status === 'Em rota' ? 'Finalizar Rota' : 'Reabrir Rota'}
                            </Button>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                            <Typography variant="h6" gutterBottom>
                                Notas
                            </Typography>
                            <List>
                                {selectedRoteiro.pedidos.map((pedido) => (
                                    <ListItem key={pedido.id} divider>
                                        <ListItemText
                                            primary={`Pedido ${pedido.numero} - Cliente: ${pedido.cliente}`}
                                            secondary={`CEP: ${pedido.cep}, Valor: R$ ${pedido.valor}, Peso: ${pedido.peso}`}
                                        />
                                        <IconButton edge="end" aria-label="map" onClick={() => openInGoogleMaps(pedido.cep)}>
                                            <Map />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemovePedido(pedido.id)}>
                                            <Delete />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </TabPanel>
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

export default ConsultaRotas;
