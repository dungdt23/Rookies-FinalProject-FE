import { Edit, HighlightOff, Refresh } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Table, TableBody, TableRow, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { MouseEvent, ReactNode, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchBar } from "../../../components/form";
import { CircularProgressWrapper } from "../../../components/loading";
import { NoStyleLink } from "../../../components/noStyleLink";
import { ListPopper } from "../../../components/popover";
import { RootListBox } from "../../../components/styledComponents";
import { ClickableTableRow, CustomTableCell, StyledTableCell, StyledTableContainer } from "../../../components/table";
import CustomTableHead, { Order, TableHeadInfo } from "../../../components/table/CustomTableHead";
import { StyledTypography } from "../../../components/typography";
import { theme } from "../../../constants/appTheme";
import { routeNames } from "../../../constants/routeName";
import { toStandardFormat } from "../../../helpers/formatDate";
import { addSpacesToCamelCase } from "../../../helpers/helper";
import { removeUndefinedValues } from "../../../helpers/removeUndefined";
import { FieldAssignmentFilter, GetAllAssignmentParams, disableAssignmentrById, fetchAllAssignments } from "../../../services/assignment.service";
import { CreateReturnRequestRequest, createReturnRequest } from "../../../services/returnRequest.service";
import { Assignment, AssignmentState } from "../../../types/assignment";
import { ListPageState } from "../../../types/common";

const allOption = {
    label: "None",
    value: ""
}

const TABLE_HEAD: TableHeadInfo[] = [
    {
        id: 'No',
        label: 'No.',
        sortable: false,
        minWidth: "3rem",
        width: "5%"
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssetCode],
        label: "Asset Code",
        sortable: true,
        minWidth: "7rem",
        width: "10%"
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssetName],
        label: "Asset Name",
        sortable: true,
        minWidth: "10rem",
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssignedTo],
        label: "Assigned To",
        sortable: true,
        minWidth: "8rem",
        width: "10%"
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssignedBy],
        label: "Assigned By",
        sortable: true,
        minWidth: "8rem",
        width: "10%"
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssignedDate],
        label: "Assigned Date",
        sortable: true,
        minWidth: "8rem",
        width: "10%"
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.State],
        label: "State",
        sortable: true,
        minWidth: "8rem",
        width: "10%"
    },
    {
        id: "action",
        label: "Action",
        minWidth: "8rem",
        width: "8rem"
    }
]


