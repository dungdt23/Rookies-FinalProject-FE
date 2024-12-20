import { Edit, HighlightOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TableRow,
  Typography
} from "@mui/material";
import { FC, MouseEvent, ReactNode, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SearchBar } from "../../../components/form";
import { CircularProgressWrapper } from "../../../components/loading";
import { NoStyleLink } from "../../../components/noStyleLink";
import { ListPopper } from "../../../components/popover";
import { RootListBox } from "../../../components/styledComponents";
import {
  ClickableTableRow,
  CustomTableCell,
  CustomTableHead,
  StyleTable,
  StyleTableBody,
  StyledTableCell,
  StyledTableContainer,
} from "../../../components/table";
import {
  Order,
  TableHeadInfo,
} from "../../../components/table/CustomTableHead";
import { StyledTypography } from "../../../components/typography";
import { theme } from "../../../constants/appTheme";
import { routeNames } from "../../../constants/routeName";
import { useAuth } from "../../../contexts/AuthContext";
import { toStandardFormat } from "../../../helpers/formatDate";
import { removeUndefinedValues } from "../../../helpers/removeUndefined";
import {
  GetAllUserParams,
  UserFieldFilter,
  disableUserById,
  fetchAllUsers,
} from "../../../services/user.service";
import { ListPageState } from "../../../types/common";
import { User, UserGender, UserType } from "../../../types/user";
import CannotDisableYourPopper from "./CannotDisableYourselfPopper";

const TABLE_HEAD: TableHeadInfo[] = [
  {
    id: UserFieldFilter[UserFieldFilter.staffCode],
    label: "Staff Code",
    sortable: true,
    minWidth: "6rem",
    width: "15%"
  },
  {
    id: UserFieldFilter[UserFieldFilter.fullName],
    label: "Full Name",
    sortable: true,
    minWidth: "12rem",
  },
  {
    id: "username",
    label: "Username",
    minWidth: "4rem",
    width: "15%"
  },
  {
    id: UserFieldFilter[UserFieldFilter.joinedDate],
    label: "Joined Date",
    sortable: true,
    minWidth: "7rem",
    width: "15%"
  },
  {
    id: UserFieldFilter[UserFieldFilter.type],
    label: "Type",
    sortable: true,
    minWidth: "6rem",
    width: "15%"
  },
  {
    id: "action",
    label: "Action",
    minWidth: "6rem",
    width: "6rem"
  },
];

const allOption = {
  label: "None",
  value: "",
};

