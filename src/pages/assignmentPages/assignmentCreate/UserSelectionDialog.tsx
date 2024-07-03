import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    Pagination,
    Radio,
    TableRow,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC, useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { SearchBar } from '../../../components/form';
import { CircularProgressWrapper } from '../../../components/loading';
import { ClickableTableRow, CustomTableCell, CustomTableHead, StyledTableCell } from '../../../components/table';
import { StyleTable } from '../../../components/table/CustomTable';
import { StyleTableBody } from '../../../components/table/CustomTableBody';
import { Order, TableHeadInfo } from '../../../components/table/CustomTableHead';
import { removeUndefinedValues } from '../../../helpers/removeUndefined';
import { fetchAllUsers, GetAllUserParams, UserFieldFilter } from '../../../services/user.service';
import { User } from '../../../types/user';

const TABLE_HEAD: TableHeadInfo[] = [
    {
        id: "action",
        label: "",
        disableDivider: true
    },
    {
        id: UserFieldFilter[UserFieldFilter.staffCode],
        label: "Staff Code",
        sortable: true
    },
    {
        id: UserFieldFilter[UserFieldFilter.fullName],
        label: "Full Name",
        sortable: true
    },
    {
        id: UserFieldFilter[UserFieldFilter.type],
        label: "Type",
        sortable: true
    },
]


interface UserSelectionDialogProps {
    open: boolean;
    handleClose: () => void;
    selected?: User;
    onSelectSave: (user: User | null) => void;
}

const UserSelectionDialog: FC<UserSelectionDialogProps> = ({ open, handleClose, selected: preSelected, onSelectSave }) => {
    const defaultSortOrder: Order = "asc"
    const theme = useTheme();
    const [users, setUsers] = useState<User[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [selected, setSelected] = useState<User | null>(preSelected ?? null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>(UserFieldFilter[UserFieldFilter.fullName]);
    const [search, setSearch] = useState('');

    const pageSize = 10;  // You can adjust the page size as needed

    const getUsers = async () => {
        setIsFetching(true);
        let params: GetAllUserParams = {
            searchString: search !== "" ? search : undefined,
            isAscending: order === "asc",
            index: page,
            size: pageSize,
            fieldFilter: UserFieldFilter[orderBy as keyof typeof UserFieldFilter],
        };

        removeUndefinedValues<GetAllUserParams>(params);

        try {
            const data = await fetchAllUsers(params);
            setUsers(data.data);
            setTotalCount(data.totalCount)
        } catch (error) {
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, [page, order, orderBy, search]);

    useEffect(() => {
        if (open) {
            setSelected(preSelected ?? null);
            getUsers();
        }
    }, [open])

    const handleCancelClick = () => {
        handleClose()
        onClose()
    }

    const onClose = () => {
        setSelected(preSelected ?? null)
        setPage(1)
        setUsers([])
        setSearch('')
        setOrder('asc')
        setOrderBy(UserFieldFilter[UserFieldFilter.fullName])
        setTotalCount(0)
        setIsFetching(false)
    }

    const handleRowClick = (user: User) => {
        setSelected(user);
    };

    const handleChangePage = (_: unknown, value: number) => {
        setPage(value);
    };

    const handleSearchSubmit = (searchTerm: string) => {
        setSearch(searchTerm);
        setPage(1); // Reset to the first page on search
    };

    const handleSave = () => {
        onSelectSave(selected)
        handleClose();
        onClose()
    }

    const onRequestSort = (property: string) => {
        // toggle sort
        if (orderBy === property) {
            setOrder(order === "asc" ? "desc" : "asc")
            return
        }
        setOrderBy(property);
        setOrder(defaultSortOrder);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        minWidth: "50rem",  // Set your width here
                    },
                },
            }}
        >
            <DialogTitle>Select A User</DialogTitle>
            <Box sx={{ display: "flex", flexDirection: "column", p: "0 1rem 1rem 1rem", gap: "0.5rem" }}>
                <SearchBar
                    placeholderSearch='Search user by code and name'
                    onSearchSubmit={handleSearchSubmit}
                />
                <SimpleBar style={{ maxHeight: "25rem" }}>
                    <CircularProgressWrapper
                        loading={isFetching}
                    >
                        <Box>
                            <StyleTable>
                                <CustomTableHead
                                    columns={TABLE_HEAD}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={onRequestSort}
                                />
                                <StyleTableBody>
                                    {users.map((user) => (
                                        <ClickableTableRow
                                            key={user.id}
                                            sx={{ backgroundColor: selected?.id === user.id ? theme.palette.action.hover : 'unset' }}
                                        >
                                            <StyledTableCell sx={{ maxWidth: "1rem" }}>
                                                <Radio
                                                    checked={selected?.id === user.id}
                                                    inputProps={{
                                                        'aria-label': "radio"
                                                    }}
                                                    onClick={() => handleRowClick(user)}
                                                />
                                            </StyledTableCell>
                                            <CustomTableCell onClick={() => handleRowClick(user)}>{user.staffCode}</CustomTableCell>
                                            <CustomTableCell onClick={() => handleRowClick(user)}>{user.firstName + ' ' + user.lastName}</CustomTableCell>
                                            <CustomTableCell onClick={() => handleRowClick(user)}>{user.type}</CustomTableCell>
                                        </ClickableTableRow>
                                    ))}
                                    {(users.length === 0 && isFetching)
                                        && <TableRow style={{ height: 200 }}>
                                        </TableRow>}
                                    {users.length === 0 && !isFetching && (
                                        <TableRow style={{ height: 200 }}>
                                            <CustomTableCell align="center" colSpan={TABLE_HEAD.length}>
                                                <Box
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        {search === '' ? 'Empty!' : 'Not found'}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {search === '' ? 'There are no records.' : (
                                                            <>
                                                                No results found for{' '}
                                                                <strong>&quot;{search}&quot;</strong>.
                                                                <br /> Try checking for typos or using complete words.
                                                            </>
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </CustomTableCell>
                                        </TableRow>
                                    )} 
                                </StyleTableBody>
                            </StyleTable>
                        </Box>
                    </CircularProgressWrapper>
                </SimpleBar>
                {totalCount !== 0
                    && <Box display="flex" justifyContent="center" p={2}>
                        <Pagination
                            count={Math.ceil(totalCount / pageSize)}
                            page={page}
                            onChange={handleChangePage}
                        />
                    </Box>}
                <Box sx={{ display: 'flex', gap: '1rem', justifyContent: "right" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={handleSave}
                        disabled={!selected}
                    >
                        Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default UserSelectionDialog;
