import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Container
} from '@mui/material';
import {
    LockOutlined,
    Visibility,
    VisibilityOff,
    Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the route they were trying to access, default to dashboard
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        login(password).then((success) => {
            if (success) {
                navigate(from, { replace: true });
            } else {
                setError('Incorrect password. Access denied.');
                setPassword('');
            }
            setIsLoading(false);
        }).catch(() => {
            setError('System error during login.');
            setIsLoading(false);
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Card elevation={4} sx={{ width: '100%', borderRadius: 2 }}>
                    <Box sx={{
                        p: 3,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: 1,
                        borderColor: 'divider'
                    }}>
                        <SecurityIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                        <Typography component="h1" variant="h5" fontWeight="bold">
                            UB Cares Intelligence
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                            Restricted Access Portal
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Passphrase"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={!password || isLoading}
                                sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                            >
                                {isLoading ? 'Verifying...' : 'Unlock Portal'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Login;
