const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { readJSONFile, writeJSONFile } = require('./utils');
const path = require('path');

const app = express();
const port = 3001;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());
app.use(cors());

// Endpoints de autenticação
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readJSONFile('users.json');
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = readJSONFile('users.json');
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        res.status(409).json({ message: 'Usuário já existe' });
    } else {
        users.push({ username, password });
        writeJSONFile('users.json', users);
        res.status(201).json({ message: 'Registrado com sucesso' });
    }
});

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Token inválido' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'Token não fornecido' });
    }
};

// Endpoints de Pedidos
app.get('/pedidos', authenticate, (req, res) => {
    const pedidos = readJSONFile('pedidos.json');
    res.json(pedidos);
});

app.post('/pedidos', authenticate, (req, res) => {
    const pedidos = readJSONFile('pedidos.json');
    const novoPedido = req.body;
    pedidos.push(novoPedido);
    writeJSONFile('pedidos.json', pedidos);
    res.status(201).json(novoPedido);
});

app.put('/pedidos/:id', authenticate, (req, res) => {
    const pedidos = readJSONFile('pedidos.json');
    const { id } = req.params;
    const index = pedidos.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
        pedidos[index] = { ...pedidos[index], ...req.body };
        writeJSONFile('pedidos.json', pedidos);
        res.json(pedidos[index]);
    } else {
        res.status(404).json({ message: 'Pedido não encontrado' });
    }
});

app.delete('/pedidos/:id', authenticate, (req, res) => {
    let pedidos = readJSONFile('pedidos.json');
    const { id } = req.params;
    pedidos = pedidos.filter(p => p.id !== parseInt(id));
    writeJSONFile('pedidos.json', pedidos);
    res.status(204).send();
});

// Endpoints de Roteiros
app.get('/roteiros', authenticate, (req, res) => {
    const roteiros = readJSONFile('roteiros.json');
    res.json(roteiros);
});

app.post('/roteiros', authenticate, (req, res) => {
    const roteiros = readJSONFile('roteiros.json');
    const novoRoteiro = req.body;
    roteiros.push(novoRoteiro);
    writeJSONFile('roteiros.json', roteiros);
    res.status(201).json(novoRoteiro);
});

app.put('/roteiros/:id', authenticate, (req, res) => {
    const roteiros = readJSONFile('roteiros.json');
    const { id } = req.params;
    const index = roteiros.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
        roteiros[index] = { ...roteiros[index], ...req.body };
        writeJSONFile('roteiros.json', roteiros);
        res.json(roteiros[index]);
    } else {
        res.status(404).json({ message: 'Roteiro não encontrado' });
    }
});

app.delete('/roteiros/:id', authenticate, (req, res) => {
    let roteiros = readJSONFile('roteiros.json');
    const { id } = req.params;
    roteiros = roteiros.filter(r => r.id !== parseInt(id));
    writeJSONFile('roteiros.json', roteiros);
    res.status(204).send();
});

// Endpoints de Motoristas
app.get('/motoristas', authenticate, (req, res) => {
    const motoristas = readJSONFile('motoristas.json');
    res.json(motoristas);
});

app.post('/motoristas', authenticate, (req, res) => {
    const motoristas = readJSONFile('motoristas.json');
    const novoMotorista = req.body;
    motoristas.push(novoMotorista);
    writeJSONFile('motoristas.json', motoristas);
    res.status(201).json(novoMotorista);
});

app.put('/motoristas/:id', authenticate, (req, res) => {
    const motoristas = readJSONFile('motoristas.json');
    const { id } = req.params;
    const index = motoristas.findIndex(m => m.id === parseInt(id));
    if (index !== -1) {
        motoristas[index] = { ...motoristas[index], ...req.body };
        writeJSONFile('motoristas.json', motoristas);
        res.json(motoristas[index]);
    } else {
        res.status(404).json({ message: 'Motorista não encontrado' });
    }
});

app.delete('/motoristas/:id', authenticate, (req, res) => {
    let motoristas = readJSONFile('motoristas.json');
    const { id } = req.params;
    motoristas = motoristas.filter(m => m.id !== parseInt(id));
    writeJSONFile('motoristas.json', motoristas);
    res.status(204).send();
});

// Endpoints de Veículos
app.get('/veiculos', authenticate, (req, res) => {
    const veiculos = readJSONFile('veiculos.json');
    res.json(veiculos);
});

app.post('/veiculos', authenticate, (req, res) => {
    const veiculos = readJSONFile('veiculos.json');
    const novoVeiculo = req.body;
    veiculos.push(novoVeiculo);
    writeJSONFile('veiculos.json', veiculos);
    res.status(201).json(novoVeiculo);
});

app.put('/veiculos/:id', authenticate, (req, res) => {
    const veiculos = readJSONFile('veiculos.json');
    const { id } = req.params;
    const index = veiculos.findIndex(v => v.id === parseInt(id));
    if (index !== -1) {
        veiculos[index] = { ...veiculos[index], ...req.body };
        writeJSONFile('veiculos.json', veiculos);
        res.json(veiculos[index]);
    } else {
        res.status(404).json({ message: 'Veículo não encontrado' });
    }
});

app.delete('/veiculos/:id', authenticate, (req, res) => {
    let veiculos = readJSONFile('veiculos.json');
    const { id } = req.params;
    veiculos = veiculos.filter(v => v.id !== parseInt(id));
    writeJSONFile('veiculos.json', veiculos);
    res.status(204).send();
});

// Endpoints de Direções
app.get('/direcoes', authenticate, (req, res) => {
    const direcoes = readJSONFile('direcoes.json');
    res.json(direcoes);
});

app.post('/direcoes', authenticate, (req, res) => {
    const direcoes = readJSONFile('direcoes.json');
    const novaDirecao = req.body;
    direcoes.push(novaDirecao);
    writeJSONFile('direcoes.json', direcoes);
    res.status(201).json(novaDirecao);
});

app.put('/direcoes/:id', authenticate, (req, res) => {
    const direcoes = readJSONFile('direcoes.json');
    const { id } = req.params;
    const index = direcoes.findIndex(d => d.id === parseInt(id));
    if (index !== -1) {
        direcoes[index] = { ...direcoes[index], ...req.body };
        writeJSONFile('direcoes.json', direcoes);
        res.json(direcoes[index]);
    } else {
        res.status(404).json({ message: 'Direção não encontrada' });
    }
});

app.delete('/direcoes/:id', authenticate, (req, res) => {
    let direcoes = readJSONFile('direcoes.json');
    const { id } = req.params;
    direcoes = direcoes.filter(d => d.id !== parseInt(id));
    writeJSONFile('direcoes.json', direcoes);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
