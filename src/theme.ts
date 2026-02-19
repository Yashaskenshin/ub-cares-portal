import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1', // Indigo 500
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#ec4899', // Pink 500
            light: '#f472b6',
            dark: '#db2777',
        },
        background: {
            default: '#0f172a', // Slate 900 (Page Background)
            paper: '#1e293b',   // Slate 800 (Card Background)
        },
        text: {
            primary: '#f8fafc', // Slate 50
            secondary: '#94a3b8', // Slate 400
        },
        divider: '#334155', // Slate 700
    },
    shape: {
        borderRadius: 8, // Standard, professional radius (not too round)
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 },
        h2: { fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.01em' },
        h3: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0em' },
        h4: { fontSize: '1.25rem', fontWeight: 600 },
        h5: { fontSize: '1.125rem', fontWeight: 600 },
        h6: { fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
        body1: { fontSize: '1rem', lineHeight: 1.5 },
        body2: { fontSize: '0.875rem', lineHeight: 1.5 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#0f172a',
                    minHeight: '100vh',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155', // Crisp border
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // Subtle shadow
                },
                elevation0: {
                    boxShadow: 'none',
                    border: '1px solid #334155',
                },
                elevation1: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    border: '1px solid #334155',
                    boxShadow: 'none',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    padding: '8px 16px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: '#4f46e5', // Darker indigo
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1e293b', // Solid Slate 800
                    borderRight: '1px solid #334155',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e293b', // Solid Slate 800
                    borderBottom: '1px solid #334155',
                    boxShadow: 'none',
                    backgroundImage: 'none',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #334155',
                    padding: '16px',
                },
                head: {
                    backgroundColor: '#1e293b',
                    fontWeight: 600,
                    color: '#94a3b8',
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                },
                outlined: {
                    borderColor: '#475569',
                }
            }
        }
    },
});

export default theme;
