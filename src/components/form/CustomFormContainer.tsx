import { styled } from '@mui/system';
import { Box } from '@mui/material';

const CustomFormContainer = styled(Box)(({ theme }) => ({
    background: '#fff',
    padding: '20px',
    width: '450px',
    textAlign: 'left',
    borderRadius: '8px',
    boxShadow: theme.shadows[2],
    margin: '0 auto',
    marginTop: theme.spacing(4),
}));

export default CustomFormContainer;
