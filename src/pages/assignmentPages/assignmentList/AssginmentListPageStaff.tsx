import { Check, Close, Refresh } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Grid, IconButton, Pagination, Table, TableBody, TableContainer, TableRow, Typography, styled } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { MouseEvent, ReactNode, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { CircularProgressWrapper } from "../../../components/loading";
import { ListPopper } from "../../../components/popover";
import { ClickableTableRow, CustomTableCell, StyledTableCell } from "../../../components/table";
import CustomTableHead, { Order, TableHeadInfo } from "../../../components/table/CustomTableHead";
import { StyledTypography } from "../../../components/typography";
import { theme } from "../../../constants/appTheme";
import { toStandardFormat } from "../../../helpers/formatDate";
import { addSpacesToCamelCase } from "../../../helpers/helper";
import { removeUndefinedValues } from "../../../helpers/removeUndefined";
import { FieldAssignmentFilter, GetAllAssignmentParams, RespondAssignmentRequest, fetchAllAssignments, respondAssignmentById } from "../../../services/assignment.service";
import { Assignment, AssignmentState } from "../../../types/assignment";
import { ListPageState } from "../../../types/common";
import { CreateReturnRequestRequest, createReturnRequest } from "../../../services/returnRequest.service";
import { RootListBox } from "../../../components/styledComponents";

const StyledTableContainer = styled(TableContainer)(() => ({
    border: '0px',
}))

const TABLE_HEAD: TableHeadInfo[] = [
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssetCode],
        label: "Asset Code",
        sortable: true
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssetName],
        label: "Asset Name",
        sortable: true
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssignedTo],
        label: "Assigned To",
        sortable: true
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssignedBy],
        label: "Assigned By",
        sortable: true
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssignedDate],
        label: "Assigned Date",
        sortable: true
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.State],
        label: "State",
        sortable: true
    },
    {
        id: "action",
        label: "Action",
    }
]


