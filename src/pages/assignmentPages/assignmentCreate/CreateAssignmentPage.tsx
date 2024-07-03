import { Search } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { RootBox } from '../../../components/form';
import { NoStyleLink } from '../../../components/noStyleLink';
import { routeNames } from '../../../constants/routeName';
import { isValidDate, isWithinAllowedRange, maxSelectDate, toISOStringWithoutTimezone } from '../../../helpers/helper';
import { createAssignment, CreateAssignmentRequest } from '../../../services/assignment.service';
import { Asset } from '../../../types/asset';
import { Assignment } from '../../../types/assignment';
import { ListPageState } from '../../../types/common';
import { User } from '../../../types/user';
import AssetSelectionDialog from './AssetSelectionDialog';
import UserSelectionDialog from './UserSelectionDialog';

// Custom validation functions using dayjs
const isAfterOrEqual = (a: Dayjs, b: Dayjs) => dayjs(a).add(1, 'day').isAfter(b);

// Validation schema
const validationSchema = yup.object({
    asset: yup.object().nullable().required('Please select an asset'),
    user: yup.object().nullable().required('Please select a user'),
    note: yup.string().max(500, "The note's length should not exceed 500 characters."),
    assignedDate: yup.mixed().nullable().required('Please choose assigned date')
        .test('is-valid', 'Please enter a valid date.', function (value) {
            return isValidDate(value)
        })
        .test('is-within-range', 'Please enter a valid date.', function (value) {
            return isWithinAllowedRange(value as Dayjs)
        })
        .test('is-present-or-future', 'The Assigned date is in the past. Please select another date.', function (value) {
            return isAfterOrEqual(value as Dayjs, dayjs())
        })
});

const CreateAssignmentPage: FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [userDialog, setUserDialog] = useState<boolean>(false);
    const [assetDialog, setAssetDialog] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            asset: null as Asset | null,
            user: null as User | null,
            note: '',
            assignedDate: dayjs() as Dayjs | null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            const payload = {
                assetId: values.asset?.id,
                assigneeId: values.user?.id,
                note: values.note,
                assignedDate: toISOStringWithoutTimezone(values.assignedDate!),
            } as CreateAssignmentRequest;

            try {
                const response = await createAssignment(payload);
                const assignment = response.data;
                const listAssignmentPageState = {
                    alertString: `Assignment ${assignment.assetName} has been created!`,
                    presetEntry: assignment,
                } as ListPageState<Assignment>;
                navigate(routeNames.assignment.list, { state: listAssignmentPageState });
            } catch (error) {
                console.error('Error creating assignment:', error);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleUserTextfieldClick = () => {
        setUserDialog(true);
    }

    const handleUserDialogClose = async () => {
        setUserDialog(false);
        await formik.validateField('user')
        formik.setFieldTouched('user', true)
    }

    const handleAssetTextfieldClick = () => {
        setAssetDialog(true);
    }

    const handleAssetDialogClose = async () => {
        setAssetDialog(false);
        await formik.validateField('asset')
        formik.setFieldTouched('asset', true)
    }

    const handleSelectUser = (user: User | null) => {
        formik.setFieldValue('user', user);
        formik.validateField('user')
    };

    const handleSelectAsset = (asset: Asset | null): void => {
        formik.setFieldValue('asset', asset);
        formik.validateField('asset')
    };

    const handleAssignedDateChanges = (value: Dayjs | null) => {
        formik.setFieldTouched('assignedDate', true)
        formik.setFieldValue('assignedDate', value, true)
    }

    const handleAssignedDateBlur = () => {
        formik.setFieldTouched('assignedDate', true)
    }

    return (
        <>
            <Helmet>
                <title>Create New Assignment</title>
            </Helmet>
            <RootBox>
                <Stack spacing={3}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Create New Assignment
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="user"
                                    fullWidth
                                    label="User"
                                    placeholder='User'
                                    value={formik.values.user ? `${formik.values.user.staffCode} ${formik.values.user.firstName} ${formik.values.user.lastName}` : ""}
                                    InputLabelProps={{ shrink: Boolean(formik.values.user) }}
                                    onClick={handleUserTextfieldClick}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{ p: '10px' }}
                                                    aria-label="search"
                                                >
                                                    <Search />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={formik.touched.user && Boolean(formik.errors.user)}
                                    helperText={formik.touched.user && formik.errors.user}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="asset"
                                    fullWidth
                                    label="Asset"
                                    value={formik.values.asset ? `${formik.values.asset.assetCode} ${formik.values.asset.assetName}` : ""}
                                    placeholder='Asset'
                                    onClick={handleAssetTextfieldClick}
                                    InputLabelProps={{ shrink: Boolean(formik.values.asset) }}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{ p: '10px' }}
                                                    aria-label="search"
                                                >
                                                    <Search />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={formik.touched.asset && Boolean(formik.errors.asset)}
                                    helperText={formik.touched.asset && formik.errors.asset}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    minDate={dayjs()}
                                    maxDate={maxSelectDate}
                                    value={formik.values.assignedDate}
                                    onChange={handleAssignedDateChanges}
                                    slotProps={{
                                        textField: {
                                            id: "assignedDate",
                                            name: "assignedDate",
                                            label: "Assigned Date",
                                            onBlur: handleAssignedDateBlur,
                                            error: formik.touched.assignedDate && Boolean(formik.errors.assignedDate),
                                            helperText: formik.touched.assignedDate && formik.errors.assignedDate,
                                            fullWidth: true,
                                            required: true,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    id="note"
                                    name="note"
                                    label="Note"
                                    value={formik.values.note}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.note && Boolean(formik.errors.note)}
                                    helperText={formik.touched.note && formik.errors.note}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: '1rem' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={!(formik.isValid && formik.dirty) || isSubmitting}
                                    >
                                        Save
                                    </Button>
                                    <NoStyleLink to={routeNames.assignment.list}>
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
            <UserSelectionDialog
                open={userDialog}
                selected={formik.values.user || undefined}
                handleClose={handleUserDialogClose}
                onSelectSave={handleSelectUser}
            />
            <AssetSelectionDialog
                open={assetDialog}
                selected={formik.values.asset || undefined}
                handleClose={handleAssetDialogClose}
                onSelectSave={handleSelectAsset}
            />
        </>
    );
};

export default CreateAssignmentPage;
