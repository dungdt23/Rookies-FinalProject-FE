import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const FormContainer = styled(Box)(({ theme }) => ({
    background: '#fff',
    padding: '20px',
    width: '450px',
    textAlign: 'left',
    borderRadius: '8px',
    boxShadow: theme.shadows[2],
    margin: '0 auto',
    marginTop: theme.spacing(4),
}));

export const FormField = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
    },
}));

export const GenderField = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

export const GenderOptions = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
}));

export const FormButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: theme.spacing(2),
}));

const CustomBox: FC = () => {
}

export default CustomBox;
