import { Search } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, InputAdornment, Stack, styled, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { NoStyleLink } from '../../components/noStyleLink';
import { routeNames } from '../../constants/routeName';
import { toISOStringWithoutTimezone } from '../../helpers/helper';
import { createAssignment, CreateAssignmentRequest } from '../../services/assignment.service';
import { Asset } from '../../types/asset';
import { Assignment } from '../../types/assignment';
import { ListPageState } from '../../types/common';
import { User } from '../../types/user';
import AssetSelectionDialog from './AssetSelectionDialog';
import UserSelectionDialog from './UserSelectionDialog';

const RootBox = styled(Box)(() => ({
    maxWidth: '100vh',
    margin: 'auto'
}));

// Custom validation functions using dayjs
const isAfterOrEqual = (a: Dayjs, b: Dayjs) => dayjs(a).add(1, 'day').isAfter(b);
const isWeekday = (date: Dayjs) => dayjs(date).day() !== 0 && dayjs(date).day() !== 6;

// Validation schema
const validationSchema = yup.object({
    asset: yup.object().nullable().required('Please select an asset'),
    user: yup.object().nullable().required('Please select a user'),
    note: yup.string().max(500, "The note's length should not exceed 500 characters."),
    assignedDate: yup.object().nullable().required('Please choose assigned date')
        .test('is-weekday', 'Assigned date is Saturday or Sunday. Please select a different date', function (value) {
            return isWeekday(value as Dayjs);
        }),
});

const CreateAssignmentPage: FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [userDialog, setUserDialog] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [assetDialog, setAssetDialog] = useState<boolean>(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const formik = useFormik({
        initialValues: {
            asset: null as Asset | null,
            user: null as User | null,
            note: '',
            assignedDate: null as Dayjs | null,
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

    const handleUserDialogClose = () => {
        setUserDialog(false);
    }

    const handleAssetTextfieldClick = () => {
        setAssetDialog(true);
    }

    const handleAssetDialogClose = () => {
        setAssetDialog(false);
    }

    const handleSelectUser = (user: User | null) => {
        setSelectedUser(user);
        formik.setFieldValue('user', user);
    };

    const handleSelectAsset = (asset: Asset | null): void => {
        setSelectedAsset(asset);
        formik.setFieldValue('asset', asset);
    };

    return (
        <>
            <Helmet>
                <title>Create Assignment</title>
            </Helmet>
            <RootBox>
                <Stack spacing={3}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Create Assignment
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id="user"
                                    fullWidth
                                    label="User"
                                    placeholder='User'
                                    value={selectedUser ? `${selectedUser.lastName} ${selectedUser.firstName}` : ""}
                                    InputLabelProps={{ shrink: Boolean(selectedUser) }}
                                    onClick={handleUserTextfieldClick}
                                    InputProps={{
                                        readOnly: true,
                                        
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <>
                                                    <IconButton
                                                        sx={{ p: '10px' }}
                                                        aria-label="search"
                                                    >
                                                        <Search />
                                                    </IconButton>
                                                </>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={formik.touched.user && Boolean(formik.errors.user)}
                                    helperText={formik.touched.user && formik.errors.user}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="asset"
                                    fullWidth
                                    label="Asset"
                                    value={selectedAsset ? selectedAsset.assetName : ""}
                                    placeholder='Asset'
                                    onClick={handleAssetTextfieldClick}
                                    InputLabelProps={{ shrink: Boolean(selectedAsset) }}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <>
                                                    <IconButton
                                                        sx={{ p: '10px' }}
                                                        aria-label="search"
                                                    >
                                                        <Search />
                                                    </IconButton>
                                                </>
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
                                    value={formik.values.assignedDate}
                                    onChange={(value) => dayjs(value).isValid() && formik.setFieldValue('assignedDate', value, true)}
                                    slotProps={{
                                        textField: {
                                            id: "assignedDate",
                                            name: "assignedDate",
                                            label: "Assigned Date",
                                            error: Boolean(formik.errors.assignedDate),
                                            helperText: formik.errors.assignedDate,
                                            fullWidth: true,
                                            required: true,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    fullWidth
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
                onClose={handleUserDialogClose}
                onSelectSave={handleSelectUser}
            />
            <AssetSelectionDialog
                open={assetDialog}
                onClose={handleAssetDialogClose}
                onSelectSave={handleSelectAsset}
            />
        </>
    );
};

export default CreateAssignmentPage;
