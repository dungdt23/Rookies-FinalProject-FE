import { styled } from '@mui/system';
import { Box } from '@mui/material';

const CustomFormField = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
    },
}));

export default CustomFormField;
