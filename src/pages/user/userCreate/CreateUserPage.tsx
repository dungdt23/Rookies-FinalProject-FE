import { LoadingButton } from '@mui/lab';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Stack, styled } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import * as yup from 'yup';
import { NoStyleLink } from '../../../components/noStyleLink';
import { routeNames } from '../../../constants/routeName';
import { createUser, CreateUserRequest } from '../../../services/user.service';
import { UserGender, UserType } from '../../../types/user';

export interface Role {
    id: string;
    name: string;
    dateCreated: string;
}

const RootBox = styled(Box)(() => ({
    maxWidth: '100vh',
    margin: 'auto'
}))

// Import dayjs plugins if needed, e.g., for relative time or localized formats
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Example locale import

// Set dayjs locale if needed
dayjs.locale('en');

// Custom validation function using dayjs
const isAfterOrEqual = (a: Date, b: Date) => dayjs(a).isAfter(b);
const isWeekday = (date: Date) => dayjs(date).day() !== 0 && dayjs(date).day() !== 6;
const isUnder18 = (dob: Date) => dayjs().diff(dob, 'years') > 18;

// Validation schema
const validationSchema = yup.object({
    firstName: yup.string()
        .required('First Name is required')
        .max(100, 'First Name length can\'t be more than 100 characters.'),
    lastName: yup.string()
        .required('Last Name is required')
        .max(100, 'Last Name length can\'t be more than 100 characters.'),
    dateOfBirth: yup.date()
        .required('Date of Birth is required')
        .test('is-18-or-older', 'User is under 18. Please select a different date', function(value) {
            return isUnder18(value);
        }),
    joinedDate: yup.date()
        .required('Joined Date is required')
        .test('is-after-dob', 'Joined date is not later than Date of Birth. Please select a different date', function(value, { parent }) {
            return isAfterOrEqual(value, parent.dateOfBirth);
        })
        .test('is-weekday', 'Joined date is Saturday or Sunday. Please select a different date', function(value) {
            return isWeekday(value);
        }),
    gender: yup.number()
        .required('Gender is required')
        .oneOf([UserGender.Male, UserGender.Female], 'Invalid gender value'),
    userType: yup.string()
        .required('User Type is required')
        .oneOf(Object.values(UserType), 'Please choose Admin or Staff'),
});

const CreateUserPage: FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            userType: 'unset',
            locationId: '',
            gender: UserGender.Male,
            dateOfBirth: '',
            joinedDate: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                joinedDate: values.joinedDate,
                dateOfBirth: values.dateOfBirth,
                gender: values.gender,
                locationId: values.locationId,
                type: values.userType,
            } as CreateUserRequest;
            try {
                const response = await createUser(payload);
                const user = response.data;
                alert(`Added successfully! Id: ${user.id}, Username: ${user.userName}`);
            } catch (error) {
                console.error('Error adding user:', error);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <>
            <Helmet>
                Create User
            </Helmet>
            <RootBox>
                <Stack spacing={3} >
                    <Typography variant="h6" gutterBottom color='primary'>
                        Create User
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3} >
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    type="date"
                                    value={formik.values.dateOfBirth}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                                    helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl
                                    required
                                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                                    component="fieldset"
                                >
                                    <FormLabel id="gender">Gender</FormLabel>
                                    <RadioGroup
                                        id="gender"
                                        name="gender"
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <FormControlLabel value={UserGender.Male} control={<Radio />} label="Male" />
                                        <FormControlLabel value={UserGender.Female} control={<Radio />} label="Female" />
                                    </RadioGroup>
                                    {formik.touched.gender && formik.errors.gender && (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.gender}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="joinedDate"
                                    name="joinedDate"
                                    label="Joined Date"
                                    type="date"
                                    value={formik.values.joinedDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.joinedDate && Boolean(formik.errors.joinedDate)}
                                    helperText={formik.touched.joinedDate && formik.errors.joinedDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    select
                                    fullWidth
                                    id="userType" // ensure this matches the formik field name
                                    name="userType" // ensure this matches the formik field name
                                    label="Type"
                                    value={formik.values.userType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.userType && Boolean(formik.errors.userType)}
                                    helperText={formik.touched.userType && formik.errors.userType}
                                >
                                    <MenuItem value="unset">- Please choose -</MenuItem> {/* updated to match initial value */}
                                    <MenuItem value={UserType.Admin}>Admin</MenuItem>
                                    <MenuItem value={UserType.Staff}>Staff</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: '1rem' }}>
                                    <LoadingButton
                                        loading={isSubmitting}
                                        type="submit"
                                        variant="contained"
                                        disabled={!(formik.isValid && formik.dirty)}
                                    >
                                        Save
                                    </LoadingButton>
                                    <NoStyleLink to={routeNames.user.list}>
                                        <Button variant='outlined'>
                                            Cancel
                                        </Button>
                                    </NoStyleLink>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Stack>
            </RootBox>
        </>
    );
}

export default CreateUserPage;
