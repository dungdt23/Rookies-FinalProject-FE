import styled from "@emotion/styled"
import { Alert, Box, Divider, FormControl, IconButton, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Table, TableBody, TableRow, Typography } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"
import { MouseEvent, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { SearchBar } from "../../../components/form"
import CustomTableHead, { Order, TableHeadInfo } from "../../../components/table/CustomTableHead"
import { FieldReturnRequestFilter } from "../../../services/returnRequest.service"
import { ReturnRequest, ReturnRequestState } from "../../../types/returnRequest"
import { DatePicker } from "@mui/x-date-pickers"
import { ClickableTableRow, CustomTableCell, StyledTableCell, StyledTableContainer } from "../../../components/table"
import { CircularProgressWrapper } from "../../../components/loading"
import { theme } from "../../../constants/appTheme"
import { toStandardFormat } from "../../../helpers/formatDate"
import { addSpacesToCamelCase } from "../../../helpers/helper"
import { Check, Close } from "@mui/icons-material"
import { returnRequestsMock } from "./mockData"

const RootBox = styled(Box)(() => ({
    minWidth: '30rem',
    width: '100%',
    p: 2
}))

const TABLE_HEAD: TableHeadInfo[] = [
    {
        id: 'No',
        label: 'No.',
        sortable: false
    },
    {
        id: FieldReturnRequestFilter[FieldReturnRequestFilter.AssetCode],
        label: "Asset Code",
        sortable: true
    },
    {
        id: FieldReturnRequestFilter[FieldReturnRequestFilter.AssetName],
        label: "Asset Name",
        sortable: true
    },
    {
        id: FieldReturnRequestFilter[FieldReturnRequestFilter.RequestedBy],
        label: "Requested By",
        sortable: true
    },
    {
        id: FieldReturnRequestFilter[FieldReturnRequestFilter.AssignedDate],
        label: "Assigned Date",
        sortable: true
    },
    {
        id: FieldReturnRequestFilter[FieldReturnRequestFilter.AcceptedBy],
        label: "Accepted By",
        sortable: true
    },
    {
        id: FieldReturnRequestFilter[FieldReturnRequestFilter.ReturnedDate],
        label: "Returned Date",
        sortable: true
    },
    {
        id: FieldReturnRequestFilter[FieldReturnRequestFilter.State],
        label: "State",
        sortable: true
    },
    {
        id: "action",
        label: "Action",
    }
]

const ReturnRequestListPage = () => {
    const defaultSortOrder: Order = "asc"
    const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [returnRequestState, setReturnRequestState] = useState<ReturnRequestState | string>("");
    const [search, setSearch] = useState<string>("");
    const [order, setOrder] = useState<Order>(defaultSortOrder);
    const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[1].id);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(15);
    const [returnedDate, setReturnedDate] = useState<Dayjs | null>();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isResponding, setIsResponding] = useState<boolean>(false);
    const [selected, setSelected] = useState<ReturnRequest | null>(null);
    const [no, setNo] = useState<number>(1);


    const placeholderSearch = "Search by asset and requester";

    const [alert, setAlert] = useState<string | undefined>("");

    useEffect(() => {
        getReturnRequests();
        console.log(returnRequestState, returnedDate, page, pageSize, order, orderBy);
        
    }, [returnRequestState, returnedDate, page, pageSize, order, orderBy])

    const getReturnRequests = async () => {
        setIsFetching(true);
        // let params: GetAllAssignmentParams = {
        //     searchString: search !== "" ? search : undefined,
        //     isAscending: order === "asc",
        //     fieldFilter: FieldAssignmentFilter[orderBy as keyof typeof FieldAssignmentFilter],
        //     index: page,
        //     size: pageSize,
        //     stateFilter: AssignmentState[assignmentState as keyof typeof AssignmentState],
        //     assignedDateFilter: assignedDate ? dayjs(assignedDate).format('MM-DD-YYYY') : undefined
        // };

        // removeUndefinedValues<GetAllAssignmentParams>(params);

        try {
            const data = returnRequestsMock;
            setReturnRequests(data);
            setTotalCount(data.length)
        } catch (error: any) {
        } finally {
            setIsFetching(false);
        }
    };

    function handleReturnedDateChange(value: dayjs.Dayjs | null) {
        if (dayjs(value).isValid()) {
            setReturnedDate(value);
            setPage(1);
        } else {
            setReturnedDate(null);
            setReturnRequests([]);
        }
    }

    function handleStateFilter(event: SelectChangeEvent<string>): void {
        setReturnRequestState(event.target.value as ReturnRequestState | "");
        setPage(1);
    }

    function handleSearchSubmit(searchTerm: string): void {
        setSearch(searchTerm);
        setPage(1);
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

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    }

    function handleAcceptClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, request: ReturnRequest): void {
        throw new Error("Function not implemented.")
    }

    function handleDeclineClick(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, request: ReturnRequest): void {
        throw new Error("Function not implemented.")
    }

    return (
        <>
            <Helmet>
                <title>Request for Returning</title>
            </Helmet>
            <RootBox sx={{ mb: '1rem' }}>
                <Typography variant="h5" color='primary'>Request List</Typography>
            </RootBox>
            <RootBox>
                {alert && <Alert sx={{ mb: '1rem' }} severity="success" onClose={() => setAlert(undefined)}>{alert}</Alert>}
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: '1rem' }} >
                    <FormControl>
                        <InputLabel id="state-label">State</InputLabel>
                        <Box display={'flex'}>
                            <Select labelId="state-label" label="State" value={returnRequestState.toString()} onChange={handleStateFilter}
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
                                onAccept={(value) => handleReturnedDateChange(value)}
                                slotProps={{
                                    field: {
                                        readOnly: true
                                    },
                                    actionBar: {
                                        actions: ['clear'],
                                    }
                                }}
                                label="Returned Date"
                            />
                        </Box>
                    </FormControl>
                    <Box display={'flex'} >
                        <SearchBar
                            placeholderSearch={placeholderSearch}
                            onSearchSubmit={handleSearchSubmit}
                            TextFieldProps={
                                {
                                    sx: { minWidth: "26rem" },
                                }
                            }
                        />
                    </Box>
                </Box>
                <StyledTableContainer>
                    <CircularProgressWrapper
                        loading={isFetching || isResponding}>
                        <Table>
                            <CustomTableHead
                                columns={TABLE_HEAD}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={onRequestSort}
                            />
                            <TableBody>
                                {returnRequests.map((request, index) => (
                                    <ClickableTableRow
                                        key={request.id}
                                        sx={{ backgroundColor: selected?.id === request.id ? theme.palette.action.hover : 'unset' }}
                                    >
                                        <CustomTableCell>{index + no}</CustomTableCell>
                                        <CustomTableCell>{request.assetCode}</CustomTableCell>
                                        <CustomTableCell>{request.assetId}</CustomTableCell>
                                        <CustomTableCell>{request.requestedBy}</CustomTableCell>
                                        <CustomTableCell>{toStandardFormat(request.assignedDate)}</CustomTableCell>
                                        <CustomTableCell>{request.acceptedBy}</CustomTableCell>
                                        <CustomTableCell>{request.returnedDate ? toStandardFormat(request.returnedDate) : undefined}</CustomTableCell>
                                        <CustomTableCell>{addSpacesToCamelCase(ReturnRequestState[request.state])}</CustomTableCell>
                                        <StyledTableCell>
                                            <IconButton
                                                disabled={request.state !== ReturnRequestState.WaitingForReturning}
                                                onClick={(event) => handleAcceptClick(event, request)}>
                                                <Check color={request.state === ReturnRequestState.WaitingForReturning ? "primary" : "disabled"} />
                                            </IconButton>
                                            <IconButton
                                                disabled={request.state !== ReturnRequestState.WaitingForReturning}
                                                onClick={(event) => handleDeclineClick(event, request)}>
                                                <Close color={request.state === ReturnRequestState.WaitingForReturning ? undefined : "disabled"} />
                                            </IconButton>
                                        </StyledTableCell>
                                    </ClickableTableRow>
                                ))}
                                {(returnRequests.length === 0 && isFetching)
                                    && <TableRow style={{ height: 200 }}>
                                    </TableRow>}
                                {(returnRequests.length === 0 && !isFetching)
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
            </RootBox>
        </>
    )
}

export default ReturnRequestListPage