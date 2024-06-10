import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Tabs, Tab, Box } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api';

const dividirPedidosEmBlocos = (pedidos, direcoes, pedidosAtribuidos) => {
    const blocos = {};

    direcoes.forEach(direcao => {
        blocos[direcao.id] = {
            direcao,
            pedidos: [],
            totalPeso: 0,
            totalValor: 0,
            valorDirecao: parseFloat(direcao.valorDirecao) || 0
        };
    });

    pedidos.forEach(pedido => {
        if (pedido.cep && !pedidosAtribuidos.includes(pedido.id)) {
            const cep = parseInt(pedido.cep, 10);
            const direcaoCorrespondente = direcoes.find(direcao => {
                const rangeInicio = parseInt(direcao.rangeInicio, 10);
                const rangeFim = parseInt(direcao.rangeFim, 10);
                return cep >= rangeInicio && cep <= rangeFim;
            });

            if (direcaoCorrespondente) {
                const bloco = blocos[direcaoCorrespondente.id];
                bloco.pedidos.push(pedido);
                bloco.totalPeso += parseFloat(pedido.peso) || 0;
                bloco.totalValor += parseFloat(pedido.valor) || 0;
            }
        }
    });

    return blocos;
};

const Roteirizacao = () => {
    const [pedidos, setPedidos] = useState([]);
    const [direcoes, setDirecoes] = useState([]);
    const [blocos, setBlocos] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [motoristas, setMotoristas] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [roteiros, setRoteiros] = useState([]);
    const [veiculo, setVeiculo] = useState('');
    const [valorVeiculo, setValorVeiculo] = useState(0);
    const [valorDirecao, setValorDirecao] = useState(0);
    const [valorAdicional, setValorAdicional] = useState(0);
    const [valorPedagio, setValorPedagio] = useState(0);
    const [motoristaSelecionado, setMotoristaSelecionado] = useState('');
    const [totalFrete, setTotalFrete] = useState(0);
    const [selectedBloco, setSelectedBloco] = useState(null);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [pedidosAtribuidos, setPedidosAtribuidos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedPedidos = (await api.get('/pedidos')).data;
                const storedDirecoes = (await api.get('/direcoes')).data;
                const storedMotoristas = (await api.get('/motoristas')).data;
                const storedVeiculos = (await api.get('/veiculos')).data;
                const storedRoteiros = (await api.get('/roteiros')).data;

                setPedidos(storedPedidos.filter(pedido => pedido.status === 'Pendente' || pedido.status === 'Retornada'));
                setDirecoes(storedDirecoes);
                setMotoristas(storedMotoristas);
                setVeiculos(storedVeiculos);
                setRoteiros(storedRoteiros);
            } catch (error) {
                console.error('Erro ao buscar dados', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (pedidos.length > 0 && direcoes.length > 0) {
            const novosBlocos = dividirPedidosEmBlocos(pedidos, direcoes, pedidosAtribuidos);
            setBlocos(novosBlocos);
        }
    }, [pedidos, direcoes, pedidosAtribuidos]);

    useEffect(() => {
        if (motoristaSelecionado) {
            const motorista = motoristas.find(m => m.nome === motoristaSelecionado);
            if (motorista) {
                const veiculo = veiculos.find(v => v.motoristaId === motorista.id);
                if (veiculo) {
                    setVeiculo(veiculo.modelo);
                    setValorVeiculo(veiculo.valorVeiculo);
                }
            } else {
                setVeiculo('');
                setValorVeiculo(0);
            }
        }
    }, [motoristaSelecionado, motoristas, veiculos]);

    useEffect(() => {
        setTotalFrete(parseFloat(valorVeiculo) + parseFloat(valorDirecao) + parseFloat(valorAdicional) + parseFloat(valorPedagio));
    }, [valorVeiculo, valorDirecao, valorAdicional, valorPedagio]);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceBloco = { ...blocos[source.droppableId] };
        const destBloco = { ...blocos[destination.droppableId] };
        const [draggedPedido] = sourceBloco.pedidos.splice(source.index, 1);

        destBloco.pedidos.splice(destination.index, 0, draggedPedido);

        sourceBloco.totalPeso -= parseFloat(draggedPedido.peso) || 0;
        sourceBloco.totalValor -= parseFloat(draggedPedido.valor) || 0;

        destBloco.totalPeso += parseFloat(draggedPedido.peso) || 0;
        destBloco.totalValor += parseFloat(draggedPedido.valor) || 0;

        setBlocos({
            ...blocos,
            [source.droppableId]: sourceBloco,
            [destination.droppableId]: destBloco
        });
    };

    const handleGenerateRoteiro = (blocoId) => {
        setSelectedBloco(blocos[blocoId]);
        setValorDirecao(blocos[blocoId].valorDirecao);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmRoteiro = async () => {
        const novoRoteiro = {
            id: roteiros.length + 1,
            motorista: motoristaSelecionado,
            veiculo,
            valorFrete: totalFrete,
            pedidos: selectedBloco.pedidos,
            totalPeso: selectedBloco.totalPeso,
            totalValor: selectedBloco.totalValor,
            dataInicio: new Date().toISOString(),
            status: 'Em rota'
        };

        try {
            const response = await api.post('/roteiros', novoRoteiro);
            const updatedPedidos = selectedBloco.pedidos.map(pedido => ({
                ...pedido,
                status: 'Em rota de entrega',
                roteiroId: response.data.id
            }));

            await Promise.all(updatedPedidos.map(pedido => api.put(`/pedidos/${pedido.id}`, pedido)));

            setPedidos(pedidos.map(pedido => {
                if (selectedBloco.pedidos.find(p => p.id === pedido.id)) {
                    return { ...pedido, status: 'Em rota de entrega', roteiroId: response.data.id };
                }
                return pedido;
            }));

            setPedidosAtribuidos([...pedidosAtribuidos, ...selectedBloco.pedidos.map(p => p.id)]);
            setRoteiros([...roteiros, response.data]);
            setOpenDialog(false);
        } catch (error) {
            console.error('Erro ao salvar o roteiro:', error);
        }
    };

    const handlePedidoDetails = (pedido) => {
        setSelectedPedido(pedido);
    };

    const handleClosePedidoDetails = () => {
        setSelectedPedido(null);
    };

    const handleRemovePedido = (pedidoId) => {
        const pedidoRemovido = selectedBloco.pedidos.find(pedido => pedido.id === pedidoId);
        const updatedBloco = {
            ...selectedBloco,
            pedidos: selectedBloco.pedidos.filter(pedido => pedido.id !== pedidoId),
            totalPeso: selectedBloco.totalPeso - (pedidoRemovido ? parseFloat(pedidoRemovido.peso) : 0),
            totalValor: selectedBloco.totalValor - (pedidoRemovido ? parseFloat(pedidoRemovido.valor) : 0),
        };

        setSelectedBloco(updatedBloco);

        const updatedPedidos = pedidos.map(pedido =>
            pedido.id === pedidoId ? { ...pedido, status: 'Pendente' } : pedido
        );
        setPedidos(updatedPedidos);
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
                Roteirização
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={2}>
                    {Object.keys(blocos).map(direcaoId => (
                        <Grid item xs={12} sm={6} md={4} key={direcaoId}>
                            <Paper elevation={2} sx={{ padding: 2, maxHeight: '70vh', overflowY: 'auto' }}>
                                <Typography variant="h6" gutterBottom>
                                    Direção {blocos[direcaoId].direcao.id} ({blocos[direcaoId].direcao.rangeInicio} - {blocos[direcaoId].direcao.rangeFim})
                                </Typography>
                                <Typography variant="body1">
                                    Total Peso: {blocos[direcaoId].totalPeso.toFixed(2)} kg
                                </Typography>
                                <Typography variant="body1">
                                    Total Valor: R$ {blocos[direcaoId].totalValor.toFixed(2)}
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => handleGenerateRoteiro(direcaoId)} sx={{ marginBottom: 2 }} disabled={blocos[direcaoId].pedidos.length === 0}>
                                    Gerar Roteiro
                                </Button>
                                <Droppable droppableId={direcaoId.toString()}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{ minHeight: '50px' }}
                                        >
                                            {blocos[direcaoId].pedidos.map((pedido, index) => (
                                                <Draggable key={pedido.id} draggableId={pedido.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Paper elevation={1} sx={{ padding: 1, marginBottom: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>
                                                                    <Typography variant="body1">
                                                                        Pedido {pedido.numero} - Cliente: {pedido.cliente}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        CEP: {pedido.cep}, Valor: {pedido.valor}, Peso: {pedido.peso}
                                                                    </Typography>
                                                                </div>
                                                                <IconButton onClick={() => handlePedidoDetails(pedido)}>
                                                                    <InfoIcon />
                                                                </IconButton>
                                                            </Paper>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </DragDropContext>
            {selectedBloco && (
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Gerar Roteiro</DialogTitle>
                    <DialogContent>
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label="Dados" />
                            <Tab label="Notas" />
                        </Tabs>
                        {tabIndex === 0 && (
                            <Box sx={{ paddingTop: 2 }}>
                                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                    <InputLabel>Motorista</InputLabel>
                                    <Select
                                        value={motoristaSelecionado}
                                        onChange={(e) => setMotoristaSelecionado(e.target.value)}
                                    >
                                        {motoristas
                                            .filter(motorista => !roteiros.some(roteiro => roteiro.motorista === motorista.nome && roteiro.status === 'Em rota'))
                                            .map((motorista) => (
                                                <MenuItem key={motorista.id} value={motorista.nome}>
                                                    {motorista.nome}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Veículo"
                                    variant="outlined"
                                    fullWidth
                                    value={veiculo}
                                    disabled
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Valor do Veículo"
                                    variant="outlined"
                                    fullWidth
                                    value={valorVeiculo}
                                    disabled
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Valor da Direção"
                                    variant="outlined"
                                    fullWidth
                                    value={valorDirecao}
                                    onChange={(e) => setValorDirecao(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Valor Adicional"
                                    variant="outlined"
                                    fullWidth
                                    value={valorAdicional}
                                    onChange={(e) => setValorAdicional(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Valor do Pedágio"
                                    variant="outlined"
                                    fullWidth
                                    value={valorPedagio}
                                    onChange={(e) => setValorPedagio(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <Typography variant="body1" gutterBottom>
                                    Total Peso: {selectedBloco.totalPeso.toFixed(2)} kg
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Total Valor: R$ {selectedBloco.totalValor.toFixed(2)}
                                </Typography>
                                <Typography variant="h6">
                                    Valor do Frete: R$ {totalFrete.toFixed(2)}
                                </Typography>
                            </Box>
                        )}
                        {tabIndex === 1 && (
                            <Box sx={{ paddingTop: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Notas
                                </Typography>
                                {selectedBloco.pedidos.map((pedido, index) => (
                                    <Paper key={index} elevation={1} sx={{ padding: 1, marginBottom: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Typography variant="body1">
                                                Pedido {pedido.numero} - Cliente: {pedido.cliente}
                                            </Typography>
                                            <Typography variant="body2">
                                                CEP: {pedido.cep}, Valor: {pedido.valor}, Peso: {pedido.peso}
                                            </Typography>
                                        </div>
                                        <IconButton onClick={() => handleRemovePedido(pedido.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Paper>
                                ))}
                                <Typography variant="body1" gutterBottom>
                                    Total Peso: {selectedBloco.pedidos.reduce((sum, pedido) => sum + parseFloat(pedido.peso), 0).toFixed(2)} kg
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Total Valor: R$ {selectedBloco.pedidos.reduce((sum, pedido) => sum + parseFloat(pedido.valor), 0).toFixed(2)}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmRoteiro} color="primary">
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {selectedPedido && (
                <Dialog open={Boolean(selectedPedido)} onClose={handleClosePedidoDetails}>
                    <DialogTitle>Detalhes do Pedido</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            Número do Pedido: {selectedPedido.numero}
                        </Typography>
                        <Typography variant="body1">
                            Cliente: {selectedPedido.cliente}
                        </Typography>
                        <Typography variant="body1">
                            CEP: {selectedPedido.cep}
                        </Typography>
                        <Typography variant="body1">
                            Valor: R$ {selectedPedido.valor}
                        </Typography>
                        <Typography variant="body1">
                            Peso: {selectedPedido.peso} kg
                        </Typography>
                        <Typography variant="body1">
                            Status: {selectedPedido.status}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePedidoDetails} color="primary">
                            Fechar
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Paper>
    );
};

export default Roteirizacao;
