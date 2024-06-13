import { styled } from '@mui/system';
import { Button } from '@mui/material';

export const SaveButton = styled(Button)(({ theme }) => ({
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '5px',
    fontSize: '16px',
    backgroundColor: 'red',
    color: 'white',
    '&:hover': {
        backgroundColor: theme.palette.error.dark,
    },
}));

export const CancelButton = styled(Button)(({ theme }) => ({
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '5px',
    fontSize: '16px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: 'grey',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const CustomButton: FC = () => {
}

export default CustomButton;
