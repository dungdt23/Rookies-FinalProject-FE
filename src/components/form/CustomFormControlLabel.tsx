import { styled } from '@mui/system';
import { FormControlLabel } from '@mui/material';

export const GenderOption = styled(FormControlLabel)(({  }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: '15px',
    '& > .MuiRadio-root': {
        marginRight: '5px',
    },
}));
const CustomFormControlLabel = () => {
}
export default CustomFormControlLabel;