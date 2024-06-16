import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { NoStyleLink } from '../../components/noStyleLink';
import { routeNames } from '../../constants/routeName';
import LoginForm from './LoginForm';

// ----------------------------------------------------------------------

const LoginPage: React.FC = () => {
    return (
        <>
            <Helmet>
                Login
            </Helmet>
            <Container maxWidth="sm">
                <NoStyleLink to={routeNames.index}>
                    <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        Home
                    </Button>
                </NoStyleLink>
                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        Sign In
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                        Enter your credentials to continue
                    </Typography>
                    <LoginForm />
                </Box>
            </Container>
        </>
    );
};

export default LoginPage;
