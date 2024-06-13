import { styled } from '@mui/system';
import { TextField } from '@mui/material';

const CustomTextFieldStyled = styled(TextField)(({ theme }) => ({
    flex: 1,
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    marginLeft: '10px',
    fontFamily: 'inherit',
    [theme.breakpoints.down('xs')]: {
        marginLeft: '0',
        marginTop: '10px',
    },
}));

export default CustomTextFieldStyled;
