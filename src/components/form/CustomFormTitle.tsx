import { styled } from '@mui/system';
import { Typography } from '@mui/material';

const CustomFormTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: 'red',
    fontSize: '1.2em',
    textAlign: 'center',
    marginBottom: '20px',
}));

export default CustomFormTitle;
