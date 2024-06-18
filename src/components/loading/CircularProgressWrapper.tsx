import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, styled, Typography } from '@mui/material';

const Overlay = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Gray out overlay
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
}));

const Container = styled(Box)({
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    height: '100%',
});

const NonClickableOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
});

interface CircularProgressWrapperProps {
    loading: boolean;
    children: React.ReactNode;
}

const CircularProgressWrapper: React.FC<CircularProgressWrapperProps> = ({ loading, children }) => {
    return (
        <Container>
            {loading && (
                <>
                    <Overlay>
                        <CircularProgress />
                        <Typography>Loading...</Typography>
                    </Overlay>
                    <NonClickableOverlay />
                </>
            )}
            <Box sx={{ position: 'relative', zIndex: 0 }}>{children}</Box>
        </Container>
    );
};

export default CircularProgressWrapper;
