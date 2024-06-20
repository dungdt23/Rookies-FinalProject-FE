import { LoadingButton } from '@mui/lab';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Stack, styled } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { FC, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { NoStyleLink } from '../../../components/noStyleLink';
import { routeNames } from '../../../constants/routeName';
import { editUserById, EditUserRequest, fetchUserById } from '../../../services/user.service';
import { User, UserGender, UserType } from '../../../types/user';
import { ListPageState } from '../../../types/common';

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
const unicodeAlphabetRegex = /^[\p{L}\s]+$/u;

// Validation schema
const validationSchema = yup.object({
    firstName: yup.string()
        .required('Please enter first name')
        .matches(unicodeAlphabetRegex, 'First name should contain alphabetic characters.')
        .min(2, 'The first name length should be 2-100 characters')
        .max(100, 'The first name length should be 2-100 characters'),
    lastName: yup.string()
        .required('Please enter last name')
        .matches(unicodeAlphabetRegex, 'Last name should contain alphabetic characters.')
        .min(2, 'The last name length should be 2-100 characters')
        .max(100, 'The Last Name length should be 2-100 characters'),
    dateOfBirth: yup.object()
        .required('Please choose date of birth')
        .test('is-18-or-older', 'User is under 18. Please select a different date', function (value) {
            return !isUnder18(value as Dayjs);
        }),
    joinedDate: yup.object()
        .required('Please choose joined date')
        .test('is-after-dob', 'Joined date is not later than Date of Birth. Please select a different date', function (value, context) {
            return isAfterOrEqual(value as Dayjs, context.parent.dateOfBirth as Dayjs);
        })
        .test('is-weekday', 'Joined date is Saturday or Sunday. Please select a different date', function (value) {
            return isWeekday(value as Dayjs);
        }),
    gender: yup.number()
        .required('Please choose the gender')
        .oneOf([UserGender.Male, UserGender.Female], 'Invalid gender value'),
    userType: yup.string()
        .required('Please choose type ')
        .oneOf(Object.values(UserType), 'Please choose Admin or Staff'),
});

type RouteParams = {
    userId: string;
}

const EditUserPage: FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { userId } = useParams<RouteParams>();
    const navigate = useNavigate();

    const getUser = async () => {
        setIsFetching(true);
        if (userId) {
            try {
                const response = await fetchUserById(userId);
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        setIsFetching(false);
    };

    useEffect(() => {
        getUser();
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            userType: user?.type ?? '',
            gender: user?.gender ?? UserGender.Male,
            dateOfBirth: user?.dateOfBirth ? dayjs(user.dateOfBirth).startOf('day') : null,
            joinedDate: user?.joinedDate ? dayjs(user.joinedDate).startOf('day') : null,
        },
        enableReinitialize: true, // Enable reinitializing of form values when initialValues change
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                joinedDate: values.joinedDate?.toISOString(),
                dateOfBirth: values.dateOfBirth?.toISOString(),
                gender: values.gender,
                type: values.userType,
            } as EditUserRequest;
            console.log(values.joinedDate, values.joinedDate?.toISOString())
            try {
                const response = await editUserById(userId!, payload);
                const listUserPageState = {
                    alertString: `User ${values.lastName} has been successfully edited!`,
                    presetEntry: response.data,
                } as ListPageState<User>
                navigate(routeNames.user.list, { state: listUserPageState });
            } catch (error) {
                console.error('Error updating user:', error);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    if (isFetching) {
        return <Typography>Loading...</Typography>;
    }

    if (!user) {
        navigate(routeNames.notFound);
        return null;
    }

    return (
        <>
            <Helmet>
                <title>Edit User</title>
            </Helmet>
            <RootBox>
                <Stack spacing={3}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Edit User
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

export default EditUserPage;
