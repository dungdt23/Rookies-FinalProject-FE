import {styled} from '@mui/system';
import {InputLabel} from '@mui/material';

export const FormLabelStyled = styled(InputLabel)(({ theme }) => ({
    minWidth: '150px',
    whiteSpace: 'nowrap',
    textAlign: 'right',
    paddingRight: '10px',
    [theme.breakpoints.down('xs')]: {
        textAlign: 'left',
        paddingRight: '0',
    },
}));
const CustomInputLabel = () => {
}
export default CustomInputLabel;