import { styled } from '@mui/system';
import { Box } from '@mui/material';

const CustomFormButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: theme.spacing(2),
}));

export default CustomFormButtons;
