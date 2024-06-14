import { Edit, HighlightOff, Search } from "@mui/icons-material";
import { Alert, Box, Button, Divider, Grid, IconButton, InputBase, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Skeleton, styled, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NoStyleLink } from "../../../components/noStyleLink";
import { CustomPopover } from "../../../components/popover";
import { CustomTableCell, CustomTableHead, StyledTableCell } from "../../../components/table";
import { Order, TableHeadInfo } from "../../../components/table/CustomTableHead";
import { routeNames } from "../../../constants/routeName";
import { User, UserType } from "../../../types/user";
import { fetchAllUser, FieldFilter, GetAllUserParams } from "../../../services/user.service";
import { ListPageProps } from "../../../types/common";
import { toStandardFormat } from "../../../helpers/formatDate";
import { removeUndefinedValues } from "../../../helpers/removeUndefined";

const RootBox = styled(Box)(() => ({
    minWidth: '30rem',
    width: '100%',
}))

const StyledTableContainer = styled(TableContainer)(() => ({
    border: '0px',
}))


const TABLE_HEAD: TableHeadInfo[] = [
    {
        id: "staffCode",
        label: "Staff Code",
        sortable: true
    },
    {
        id: "fullName",
        label: "Full Name",
        sortable: true
    },
    {
        id: "username",
        label: "Username",
    },
    {
        id: "joinedDate",
        label: "Joined Date",
        sortable: true
    },
    {
        id: "type",
        label: "Type",
    },
    {
        id: "action",
        label: "Action",
    },
]



const UserListPage: FC<ListPageProps> = ({ alertString }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [userType, setUserType] = useState<UserType | "all">("all");
    const [search, setSearch] = useState<string>("");
    const [order, setOrder] = useState<Order>("desc");
    const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[0].id);
    const [rowAnchorEl, setRowAnchorEl] = useState<HTMLElement | null>(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(null);
    const [alert, setAlert] = useState<string | undefined>(alertString);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [selected, setSelected] = useState<User | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null);

    const getUsers = async () => {
        setIsFetching(true);
        let params: GetAllUserParams = {
            userType: userType === "all" ? undefined : userType,
            searchString: search !== "" ? search : undefined,
            isAscending: order === "asc",
            index: page,
            size: pageSize,
            fieldFilter: FieldFilter[orderBy as keyof typeof FieldFilter],
        };

        removeUndefinedValues<GetAllUserParams>(params);

        try {
            const data = await fetchAllUser(params);
            setUsers(data.data);
            setTotalCount(data.totalCount)
        } catch (error) {
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, [userType, search, order, orderBy, page, pageSize]);

    const handleTypeFilter = (event: SelectChangeEvent) => {
        setUserType(event.target.value as UserType | "all");
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    }

    const onRequestSort = (property: string) => {
        if (orderBy === property) {
            setOrder(order === "asc" ? "desc" : "asc")
            return
        }
        setOrderBy(property);
        setOrder("desc");
    }

    const handleRowClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setRowAnchorEl(event.currentTarget);
        setSelected(user);
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setDeleteAnchorEl(event.currentTarget);
        setSelected(user);
    };

    const handleClosePopover = () => {
        setRowAnchorEl(null);
        setDeleteAnchorEl(null);
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

    const renderUserDetail = () => {
        if (!selected) return null;
        return (
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                            <Typography variant="subtitle1">Id:</Typography>
                            <Typography variant="subtitle1">Staff Code:</Typography>
                            <Typography variant="subtitle1">First Name:</Typography>
                            <Typography variant="subtitle1">Last Name:</Typography>
                            <Typography variant="subtitle1">Username:</Typography>
                            <Typography variant="subtitle1">Joined Date:</Typography>
                            <Typography variant="subtitle1">Type Gender:</Typography>
                            <Typography variant="subtitle1">Type:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                            <Typography variant="body1">{selected.id}</Typography>
                            <Typography variant="body1">{selected.staffCode}</Typography>
                            <Typography variant="body1">{selected.firstName}</Typography>
                            <Typography variant="body1">{selected.lastName}</Typography>
                            <Typography variant="body1">{selected.userName}</Typography>
                            <Typography variant="body1">{toStandardFormat(selected.joinedDate)}</Typography>
                            <Typography variant="body1">{selected.typeGender}</Typography>
                            <Typography variant="body1">{selected.type}</Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    return (
        <>
            <Helmet>
                <title>Manage User</title>
            </Helmet>
            <RootBox>
                {alert && <Alert severity="success" onClose={() => setAlert(undefined)}></Alert>}
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <Select size="small" value={userType} onChange={handleTypeFilter}>
                        <MenuItem value="all">
                            <em>Type</em>
                        </MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Staff">Staff</MenuItem>
                    </Select>
                    <Box display={'flex'}>
                        <Paper
                            variant="outlined"
                            sx={{ padding: '0 0.5rem', display: 'flex', alignItems: 'center', minWidth: '20rem' }}
                        >
                            <InputBase
                                inputRef={inputRef}
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search user by code and name"
                                inputProps={{ 'aria-label': 'search google maps' }}
                                onKeyUp={handleKeyPress}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchSubmit}>
                                <Search />
                            </IconButton>
                        </Paper>
                        <NoStyleLink to={routeNames.user.create}>
                            <Button sx={{ marginLeft: "1rem", p: '0 1.5rem', height: '100%' }} variant="contained" color="primary">
                                Create New User
                            </Button>
                        </NoStyleLink>
                    </Box>
                </Box>
                <StyledTableContainer>
                    <Table>
                        <CustomTableHead
                            columns={TABLE_HEAD}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={onRequestSort} />
                        <TableBody>
                            {users.map((user) => (
                                <TableRow
                                    key={user.id}
                                >
                                    <CustomTableCell onClick={(event) => handleRowClick(event, user)}>{user.staffCode}</CustomTableCell>
                                    <CustomTableCell onClick={(event) => handleRowClick(event, user)}>{user.firstName + " " + user.lastName}</CustomTableCell>
                                    <CustomTableCell onClick={(event) => handleRowClick(event, user)}>{user.userName}</CustomTableCell>
                                    <CustomTableCell onClick={(event) => handleRowClick(event, user)}>{toStandardFormat(user.joinedDate)}</CustomTableCell>
                                    <CustomTableCell onClick={(event) => handleRowClick(event, user)}>{user.type}</CustomTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={(event) => handleDeleteClick(event, user)}>
                                            <HighlightOff />
                                        </IconButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                            {(users.length === 0 && isFetching == false)
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
                                                        No results found for &nbsp;
                                                        <strong>&quot;{search}&quot;</strong>.
                                                        <br /> Try checking for typos or using complete words.</>)}
                                            </Typography>
                                        </Box>
                                    </StyledTableCell>
                                </TableRow>}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
                <Box display="flex" justifyContent="center" p={2}>
                    <Pagination
                        count={Math.ceil(totalCount / pageSize)}
                        page={page}
                        onChange={handleChangePage}
                    />
                </Box>
            </RootBox>
            <CustomPopover
                elAnchor={rowAnchorEl}
                open={Boolean(rowAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => <span>Detailed User Information</span>}
                renderDescription={renderUserDetail}
                boxProps={{ sx: { minWidth: '25rem' } }}
            />
            <CustomPopover
                elAnchor={deleteAnchorEl}
                open={Boolean(deleteAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => <span>Are you sure?</span>}
                renderDescription={() => <span>Delete this user?</span>}
                boxProps={{ sx: { minWidth: '25rem' } }}
            >

            </CustomPopover>
        </>
    )
}

export default UserListPage;