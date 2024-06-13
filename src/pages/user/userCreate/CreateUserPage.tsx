import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Select,
    MenuItem,
    TextField,
    Typography,
    InputLabel,
} from '@mui/material';
import { styled } from '@mui/system';

// Styled Components

const FormContainer = styled(Box)(({ theme }) => ({
    background: '#fff',
    padding: '20px',
    width: '450px',
    textAlign: 'left',
    borderRadius: '8px',
    boxShadow: theme.shadows[2],
    margin: '0 auto',
    marginTop: theme.spacing(4),
}));

const FormTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: 'red',
    fontSize: '1.2em',
    textAlign: 'center',
    marginBottom: '20px',
}));

const FormField = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
    },
}));

const FormLabelStyled = styled(InputLabel)(({ theme }) => ({
    minWidth: '150px',
    whiteSpace: 'nowrap',
    textAlign: 'right',
    paddingRight: '10px',
    [theme.breakpoints.down('xs')]: {
        textAlign: 'left',
        paddingRight: '0',
    },
}));

const TextFieldStyled = styled(TextField)(({ theme }) => ({
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

const GenderOption = styled(FormControlLabel)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: '15px',
    '& > .MuiRadio-root': {
        marginRight: '5px',
    },
}));

const FormButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: theme.spacing(2),
}));

const SaveButton = styled(Button)(({ theme }) => ({
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

const CancelButton = styled(Button)(({ theme }) => ({
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

const CreateUserPage: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [dob, setDob] = useState<string>('');
    const [gender, setGender] = useState<string>('Female');
    const [joinedDate, setJoinedDate] = useState<string>('');
    const [type, setType] = useState<string>('Staff');

    const navigate = useNavigate();

    const isSaveEnabled = firstName && lastName && dob && joinedDate;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add form submission logic here
        navigate('/users');
    };

    const handleCancel = () => {
        navigate('/users');
    };

    return (
        <FormContainer>
            <FormTitle>Create New User</FormTitle>
            <form onSubmit={handleSubmit}>
                <FormField>
                    <FormLabelStyled htmlFor="firstName">First Name</FormLabelStyled>
                    <TextFieldStyled
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                    />
                </FormField>
                <FormField>
                    <FormLabelStyled htmlFor="lastName">Last Name</FormLabelStyled>
                    <TextFieldStyled
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                    />
                </FormField>
                <FormField>
                    <FormLabelStyled htmlFor="dob">Date of Birth</FormLabelStyled>
                    <TextFieldStyled
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                    />
                </FormField>
                <FormField>
                        <FormLabelStyled htmlFor="gender">Gender</FormLabelStyled>
                        <RadioGroup
                            row
                            name="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <GenderOption
                                value="Female"
                                control={<Radio />}
                                label="Female"
                            />
                            <GenderOption
                                value="Male"
                                control={<Radio />}
                                label="Male"
                            />
                        </RadioGroup>
                </FormField>
                <FormField>
                    <FormLabelStyled htmlFor="joinedDate">Joined Date</FormLabelStyled>
                    <TextFieldStyled
                        id="joinedDate"
                        type="date"
                        value={joinedDate}
                        onChange={(e) => setJoinedDate(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                    />
                </FormField>
                <FormField>
                    <FormLabelStyled htmlFor="type">Type</FormLabelStyled>
                    <FormControl fullWidth margin="dense">
                        <Select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value as string)}
                            displayEmpty
                            variant="outlined"
                        >
                            <MenuItem value="Staff">Staff</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </FormField>
                <FormButtons>
                    <SaveButton type="submit" variant="contained" disabled={!isSaveEnabled}>
                        Save
                    </SaveButton>
                    <CancelButton type="button" variant="outlined" onClick={handleCancel}>
                        Cancel
                    </CancelButton>
                </FormButtons>
            </form>
        </FormContainer>
    );
};

export default CreateUserPage;
