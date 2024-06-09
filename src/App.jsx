import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import ConsultaPedidos from './pages/ConsultaPedidos';
import CadastroDirecoes from './pages/CadastroDirecoes';
import CadastroMotoristas from './pages/CadastroMotoristas';
import CadastroVeiculos from './pages/CadastroVeiculos';
import CentralControle from './pages/CentralControle';
import Roteirizacao from './pages/Roteirizacao';
import ConsultaRotas from './pages/ConsultaRotas';
import FechamentoFrete from './pages/FechamentoFrete'; // Adicione esta linha
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import theme from './theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Container maxWidth="lg">
                    <Routes>
                        <Route path="/" element={<PrivateRoute element={<CentralControle />} />} />
                        <Route path="/consulta-pedidos" element={<PrivateRoute element={<ConsultaPedidos />} />} />
                        <Route path="/cadastro-direcoes" element={<PrivateRoute element={<CadastroDirecoes />} />} />
                        <Route path="/cadastro-motoristas" element={<PrivateRoute element={<CadastroMotoristas />} />} />
                        <Route path="/cadastro-veiculos" element={<PrivateRoute element={<CadastroVeiculos />} />} />
                        <Route path="/roteirizacao" element={<PrivateRoute element={<Roteirizacao />} />} />
                        <Route path="/consulta-rotas" element={<PrivateRoute element={<ConsultaRotas />} />} />
                        <Route path="/fechamento-frete" element={<PrivateRoute element={<FechamentoFrete />} />} /> {/* Adicione esta linha */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;
