import { Box, Button, Divider, FormControl, IconButton, InputBase, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableContainer, Typography, styled } from "@mui/material";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Assignment, AssignmentState } from "../../types/assignment";
import { Search } from "@mui/icons-material";
import { NoStyleLink } from "../../components/noStyleLink";
import { routeNames } from "../../constants/routeName";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { CircularProgressWrapper } from "../../components/loading";
import CustomTableHead, { Order, TableHeadInfo } from "../../components/table/CustomTableHead";
import { FieldAssignmentFilter, GetAllAssignmentParams, fetchAllAssignments } from "../../services/assignment.service";
import { removeUndefinedValues } from "../../helpers/removeUndefined";
import { UserType } from "../../types/user";

const RootBox = styled(Box)(() => ({
    minWidth: '30rem',
    width: '100%',
    p: 2
}))

const allOption = {
    label: "None",
    value: ""
}

const StyledTableContainer = styled(TableContainer)(() => ({
    border: '0px',
}))

const TABLE_HEAD : TableHeadInfo[] =[
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssetCode],
        label: "Staff Code",
        sortable: true
    },
    {
        id: FieldAssignmentFilter[FieldAssignmentFilter.AssetName],
        label: "Staff Name",
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


const AssignmentListPage = () => {
    const defaultSortOrder: Order = "asc"
    const [assignments , _setAssignments] = useState<Assignment[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [assignmentState, setAssignmentState] = useState<AssignmentState | string>(allOption.value);
    const [search, setSearch] = useState<string>("");
    const [order, setOrder] = useState<Order>(defaultSortOrder);
    const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[0].id);
    const [page, setPage] = useState<number>(1);
    const [assignedDate , setAssignedDate] = useState<Dayjs | null>();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isDisabling, setIsDisabling] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const placeholderSearch = "Search assignment by asset and asssignee";

    const getAssignments = async () => {
        setIsFetching(true);
        let params: GetAllAssignmentParams = {
            locationId: "",
            userType: UserType.Admin,
            isAscending: false,
            fieldFilter: FieldAssignmentFilter.AssetCode,
            index: 0,
            size: 0
        };

        removeUndefinedValues<GetAllAssignmentParams>(params);

        try {
            const data = await fetchAllAssignments(params);
            _setAssignments(data.data);
            setTotalCount(data.totalCount)
        } catch (error) {
        } finally {
            setIsFetching(false);
        }
    };

    const handleSearchSubmit = () => {
        if (inputRef.current) {
            const searchQuery = inputRef.current.value;
            setSearch(searchQuery);
            setPage(1); // Reset to the first page on search
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const handleStateFilter = (event: SelectChangeEvent) => {
        setAssignmentState(event.target.value as AssignmentState | "");
    };

    const handleAssignedDateChange = (value: dayjs.Dayjs | null) => {
        setAssignedDate(value as Dayjs | null);
        console.log(assignedDate);
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

    return (
        <>
            <Helmet>
                <title>Manage assignment</title>
            </Helmet>
            <RootBox sx={{ mb: '1rem' }}>
                <Typography variant="h5" color='primary'>Assignment Management</Typography>
            </RootBox>
            <RootBox>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: '1rem' }} >
                    <FormControl>
                        <InputLabel id="state-label">State</InputLabel>
                        <Box display={'flex'}>
                            <Select labelId="state-label" label="State" value={assignmentState} onChange={handleStateFilter}
                                sx={{ minWidth: "15rem" }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="WaitingForAcceptance">Waiting For Acceptance</MenuItem>
                                <MenuItem value="Accepted">Accepted</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                            <Divider sx={{ height: 0, m: 1 }} orientation="vertical" />
                            <DatePicker
                                format="DD/MM/YYYY"
                                value={assignedDate}
                                onChange={(value) => dayjs(value).isValid() && handleAssignedDateChange(value)}
                                label = "Assigned Date"
                            />
                        </Box>
                    </FormControl>
                    <Box display={'flex'}>
                        <Paper
                            variant="outlined"
                            sx={{ padding: '0 0.5rem', display: 'flex', alignItems: 'center', minWidth: '20rem' }}
                        >
                            <InputBase
                                inputRef={inputRef}
                                sx={{ ml: 1, flex: 1, minWidth: "20rem" }}
                                placeholder={placeholderSearch}
                                inputProps={{ 'aria-label': 'search google maps' }}
                                onKeyUp={handleKeyPress}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchSubmit}>
                                <Search />
                            </IconButton>
                        </Paper>
                        <NoStyleLink to={routeNames.assignment.create}>
                            <Button sx={{ marginLeft: "1rem", p: '0 1.5rem', height: '100%' }} variant="contained" color="primary">
                                Create New Assignment
                            </Button>
                        </NoStyleLink>
                    </Box>

                </Box>
            </RootBox>
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
                        </Table>
                </CircularProgressWrapper>
            </StyledTableContainer>
        </>
    )
}

export default AssignmentListPage;