const AssignmentListPageStaff = () => {
    const defaultSortOrder: Order = "asc"
    const [assignments, _setAssignments] = useState<Assignment[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [order, setOrder] = useState<Order>(defaultSortOrder);
    const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[0].id);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(15);
    const [assignedDate, setAssignedDate] = useState<Dayjs | null>();
    const [clearDate, setClearDate] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isDisabling, setIsDisabling] = useState<boolean>(false);
    const [selected, setSelected] = useState<Assignment | null>(null);
    const [canCreateReturnRequest, setCanCreateReturnRequest] = useState<boolean>(true);
    const [createReturnRequestAnchorEl, setCreateReturnRequestDeleteAnchorEl] = useState<HTMLElement | null>(null);
    const [rowAnchorEl, setRowAnchorEl] = useState<HTMLElement | null>(null);
    const [respondAnchorEl, setRespondAnchorEl] = useState<HTMLElement | null>(null);
    const [canRespond, setCanRespond] = useState<boolean>(true);
    const [isAccept, setIsAccpet] = useState<boolean>(false);
    const location = useLocation();


    const state: ListPageState<Assignment> | undefined = location.state;

    const [alert, setAlert] = useState<string | undefined>(state?.alertString);

    const getAssignments = async () => {
        setIsFetching(true);
        let params: GetAllAssignmentParams = {
            own: true,
            isAscending: order === "asc",
            fieldFilter: FieldAssignmentFilter[orderBy as keyof typeof FieldAssignmentFilter],
            index: page,
            size: pageSize,
            assignedDateFilter: assignedDate ? dayjs(assignedDate).format('MM-DD-YYYY') : undefined
        };

        removeUndefinedValues<GetAllAssignmentParams>(params);

        try {
            const data = await fetchAllAssignments(params);
            _setAssignments(data.data);
            setTotalCount(data.totalCount)
        } catch (error: any) {
            if (error.response.data.statusCode === 404) {
                _setAssignments([]);
            }
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        getAssignments();
    }, [assignedDate, order, orderBy, page, pageSize]);

    useEffect(() => {
        if (clearDate) {
            setAssignedDate(null);
            setClearDate(false);
        }
    }, [clearDate])

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
        setIsAccpet(false);
        setRespondAnchorEl(event.currentTarget);
        setSelected(assignment);
        setCanRespond(true);
    }
    function handleCreateReturnRequest(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, assignment: Assignment): void {
        setCreateReturnRequestDeleteAnchorEl(event.currentTarget);
        setSelected(assignment);
        setCanCreateReturnRequest(true);
    }
    const handleRespondClick = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, assignment: Assignment) => {
        setIsAccpet(true);
        setRespondAnchorEl(event.currentTarget);
        setSelected(assignment);
        setCanRespond(true);
    }

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    }

    const handleClosePopover = () => {
        setSelected(null);
        setRowAnchorEl(null);
        setRespondAnchorEl(null);
        setCreateReturnRequestDeleteAnchorEl(null); 
    };

    const respondAssignment = async () => {
        setIsDisabling(true);
        if (!selected) {
            setIsDisabling(false);
            return
        }
        try {
            const payload = {
                assignmentId: selected?.id,
                isAccept: isAccept
            } as RespondAssignmentRequest;
            const result = await respondAssignmentById(payload);
            const statusCode = result.statusCode;
            setCanRespond(statusCode === 200)
            if (statusCode === 200) {
                handleClosePopover()
                getAssignments()
                setAlert(`Assignment of asset ${selected?.assetName} is ${isAccept ? "accepted" : "denied"}`)
            }
        } catch (error) {
            console.error(error)
        }
        setIsDisabling(false);
    }
    const createReturnReq = async () => {
        setIsDisabling(true);
        try {
            const payload = {
                assignmentId: selected?.id
            } as CreateReturnRequestRequest;
            const response = await createReturnRequest(payload);
            handleClosePopover();
            setAlert(`Returning request for assignment of asset ${selected?.assetName} is created`);
            getAssignments();
        } catch (error: any) {
            if (error.response.status === 409)
            {
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
                value: addSpacesToCamelCase(AssignmentState[selected?.state]),
            },
            {
                label: "Note: ",
                value: selected?.note,
            }
        ]
        return (
            <Box>
                {assignmentDetails.map((item) => (
                    <Grid container spacing={2} key={item.label}>
                        <Grid item xs={4}>
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

    const renderAssignmentRespondDialog = (): ReactNode => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" gutterBottom>
                    Do you want to {isAccept ? "accept" : "decline"} this assignment?
                </Typography>
                <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
                    <LoadingButton
                        loading={isDisabling}
                        type="submit"
                        variant="contained"
                        onClick={respondAssignment}
                    >
                        Yes
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
                        onClick = {createReturnReq}
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
              Cannot create a new returning request because this assignment has currently active returning request
              <br />
            </Typography>
          </Box>
        );
      };
    return (
        <>
            <Helmet>
                <title>My Assignment</title>
            </Helmet>
            <RootListBox sx={{ mb: '1rem' }}>
                <Typography variant="h5" color='primary'>My Assignment</Typography>
            </RootListBox>
            <RootListBox>
                {alert && <Alert sx={{ mb: '1rem' }} severity="success" onClose={() => setAlert(undefined)}>{alert}</Alert>}

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
                                {assignments.map((assignment) => (
                                    <ClickableTableRow
                                        key={assignment.id}
                                        sx={{ backgroundColor: selected?.id === assignment.id ? theme.palette.action.hover : 'unset' }}
                                    >
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{assignment.assetCode}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{assignment.assetName}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{assignment.assignedTo}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{assignment.assignedBy}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{toStandardFormat(assignment.assignedDate)}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, assignment)}>{addSpacesToCamelCase(AssignmentState[assignment.state])}</CustomTableCell>
                                        <StyledTableCell align="center">
                                            <IconButton
                                                disabled={assignment.state !== AssignmentState.WaitingForAcceptance}
                                                onClick={(event) => handleRespondClick(event, assignment)}>
                                                <Check color={assignment.state === AssignmentState.WaitingForAcceptance ? "primary" : "disabled"} />
                                            </IconButton>
                                            <IconButton
                                                disabled={assignment.state !== AssignmentState.WaitingForAcceptance}
                                                onClick={(event) => handleDeleteClick(event, assignment)}>
                                                <Close color={assignment.state === AssignmentState.WaitingForAcceptance ? "primary" : "disabled"} />
                                            </IconButton>
                                            <IconButton disabled={assignment.state === AssignmentState.WaitingForAcceptance}
                                                onClick={(event) => handleCreateReturnRequest(event, assignment)}>
                                                <Refresh color={assignment.state !== AssignmentState.WaitingForAcceptance ? "info" : "disabled"} />
                                            </IconButton>
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
                                                    Empty!
                                                </Typography>

                                                <Typography variant="body2">
                                                    There are no records.
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
                boxProps={{ sx: { minWidth: '25rem' } }}
            />
            <ListPopper
                elAnchor={respondAnchorEl}
                open={Boolean(respondAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => canRespond ? <span>Are you sure?</span> : <span>Can not respond user</span>}
                renderDescription={renderAssignmentRespondDialog}
                boxProps={{ sx: { maxWidth: '25rem' } }}
            />
            <ListPopper
                elAnchor={createReturnRequestAnchorEl}
                open={Boolean(createReturnRequestAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => canCreateReturnRequest ? <span>Are you sure?</span> : <span>Can not create a new returning request</span> }
                renderDescription={canCreateReturnRequest ? renderReturnRequestCreateDialog : renderCannotCreateReturnRequestDialog}
            >

            </ListPopper>
        </>
    )
}

export default AssignmentListPageStaff;