import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormLabel, Radio, RadioGroup, Select, MenuItem} from '@mui/material';
import { FormContainer, FormField, GenderField, GenderOptions, FormButtons } from "../../../components/form/CustomBox";
import { SaveButton, CancelButton } from "../../../components/form/CustomButton";
import { GenderOption } from "../../../components/form/CustomFormControlLabel";
import { FormLabelStyled } from "../../../components/form/CustomInputLabel";
import { TextFieldStyled } from "../../../components/form/CustomTextField";
import { FormTitle } from "../../../components/form/CustomTypography";
import { styled } from '@mui/system';
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
                    <FormControl component="fieldset" margin="dense" fullWidth>
                        <FormLabel component="legend">Gender</FormLabel>
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
                    </FormControl>
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
                            onChange={(e) => setType(e.target.value)}
                            variant="outlined"
                        >
                            <MenuItem value="Staff">Staff</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </FormField>
                <FormButtons>
                    <SaveButton
                        type="submit"
                        disabled={!isSaveEnabled}
                    >
                        Save
                    </SaveButton>
                    <CancelButton
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </CancelButton>
                </FormButtons>
            </form>
        </FormContainer>
    );
};

export default CreateUserPage;
