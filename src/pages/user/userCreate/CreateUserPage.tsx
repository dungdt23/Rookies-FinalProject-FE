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
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { useAuth } from '../../../contexts/AuthContext';

export interface Role {
    id: string;
    name: string;
    dateCreated: string;
}

const RootBox = styled(Box)(() => ({
    maxWidth: '100vh',
    margin: 'auto'
}));

// Set dayjs locale if needed
dayjs.locale('en');

// Custom validation function using dayjs
const isAfterOrEqual = (a: Dayjs, b: Dayjs) => dayjs(a).isAfter(b);
const isWeekday = (date: Dayjs) => dayjs(date).day() !== 0 && dayjs(date).day() !== 6;
const isUnder18 = (dob: Dayjs) => dayjs().diff(dob, 'years') < 18;

// Validation schema
const validationSchema = yup.object({
    firstName: yup.string()
        .required('First Name is required')
        .max(100, 'First Name length can\'t be more than 100 characters.'),
    lastName: yup.string()
        .required('Last Name is required')
        .max(100, 'Last Name length can\'t be more than 100 characters.'),
    dateOfBirth: yup.object()
        .required('Date of Birth is required')
        .test('is-18-or-older', 'User must be 18 or older', function (value) {
            console.log(!isUnder18(value as Dayjs))
            return !isUnder18(value as Dayjs);
        }),
    joinedDate: yup.object()
        .required('Joined Date is required')
        .test('is-after-dob', 'Joined date must be after Date of Birth', function (value, context) {
            return isAfterOrEqual(value as Dayjs, context.parent.dateOfBirth as Dayjs);
        })
        .test('is-weekday', 'Joined date cannot be Saturday or Sunday', function (value) {
            return isWeekday(value as Dayjs);
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
    const { user } = useAuth();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            userType: 'unset',
            gender: UserGender.Male,
            dateOfBirth: null as Dayjs | null,
            joinedDate: null as Dayjs | null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                joinedDate: values.joinedDate?.toISOString(),
                dateOfBirth: values.dateOfBirth?.toISOString(),
                gender: values.gender,
                locationId: user?.locationId,
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
                <title>Create User</title>
            </Helmet>
            <RootBox>
                <Stack spacing={3}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Create User
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
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
                                <DatePicker
                                    disableFuture
                                    format="DD/MM/YYYY"
                                    value={formik.values.dateOfBirth}
                                    onChange={(value) => dayjs(value).isValid() && formik.setFieldValue('dateOfBirth', value, true)}
                                    slotProps={{
                                        textField: {
                                            id: "dateOfBirth",
                                            name: "dateOfBirth",
                                            label: "Date of Birth",
                                            error: Boolean(formik.errors.dateOfBirth),
                                            helperText: formik.errors.dateOfBirth,
                                            fullWidth: true,
                                            required: true,
                                        }
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
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    value={formik.values.joinedDate}
                                    onChange={(value) => dayjs(value).isValid() && formik.setFieldValue('joinedDate', value, true)}
                                    slotProps={{
                                        textField: {
                                            id: "joinedDate",
                                            name: "joinedDate",
                                            label: "Joined Date",
                                            error: Boolean(formik.errors.joinedDate),
                                            helperText: formik.errors.joinedDate,
                                            fullWidth: true,
                                            required: true,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    select
                                    fullWidth
                                    id="userType"
                                    name="userType"
                                    label="Type"
                                    value={formik.values.userType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.userType && Boolean(formik.errors.userType)}
                                    helperText={formik.touched.userType && formik.errors.userType}
                                >
                                    <MenuItem value="unset">- Please choose -</MenuItem>
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
                                        <Button variant="outlined">
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
};

export default CreateUserPage;