const AssignmentListPageAdmin = () => {
    const navigate = useNavigate();
    const defaultSortOrder: Order = "asc"
    const [assignments, _setAssignments] = useState<Assignment[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [assignmentState, setAssignmentState] = useState<AssignmentState | string>(allOption.value);
    const [search, setSearch] = useState<string>("");
    const [order, setOrder] = useState<Order>(defaultSortOrder);
    const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[0].id);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(15);
    const [assignedDate, setAssignedDate] = useState<Dayjs | null>();
    const [clearDate, setClearDate] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isDisabling, setIsDisabling] = useState<boolean>(false);
    const [selected, setSelected] = useState<Assignment | null>(null);
    const [rowAnchorEl, setRowAnchorEl] = useState<HTMLElement | null>(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(null);
    const [canCreateReturnRequest, setCanCreateReturnRequest] = useState<boolean>(true);
    const [createReturnRequestAnchorEl, setCreateReturnRequestDeleteAnchorEl] = useState<HTMLElement | null>(null);
    const [canDisable, setCanDisable] = useState<boolean>(true);
    const [no, setNo] = useState<number>(1);
    const [change, setChange] = useState<boolean>(true);
    const location = useLocation();


    const placeholderSearch = "Search by asset and assignee";

    const state: ListPageState<Assignment> | undefined = location.state;
    const [bool, setBool] = useState<boolean>(false);
    const setAssignments = (assignments: Assignment[]) => {
        if (!bool && state?.presetEntry) {
            // add presetEntry into assets
            console.log(state.presetEntry);

            let newArr = [state.presetEntry, ...assignments];
            let uniqueAssets = Array.from(
                new Map(newArr.map((asset) => [asset.id, asset])).values()
            );

            _setAssignments(uniqueAssets);
            setBool(true);
        } else {
            _setAssignments(assignments);
        }
        window.history.replaceState(location.pathname, "");
        if (!bool && state?.presetEntry) {
            // add presetEntry into assets
            console.log(state.presetEntry);

            let newArr = [state.presetEntry, ...assignments];
            let uniqueAssets = Array.from(
                new Map(newArr.map((asset) => [asset.id, asset])).values()
            );

            _setAssignments(uniqueAssets);
            setBool(true);
        } else {
            _setAssignments(assignments);
        }
        window.history.replaceState(location.pathname, "");
    };

    const [alert, setAlert] = useState<string | undefined>(state?.alertString);

    const getAssignments = async () => {
        setIsFetching(true);
        let params: GetAllAssignmentParams = {
            searchString: search !== "" ? search : undefined,
            isAscending: order === "asc",
            fieldFilter: FieldAssignmentFilter[orderBy as keyof typeof FieldAssignmentFilter],
            index: page,
            size: pageSize,
            stateFilter: AssignmentState[assignmentState as keyof typeof AssignmentState],
            assignedDateFilter: assignedDate ? dayjs(assignedDate).format('MM-DD-YYYY') : undefined
        };

        removeUndefinedValues<GetAllAssignmentParams>(params);

        try {
            const data = await fetchAllAssignments(params);
            setAssignments(data.data);
            setTotalCount(data.totalCount)
        } catch (error: any) {
            if (error.response.data.statusCode === 404) {
                setAssignments([]);
            }
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        setNo(pageSize * (page - 1) + 1)
        getAssignments();
    }, [assignmentState, assignedDate, search, order, orderBy, page, pageSize, change]);

    useEffect(() => {
        if (clearDate) {
            setAssignedDate(null);
            setClearDate(false);
        }
    }, [clearDate])

    const handleSearchSubmit = (searchTerm: string) => {
        const searchQuery = searchTerm;
        setSearch(searchQuery);
        setPage(1); // Reset to the first page on search
    };

    const handleStateFilter = (event: SelectChangeEvent) => {
        setAssignmentState(event.target.value as AssignmentState | "");
        setPage(1);
    };


    const handleAssignedDateChange = (value: dayjs.Dayjs | null) => {
        setChange(!change);
        setAssignedDate(null);
        _setAssignments([]);

        if (dayjs(value).isValid()) {
            setAssignedDate(value);
            setPage(1);
        } else {
            setAssignedDate(null);
            _setAssignments([]);
        }

    }

    function onRequestSort(property: string): void {
        // toggle sort
        if (orderBy === property) {
            setOrder(order === "asc" ? "desc" : "asc")
            return
        }
        setOrderBy(property);
        setOrder(defaultSortOrder);
    }

    function handleRowClick(event: MouseEvent<HTMLElement>, assignment: Assignment): void {
        setRowAnchorEl(event.currentTarget);
        setSelected(assignment);
    }

    function handleDeleteClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, assignment: Assignment): void {
        setDeleteAnchorEl(event.currentTarget);
        setSelected(assignment);
        setCanDisable(true);
    }
    function handleCreateReturnRequest(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, assignment: Assignment): void {
        setCreateReturnRequestDeleteAnchorEl(event.currentTarget);
        setSelected(assignment);
        setCanDisable(true);
        setCanCreateReturnRequest(true);
    }
    const handleEditClick = (assignment: Assignment) => {
        navigate(routeNames.assignment.edit(assignment.id));
    }

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    }

    const handleClosePopover = () => {
        setSelected(null);
        setRowAnchorEl(null);
        setDeleteAnchorEl(null);
        setCreateReturnRequestDeleteAnchorEl(null);
    };

    const deleteAssignment = async () => {
        setIsDisabling(true);
        if (!selected) {
            setIsDisabling(false);
            return
        }
        try {
            const result = await disableAssignmentrById(selected?.id);
            setCanDisable(result)
            if (result) {
                handleClosePopover()
                getAssignments()
                setAlert(`Assignment of asset ${selected?.assetName} is deleted`)
            }
        } catch (error) {
            console.error(error)
        }
        setIsDisabling(false);
    };
    const createReturnReq = async () => {
        setIsDisabling(true);
        try {
            const payload = {
                assignmentId: selected?.id
            } as CreateReturnRequestRequest;
            await createReturnRequest(payload);
            handleClosePopover();
            setAlert(`Returning request for assignment of asset ${selected?.assetName} is created`);
            getAssignments();
        } catch (error: any) {
            if (error.response.status === 409) {
                setCanCreateReturnRequest(false);
                console.log('Conflics in business');
            }
            console.error('Error creating return request:', error);
        } finally {
            setIsDisabling(false);
        }
    };
    const renderAssignmentDetailDialog = (): ReactNode => {
        if (!selected) return null;
        const assignmentDetails = [
            {
                label: "Asset Code: ",
                value: selected?.assetCode,
            },
            {
                label: "Asset Name: ",
                value: selected?.assetName,
            },
            {
                label: "Specification: ",
                value: selected?.specification,
            },
            {
                label: "Assigned to: ",
                value: selected?.assignedTo,
            },
            {
                label: "Assigned by: ",
                value: selected?.assignedBy,
            },
            {
                label: "Assigned Date: ",
                value: toStandardFormat(selected?.assignedDate),
            },
            {
                label: "State: ",
                value: addSpacesToCamelCase(addSpacesToCamelCase(AssignmentState[selected?.state])),
            },
            {
                label: "Note: ",
                value: selected?.note,
            }
        ]
        return (
            <Box sx={{ maxWidth: "30rem" }}>
                {assignmentDetails.map((item) => (
                    <Grid container spacing={2} key={item.label}>
                        <Grid item xs={4} sx={{ minWidth: "4rem" }}>
                            <StyledTypography variant="body1" gutterBottom>{item.label}</StyledTypography>
                        </Grid>
                        <Grid item xs={8}>
                            <StyledTypography variant="body1" gutterBottom>{item.value}</StyledTypography>
                        </Grid>
                    </Grid>
                ))}
            </Box>
        );
    };

    const renderCannotDisableDialog = (): ReactNode => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Typography variant="body1" gutterBottom>
                    This is a assignment that is not waiting for acceptance.
                    You can only delete assignment without this status.
                </Typography>
            </Box>
        )
    }

    const renderAssignmentDeleteDialog = (): ReactNode => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" gutterBottom>
                    Do you want to delete this assignment?
                </Typography>
                <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
                    <LoadingButton
                        loading={isDisabling}
                        type="submit"
                        variant="contained"
                        onClick={deleteAssignment}
                    >
                        Delete
                    </LoadingButton>
                    <Button variant="outlined" onClick={handleClosePopover}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        )
    }
    const renderReturnRequestCreateDialog = (): ReactNode => {
        return (
            <Box>
                <Typography variant="body1" gutterBottom>
                    Do you want to create a returning request for this asset?
                </Typography>
                <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
                    <LoadingButton
                        loading={isDisabling}
                        type="submit"
                        variant="contained"
                        onClick={createReturnReq}
                    >
                        Yes
                    </LoadingButton>
                    <Button variant="outlined" onClick={handleClosePopover}>
                        No
                    </Button>
                </Box>
            </Box>
        )
    }
    const renderCannotCreateReturnRequestDialog = (): ReactNode => {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Typography variant="body1" gutterBottom>
                    Cannot create a new returning request because this assignment has currently active return request
                    <br />
                </Typography>
            </Box>
        );
    };
    return (
        <>
            <Helmet>
                <title>Manage assignment</title>
            </Helmet>
            <RootListBox sx={{ mb: '1rem' }}>
                <Typography variant="h5" color='primary'>Assignment Management</Typography>
            </RootListBox>
            <RootListBox>
                {alert && <Alert sx={{ mb: '1rem' }} severity="success" onClose={() => setAlert(undefined)}>{alert}</Alert>}
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: '1rem' }} >
                    <FormControl>
                        <InputLabel id="state-label">State</InputLabel>
                        <Box display={'flex'}>
                            <Select labelId="state-label" label="State" value={assignmentState.toString()} onChange={handleStateFilter}
                                sx={{ minWidth: "15rem" }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="WaitingForAcceptance">Waiting For Acceptance</MenuItem>
                                <MenuItem value="Accepted">Accepted</MenuItem>
                                <MenuItem value="Declined">Declined</MenuItem>
                            </Select>
                            <Divider sx={{ height: 0, m: 1 }} orientation="vertical" />
                            <DatePicker
                                format="DD/MM/YYYY"
                                onAccept={(value) => handleAssignedDateChange(value)}
                                slotProps={{
                                    field: {
                                        readOnly: true
                                    },
                                    actionBar: {
                                        actions: ['clear'],
                                    }
                                }}
                                label="Assigned Date"
                            />
                        </Box>
                    </FormControl>
                    <Box display={'flex'} >
                        <SearchBar
                            placeholderSearch={placeholderSearch}
                            onSearchSubmit={handleSearchSubmit}
                            TextFieldProps={
                                {
                                    sx: { minWidth: "19rem" },
                                }
                            }
                        />
                        <NoStyleLink to={routeNames.assignment.create}>
                            <Button sx={{ marginLeft: "1rem", p: '0 1.5rem', height: '100%' }} variant="contained" color="primary">
                                Create New Assignment
                            </Button>
                        </NoStyleLink>
                    </Box>

                </Box>

                <StyledTableContainer>
                    <CircularProgressWrapper
                        loading={isFetching || isDisabling}
                    >
                        <Table>
                            <CustomTableHead
                                columns={TABLE_HEAD}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={onRequestSort}
                            />
                            <TableBody>

                                {assignments.map((assignment, index) => (
                                    <ClickableTableRow
                                        key={assignment.id}
                                        sx={{ backgroundColor: selected?.id === assignment.id ? theme.palette.action.hover : 'unset' }}
                                    >
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{index + no}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{assignment.assetCode}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{assignment.assetName}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{assignment.assignedTo}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{assignment.assignedBy}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{toStandardFormat(assignment.assignedDate)}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{addSpacesToCamelCase(AssignmentState[assignment.state])}</CustomTableCell>
                                        <StyledTableCell align="center">
                                            <IconButton
                                                disabled={assignment.state !== AssignmentState.WaitingForAcceptance}
                                                onClick={() => handleEditClick(assignment)}>
                                                <Edit color={assignment.state === AssignmentState.WaitingForAcceptance ? undefined : "disabled"} />
                                            </IconButton>
                                            <IconButton
                                                disabled={assignment.state === AssignmentState.Accepted}
                                                onClick={(event) => handleDeleteClick(event, assignment)}>
                                                <HighlightOff color={assignment.state === AssignmentState.Accepted ? "disabled" : "primary"} />
                                            </IconButton>
                                            {assignment.activeReturnRequestId ?
                                                (<IconButton disabled
                                                    onClick={(event) => handleCreateReturnRequest(event, assignment)}>
                                                    <Refresh color="disabled" />
                                                </IconButton>) :
                                                (<IconButton disabled={assignment.state !== AssignmentState.Accepted}
                                                    onClick={(event) => handleCreateReturnRequest(event, assignment)}>
                                                    <Refresh color={(assignment.state === AssignmentState.Accepted) ? "info" : "disabled"} />
                                                </IconButton>)
                                            }

                                        </StyledTableCell>
                                    </ClickableTableRow>
                                ))}
                                {(assignments.length === 0 && isFetching)
                                    && <TableRow style={{ height: 200 }}>
                                    </TableRow>}
                                {(assignments.length === 0 && !isFetching)
                                    && <TableRow style={{ height: 200 }}>
                                        <StyledTableCell align="center" colSpan={TABLE_HEAD.length}>
                                            <Box
                                                sx={{
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <Typography variant="h6" paragraph>
                                                    {search === "" ? "Empty!" : "Not found"}
                                                </Typography>

                                                <Typography variant="body2">
                                                    {search === "" ? "There are no records."
                                                        : (<>
                                                            No results found for{' '}
                                                            <strong>
                                                                &quot;{search}&quot;
                                                            </strong>.
                                                            <br /> Try checking for typos or using complete words.</>)}
                                                </Typography>
                                            </Box>
                                        </StyledTableCell>
                                    </TableRow>}
                            </TableBody>
                        </Table>
                    </CircularProgressWrapper>
                </StyledTableContainer>
                {totalCount !== 0
                    && <Box display="flex" justifyContent="center" p={2}>
                        <Pagination
                            count={Math.ceil(totalCount / pageSize)}
                            page={page}
                            onChange={handleChangePage}
                        />
                    </Box>}
            </RootListBox >
            <ListPopper
                elAnchor={rowAnchorEl}
                open={Boolean(rowAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => <span>Detailed Assignment Information</span>}
                renderDescription={renderAssignmentDetailDialog}
            />
            <ListPopper
                elAnchor={deleteAnchorEl}
                open={Boolean(deleteAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => canDisable ? <span>Are you sure?</span> : <span>Can not disable user</span>}
                renderDescription={canDisable ? renderAssignmentDeleteDialog : renderCannotDisableDialog}
                boxProps={{ sx: { maxWidth: '25rem' } }}
            >

            </ListPopper>
            <ListPopper
                elAnchor={createReturnRequestAnchorEl}
                open={Boolean(createReturnRequestAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => canCreateReturnRequest ? <span>Are you sure?</span> : <span>Can not create a new returning request</span>}
                renderDescription={canCreateReturnRequest ? renderReturnRequestCreateDialog : renderCannotCreateReturnRequestDialog}
            >

            </ListPopper>
        </>
    )
}

export default AssignmentListPageAdmin;