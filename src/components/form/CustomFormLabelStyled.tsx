import { styled } from '@mui/system';
import { InputLabel } from '@mui/material';

const CustomFormLabelStyled = styled(InputLabel)(({ theme }) => ({
    minWidth: '150px',
    whiteSpace: 'nowrap',
    textAlign: 'right',
    paddingRight: '10px',
    [theme.breakpoints.down('xs')]: {
        textAlign: 'left',
        paddingRight: '0',
    },
}));

export default CustomFormLabelStyled;
