import { styled } from '@mui/system';
import { FormControlLabel } from '@mui/material';

const CustomGenderOption = styled(FormControlLabel)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: '15px',
    '& > .MuiRadio-root': {
        marginRight: '5px',
    },
}));

export default CustomGenderOption;