const UserListPage: FC = () => {
  const defaultSortOrder: Order = "asc";
  const [users, _setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(15);
  const [userType, setUserType] = useState<UserType | string>(allOption.value);
  const [search, setSearch] = useState<string>("");
  const [order, setOrder] = useState<Order>(defaultSortOrder);
  const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[0].id);
  const [rowAnchorEl, setRowAnchorEl] = useState<HTMLElement | null>(null);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [cannotDisableYourselfAnchorEl, setCannotDisableYourselfAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const { user: JWTPayload } = useAuth();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDisabling, setIsDisabling] = useState<boolean>(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [canDisable, setCanDisable] = useState<boolean>(true);
  const location = useLocation();

  const placeholderSearch = "Search users by code and fullname";

  const state: ListPageState<User> | undefined = location.state;

  const [alert, setAlert] = useState<string | undefined>(state?.alertString);

  const [bool, setBool] = useState<boolean>(false);
  const setUsers = (users: User[]) => {
    if (!bool && state?.presetEntry) {
      // Add presetEntry to the beginning of users
      let newArr = [state.presetEntry, ...users];

      // Remove duplicates based on id
      let uniqueUsers = newArr.reduce((acc: User[], user) => {
        const existingUser = acc.find((u) => u.id === user.id);
        if (!existingUser) {
          acc.push(user);
        }
        return acc;
      }, []);

      _setUsers(uniqueUsers);
      setBool(true);
    } else {
      _setUsers(users);
    }
    window.history.replaceState(location.pathname, "");
  };

  const getUsers = async () => {
    setIsFetching(true);
    let params: GetAllUserParams = {
      userType:
        userType === allOption.value ? undefined : (userType as UserType),
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
      setTotalCount(data.totalCount);
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [userType, search, order, orderBy, page, pageSize]);

  const handleTypeFilter = (event: SelectChangeEvent) => {
    setUserType(event.target.value as UserType | "");
    setPage(1);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const onRequestSort = (property: string) => {
    // toggle sort
    if (orderBy === property) {
      setOrder(order === "asc" ? "desc" : "asc");
      return;
    }
    setOrderBy(property);
    setOrder(defaultSortOrder);
  };

  const handleRowClick = (event: MouseEvent<HTMLElement>, user: User) => {
    setRowAnchorEl(event.currentTarget);
    setSelected(user);
  };

  const handleDeleteClick = (event: MouseEvent<HTMLElement>, user: User) => {
    if (user.id !== JWTPayload?.id) {
      setDeleteAnchorEl(event.currentTarget);
      setSelected(user);
      setCanDisable(true);
      return;
    }
    setCannotDisableYourselfAnchorEl(event.currentTarget)
  };

  const handleClosePopover = () => {
    setSelected(null);
    setRowAnchorEl(null);
    setDeleteAnchorEl(null);
    setCannotDisableYourselfAnchorEl(null);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    const searchQuery = searchTerm;
    setSearch(searchQuery);
    setPage(1);
  };

  const renderUserDetailDialog = (): ReactNode => {
    if (!selected) return null;
    const userDetails = [
      {
        label: "Staff Code: ",
        value: selected?.staffCode,
      },
      {
        label: "First Name: ",
        value: selected?.firstName,
      },
      {
        label: "Last Name: ",
        value: selected?.lastName,
      },
      {
        label: "Username: ",
        value: selected?.userName,
      },
      {
        label: "Date of Birth: ",
        value: toStandardFormat(selected?.dateOfBirth),
      },
      {
        label: "Joined Date: ",
        value: toStandardFormat(selected?.joinedDate),
      },
      {
        label: "Gender: ",
        value: UserGender[selected?.gender],
      },
      {
        label: "Type: ",
        value: selected?.type,
      },
      {
        label: "Location: ",
        value: selected?.location,
      },
    ];
    return (
      <Box sx={{ minWidth: "25rem", maxWidth: "30rem" }}>
        {userDetails.map((item) => (
          <Grid container spacing={2} key={item.label}>
            <Grid item xs={4} sx={{minWidth: "4rem"}}>
              <StyledTypography variant="body1" gutterBottom>
                {item.label}
              </StyledTypography>
            </Grid>
            <Grid item xs={8}>
              <StyledTypography variant="body1" gutterBottom>
                {item.value}
              </StyledTypography>
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  };

  const disableUser = async () => {
    setIsDisabling(true);
    if (!selected) {
      setIsDisabling(false);
      return;
    }
    try {
      const result = await disableUserById(selected?.id);
      setCanDisable(result);
      if (result) {
        handleClosePopover();
        getUsers();
        setAlert(`User ${selected?.userName} is disabled`);
      }
    } catch (error) {
      console.error(error);
    }
    setIsDisabling(false);
  };

  const renderUserDisableDialog = (): ReactNode => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="body1" gutterBottom>
          Do you want to disable this user? <br />
          User: {selected?.userName}
        </Typography>
        <Box sx={{ display: "flex", gap: "1rem", mt: "1rem" }}>
          <LoadingButton
            loading={isDisabling}
            type="submit"
            variant="contained"
            onClick={disableUser}
          >
            Disable
          </LoadingButton>
          <Button variant="outlined" onClick={handleClosePopover}>
            Cancel
          </Button>
        </Box>
      </Box>
    );
  };

  const renderCannotDisableDialog = (): ReactNode => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Typography variant="body1" gutterBottom>
          There are valid assignments belonging to this user. Please close all
          assignments before disabling user.
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage User</title>
      </Helmet>
      <RootListBox sx={{ mb: "1rem" }}>
        <Typography variant="h5" color="primary">
          User Management
        </Typography>
      </RootListBox>
      <RootListBox>
        {alert && (
          <Alert
            sx={{ mb: "1rem" }}
            severity="success"
            onClose={() => setAlert(undefined)}
          >
            {alert}
          </Alert>
        )}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: "1rem" }}
        >
          <FormControl>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              label="Type"
              value={userType}
              onChange={handleTypeFilter}
              sx={{ minWidth: "7rem" }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </Select>
          </FormControl>
          <Box display={"flex"}>
            <SearchBar
              placeholderSearch={placeholderSearch}
              onSearchSubmit={handleSearchSubmit}
              TextFieldProps={{ sx: { minWidth: "22rem" } }}
            />
            <NoStyleLink to={routeNames.user.create}>
              <Button
                sx={{ marginLeft: "1rem", p: "0 1.5rem", height: "100%" }}
                variant="contained"
                color="primary"
              >
                Create New User
              </Button>
            </NoStyleLink>
          </Box>
        </Box>
        <StyledTableContainer>
          <CircularProgressWrapper loading={isFetching || isDisabling}>
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
                    sx={{
                      backgroundColor:
                        selected?.id === user.id
                          ? theme.palette.action.hover
                          : "unset",
                    }}
                  >
                    <CustomTableCell
                      onClick={(event) => handleRowClick(event, user)}

                    >
                      {user.staffCode}
                    </CustomTableCell>
                    <CustomTableCell
                      onClick={(event) => handleRowClick(event, user)}
                    >
                      {user.firstName + " " + user.lastName}
                    </CustomTableCell>
                    <CustomTableCell
                      onClick={(event) => handleRowClick(event, user)}
                    >
                      {user.userName}
                    </CustomTableCell>
                    <CustomTableCell
                      onClick={(event) => handleRowClick(event, user)}
                    >
                      {toStandardFormat(user.joinedDate)}
                    </CustomTableCell>
                    <CustomTableCell
                      onClick={(event) => handleRowClick(event, user)}
                    >
                      {user.type}
                    </CustomTableCell>
                    <StyledTableCell align="center">
                      <NoStyleLink to={routeNames.user.edit(user.id)}>
                        <IconButton>
                          <Edit />
                        </IconButton>
                      </NoStyleLink>

                      <IconButton
                        onClick={(event) => handleDeleteClick(event, user)}
                      >
                        <HighlightOff color="primary" />
                      </IconButton>
                    </StyledTableCell>
                  </ClickableTableRow>
                ))}
                {users.length === 0 && isFetching && (
                  <TableRow style={{ height: 200 }}></TableRow>
                )}
                {users.length === 0 && !isFetching && (
                  <TableRow style={{ height: 200 }}>
                    <StyledTableCell align="center" colSpan={TABLE_HEAD.length}>
                      <Box
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          {search === "" ? "Empty!" : "Not found"}
                        </Typography>

                        <Typography variant="body2">
                          {search === "" ? (
                            "There are no records."
                          ) : (
                            <>
                              No results found for{" "}
                              <strong>&quot;{search}&quot;</strong>.
                              <br /> Try checking for typos or using complete
                              words.
                            </>
                          )}
                        </Typography>
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                )}
              </StyleTableBody>
            </StyleTable>
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
      </RootListBox>
      <ListPopper
        elAnchor={rowAnchorEl}
        open={Boolean(rowAnchorEl)}
        handleClose={handleClosePopover}
        renderTitle={() => <span>Detailed User Information</span>}
        renderDescription={renderUserDetailDialog}
      />
      <ListPopper
        elAnchor={deleteAnchorEl}
        open={Boolean(deleteAnchorEl)}
        handleClose={handleClosePopover}
        renderTitle={() =>
          canDisable ? (
            <span>Are you sure?</span>
          ) : (
            <span>Can not disable user</span>
          )
        }
        renderDescription={
          canDisable ? renderUserDisableDialog : renderCannotDisableDialog
        }
        boxProps={{ sx: { maxWidth: "25rem" } }}
      ></ListPopper>
      <CannotDisableYourPopper
        elAnchor={cannotDisableYourselfAnchorEl}
        handleClose={handleClosePopover}
      />
    </>
  );
};

export default UserListPage;
