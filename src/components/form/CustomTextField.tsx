import { styled } from '@mui/system';
import { TextField } from '@mui/material';

export const TextFieldStyled = styled(TextField)(({ theme }) => ({
    flex: 1,
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
const CustomTextField: FC = () => {
}
export default CustomTextField;
