import { Edit, HighlightOff, Search } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, InputBase, MenuItem, Pagination, Paper, Select, SelectChangeEvent, styled, Table, TableBody, TableContainer, TableRow } from "@mui/material";
import { FC, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NoStyleLink } from "../../../components/noStyleLink";
import { CustomPopover } from "../../../components/popover";
import { CustomTableCell, CustomTableHead, StyledTableCell } from "../../../components/table";
import { Order, TableHeadInfo } from "../../../components/table/CustomTableHead";
import { routeNames } from "../../../constants/routeName";
import { User, UserType } from "../../../types/user";

interface UserListResponse {
    data: User[],
    totalCount: number,
    page: number,
    pageSize: number
}

const users = [
    { id: 'SD1901', name: 'An Nguyen Thuy', username: 'annt', joined: '20/06/2019', type: 'Staff' },
    // Add other users here...
];

const RootBox = styled(Box)(() => ({
    minWidth: '30rem',
    width: '100%',
}))

const StyledTableContainer = styled(TableContainer)(() => ({
    border: '0px',
}))


const TABLE_HEAD: TableHeadInfo[] = [
    {
        id: "code",
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
        sortable: true
    },
]

const UserListPage: FC = () => {
    const [userType, setUserType] = useState<UserType | "all">("all");
    const [search, setSearch] = useState<string>("");
    const [order, setOrder] = useState<Order>("desc");
    const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[0].id);
    const [rowAnchorEl, setRowAnchorEl] = useState<HTMLElement | null>(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleTypeFilter = (event: SelectChangeEvent) => {
        setUserType(event.target.value as UserType | "all");
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const onRequestSort = (property: string) => {
        if (orderBy === property) {
            setOrder(order === "asc" ? "desc" : "asc")
            return
        }
        setOrderBy(property);
        setOrder("desc");
    }

    const handleRowClick = (event: React.MouseEvent<HTMLElement>) => {
        setRowAnchorEl(event.currentTarget);
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
        setDeleteAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setRowAnchorEl(null);
        setDeleteAnchorEl(null);
    };

    const handleSearchSubmit = () => {
        if (inputRef.current) {
            const searchQuery = inputRef.current.value;
            // Handle search submit logic
            setSearch(searchQuery);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };
    return (
        <>
            <Helmet>
                <title>Manage User</title>
            </Helmet>
            <RootBox>
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
                            sx={{ padding: '0 0.5rem', display: 'flex', alignItems: 'center', minWidth: '20rem'}}
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
                                    <CustomTableCell onClick={handleRowClick}>{user.id}</CustomTableCell>
                                    <CustomTableCell onClick={handleRowClick}>{user.name}</CustomTableCell>
                                    <CustomTableCell onClick={handleRowClick}>{user.username}</CustomTableCell>
                                    <CustomTableCell onClick={handleRowClick}>{user.joined}</CustomTableCell>
                                    <CustomTableCell onClick={handleRowClick}>{user.type}</CustomTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={handleDeleteClick}>
                                            <HighlightOff />
                                        </IconButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
                <Box display="flex" justifyContent="center" p={2}>
                    <Pagination count={3} page={1} />
                </Box>
            </RootBox>
            <CustomPopover
                elAnchor={rowAnchorEl}
                open={Boolean(rowAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => <span>Detailed User Information</span>}
                renderDescription={() => <span>More details about the user...</span>}
                boxProps={{ sx: { minWidth: '20rem' } }}
            />
            <CustomPopover
                elAnchor={deleteAnchorEl}
                open={Boolean(deleteAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => <span>Are you sure?</span>}
                renderDescription={() => <span>Delete this user?</span>}
                boxProps={{ sx: { minWidth: '20rem' } }}
            >

            </CustomPopover>
        </>
    )
}

export default UserListPage;