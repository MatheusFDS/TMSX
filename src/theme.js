import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark', // Define o modo dark
        primary: {
            main: '#1976d2', // Altere conforme suas preferências
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#121212', // Cor de fundo padrão no modo dark
            paper: '#1d1d1d', // Cor de fundo dos papéis no modo dark
        },
        text: {
            primary: '#ffffff', // Cor do texto primário no modo dark
            secondary: '#bbbbbb', // Cor do texto secundário no modo dark
        },
    },
    typography: {
        h4: {
            fontWeight: 'bold',
        },
    },
});

export default theme;
