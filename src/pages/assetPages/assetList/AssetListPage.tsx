import { Edit, HighlightOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableRow,
  Typography
} from "@mui/material";
import { FC, MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "../../../components/form";
import LoadingSelect, {
  LoadingSelectOption,
} from "../../../components/form/LoadingSelect";
import { CircularProgressWrapper } from "../../../components/loading";
import { NoStyleLink } from "../../../components/noStyleLink";
import { ListPopper } from "../../../components/popover";
import { RootListBox } from "../../../components/styledComponents";
import {
  ClickableTableRow,
  CustomTableCell,
  CustomTableHead,
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
import { toStandardFormat } from "../../../helpers/formatDate";
import { addSpacesToCamelCase } from '../../../helpers/helper';
import { removeUndefinedValues } from "../../../helpers/removeUndefined";
import {
  AssetFieldFilter,
  deleteAssetById,
  fetchAllAssets,
  GetAllAssetParams,
} from "../../../services/asset.service";
import { fetchAllCategory } from "../../../services/category.service";
import { Asset, AssetState } from "../../../types/asset";
import { ListPageState, SortOrder } from "../../../types/common";

const TABLE_HEAD: TableHeadInfo[] = [
  {
    id: AssetFieldFilter[AssetFieldFilter.assetCode],
    label: "Asset Code",
    sortable: true,
    minWidth: "7rem",
    width: "15%"
  },
  {
    id: AssetFieldFilter[AssetFieldFilter.assetName],
    label: "Asset Name",
    sortable: true,
    minWidth: "7rem",
  },
  {
    id: AssetFieldFilter[AssetFieldFilter.category],
    label: "Category",
    sortable: true,
    minWidth: "7rem",
    width: "30%"
  },
  {
    id: AssetFieldFilter[AssetFieldFilter.state],
    label: "State",
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

const AssetListPage: FC = () => {
  const defaultSortOrder: Order = "asc";
  const [assets, _setAssets] = useState<Asset[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(15);
  const [search, setSearch] = useState<string>("");
  const [order, setOrder] = useState<Order>(defaultSortOrder);
  const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[0].id);
  const [rowAnchorEl, setRowAnchorEl] = useState<HTMLElement | null>(null);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isFetchingCategory, setIsFetchingCategory] = useState<boolean>(false);
  const [categories, _setCategories] = useState<LoadingSelectOption[]>([
    allOption,
  ]);
  const [category, setCategory] = useState<string>(allOption.value);
  const [assetState, setAssetState] = useState<AssetState | string>("");
  const [selected, setSelected] = useState<Asset | null>(null);
  const [canDelete, setCanDelete] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const placeholderSearch = "Search assets by code and name";

  const setCategories = (categories: LoadingSelectOption[]) => {
    _setCategories([allOption, ...categories]);
  };

  const getAssets = async () => {
    setIsFetching(true);
    let params: GetAllAssetParams = {
      search: search !== "" ? search : undefined,
      order: order === "asc" ? SortOrder.Ascending : SortOrder.Descending,
      category: category !== allOption.value ? category : undefined,
      state: assetState !== "" ? (assetState as AssetState) : undefined,
      index: page,
      size: pageSize,
      sort: AssetFieldFilter[orderBy as keyof typeof AssetFieldFilter],
    };

    removeUndefinedValues(params);

    try {
      const data = await fetchAllAssets(params);
      setAssets(data.data);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const location = useLocation();
  const state: ListPageState<Asset> | undefined = location.state;
  const [alert, setAlert] = useState<string | undefined>(state?.alertString);
  const [bool, setBool] = useState<boolean>(false);
  const setAssets = (assets: Asset[]) => {
    if (!bool && state?.presetEntry) {
      // add presetEntry into assets
      console.log(state.presetEntry);

      let newArr = [state.presetEntry, ...assets];
      let uniqueAssets = Array.from(
        new Map(newArr.map((asset) => [asset.id, asset])).values()
      );

      _setAssets(uniqueAssets);
      setBool(true);
    } else {
      _setAssets(assets);
    }
    window.history.replaceState(location.pathname, "");
  };



  const getCategories = async () => {
    setIsFetchingCategory(true);
    try {
      const response = await fetchAllCategory();
      setCategories(
        response.data.map((category) => ({
          label: category.categoryName,
          value: category.id,
        }))
      );
    } catch (error) {
      console.error(error);
    }
    setIsFetchingCategory(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getAssets();
  }, [assetState, category, search, order, orderBy, page, pageSize]);

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
  const handleDeleteClick = (event: MouseEvent<HTMLElement>, asset: Asset) => {
    setDeleteAnchorEl(event.currentTarget);
    setSelected(asset);
    setCanDelete(true); // Assuming you have a similar logic for disabling assets
  };

  const handleRowClick = (event: MouseEvent<HTMLElement>, asset: Asset) => {
    setRowAnchorEl(event.currentTarget);
    setSelected(asset);
  };

  const handleClosePopover = () => {
    setSelected(null);
    setRowAnchorEl(null);
    setDeleteAnchorEl(null);
  };

  const handleCategoryChange = (option: string) => {
    setCategory(option)
    setPage(1); // Reset to the first page on search
  }

  const handleSearchSubmit = (searchTerm: string) => {
    const searchQuery = searchTerm;
    setSearch(searchQuery);
    setPage(1); // Reset to the first page on search
  };

  const renderAssetDetailDialog = (): ReactNode => {
    console.log(selected);

    if (!selected) return null;
    const assetDetails = [
      {
        label: "Asset Code: ",
        value: selected?.assetCode,
      },
      {
        label: "Asset Name: ",
        value: selected?.assetName,
      },
      {
        label: "Category: ",
        value: selected?.category,
      },
      {
        label: "Location: ",
        value: selected?.location,
      },
      {
        label: "Specification: ",
        value: selected?.specification,
      },
      {
        label: "Installed Date: ",
        value: toStandardFormat(selected?.installedDate),
      },
      {
        label: "State: ",
        value: addSpacesToCamelCase(AssetState[selected?.state]),
      },
    ];

    return (
      <Box sx={{ maxWidth: "30rem" }}>
        {assetDetails.map((item) => (
          <Grid container spacing={2} key={item.label}>
            <Grid item xs={4} sx={{ minWidth: "6rem" }}>
              <StyledTypography variant="body1" gutterBottom>{item.label}</StyledTypography>
            </Grid>
            <Grid item xs={8}>
              <StyledTypography variant="body1" gutterBottom>{item.value}</StyledTypography>
            </Grid>
          </Grid>
        ))}
        <Divider />
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
          <Typography variant="h6">Assignment history:</Typography>
          {selected.assignments.length > 0 ? (
            selected.assignments.map((assignment) => (
              <Typography key={assignment.id} variant="body2">
                Assigned Date: {toStandardFormat(assignment.assignedDate)} | Assigned by: {assignment.assignedBy} | Assigned to: {assignment.assignedTo}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">
              This asset doesn't have any historical assignment.
            </Typography>
          )}
          {selected.assignments.length > 0 && (
        <div style={{ marginTop: '16px', display: 'inline-block' }}>
        <Link
          to={routeNames.asset.history(selected?.id ?? '')}
          style={{
            textDecoration: 'none',
            display: 'block', 
            width: '30%', 
          }}
        >
          <Button variant="contained" style={{ width: '100%' }}>
            Show More
          </Button>
        </Link>
      </div>
          )}
        </Box>
      </Box>
    );
  };

  const handleStateFilter = (event: SelectChangeEvent) => {
    setAssetState(event.target.value as AssetState | "");
    setPage(1);
  };

  const disableAsset = async () => {
    setIsDeleting(true);
    if (!selected) {
      setIsDeleting(false);
      return;
    }
    try {
      const result = await deleteAssetById(selected.id);

      setCanDelete(result);
      if (result) {
        handleClosePopover();
        getAssets(); // Refresh assets after disabling
        setAlert(`Asset ${selected?.assetCode} is deleted`);
      }
    } catch (error) {
      console.error(error);
    }
    setIsDeleting(false);
  };

  const renderAssetDisableDialog = (): ReactNode => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="body1" gutterBottom>
          Do you want to delete this asset? <br />
          Asset Code: {selected?.assetCode}
        </Typography>
        <Box sx={{ display: "flex", gap: "1rem", mt: "1rem" }}>
          <LoadingButton
            loading={isDeleting}
            type="submit"
            variant="contained"
            onClick={disableAsset}
          >
            Delete
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
          Cannot delete the asset because it belongs to one or more historical
          assignment
          <br />
          If the asset is not able to be used anymore please update its state in{" "}
          <Link to={routeNames.asset.edit(selected?.id ?? "")}>
            Edit Asset Page
          </Link>
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage Assets</title>
      </Helmet>
      <RootListBox sx={{ mb: "1rem" }}>
        <Typography variant="h5" color="primary">
          Asset Management
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
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <FormControl>
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                label="State"
                value={assetState.toString()}
                onChange={handleStateFilter}
                sx={{ minWidth: "15rem" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={AssetState.Available}>Available</MenuItem>
                <MenuItem value={AssetState.NotAvailable}>
                  Not Available
                </MenuItem>
                <MenuItem value={AssetState.Assigned}>Assigned</MenuItem>
                <MenuItem value={AssetState.WaitingForRecycling}>
                  Waiting For Recycling
                </MenuItem>
                <MenuItem value={AssetState.Recycled}>Recycled</MenuItem>
              </Select>
            </FormControl>
            <LoadingSelect
              label="Category"
              loading={isFetchingCategory}
              value={category}
              options={categories}
              onChange={handleCategoryChange}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <SearchBar
              ref={inputRef}
              placeholderSearch={placeholderSearch}
              onSearchSubmit={handleSearchSubmit}
              TextFieldProps={{ sx: { minWidth: "21rem" } }}
            />
            <NoStyleLink to={routeNames.asset.create}>
              <Button
                sx={{ p: "0 1.5rem", height: "100%" }}
                variant="contained"
                color="primary"
              >
                Create New Asset
              </Button>
            </NoStyleLink>
          </Box>
        </Box>
        <StyledTableContainer>
          <CircularProgressWrapper loading={isFetching || isDeleting}>
            <Table>
              <CustomTableHead
                columns={TABLE_HEAD}
                order={order}
                orderBy={orderBy}
                onRequestSort={onRequestSort}
              />
              <TableBody>
                {assets.map((asset) => (
                  <ClickableTableRow
                    key={asset.id}
                    sx={{
                      backgroundColor:
                        selected?.id === asset.id
                          ? theme.palette.action.hover
                          : "unset",
                    }}
                  >
                    <CustomTableCell
                      onClick={(event) => handleRowClick(event, asset)}
                    >
                      {asset.assetCode}
                    </CustomTableCell>
                    <CustomTableCell
                      onClick={(event) => handleRowClick(event, asset)}
                    >
                      {asset.assetName}
                    </CustomTableCell>
                    <CustomTableCell
                      onClick={(event) => handleRowClick(event, asset)}
                    >
                      {asset.category}
                    </CustomTableCell>
                    <CustomTableCell
                      onClick={(event) => handleRowClick(event, asset)}
                    >
                      {addSpacesToCamelCase(AssetState[asset.state])}
                    </CustomTableCell>
                    {asset.state === AssetState.Assigned && (
                      <StyledTableCell align="center">
                        <IconButton disabled>
                          <Edit />
                        </IconButton>
                        <IconButton
                          disabled
                          onClick={(event) => handleDeleteClick(event, asset)}
                        >
                          <HighlightOff />
                        </IconButton>
                      </StyledTableCell>
                    )}
                    {asset.state !== AssetState.Assigned && (
                      <StyledTableCell align="center">
                        <NoStyleLink to={routeNames.asset.edit(asset.id)}>
                          <IconButton>
                            <Edit />
                          </IconButton>
                        </NoStyleLink>
                        <IconButton
                          onClick={(event) => handleDeleteClick(event, asset)}
                        >
                          <HighlightOff color="primary" />
                        </IconButton>
                      </StyledTableCell>
                    )}
                  </ClickableTableRow>
                ))}
                {assets.length === 0 && isFetching && (
                  <TableRow style={{ height: 200 }}></TableRow>
                )}
                {assets.length === 0 && !isFetching && (
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
      </RootListBox>
      <ListPopper
        elAnchor={rowAnchorEl}
        open={Boolean(rowAnchorEl)}
        handleClose={handleClosePopover}
        renderTitle={() => <span>Detailed Asset Information</span>}
        renderDescription={renderAssetDetailDialog}
      />
      <ListPopper
        elAnchor={deleteAnchorEl}
        open={Boolean(deleteAnchorEl)}
        handleClose={handleClosePopover}
        renderTitle={() =>
          canDelete ? (
            <span>Are you sure?</span>
          ) : (
            <span>Cannot Delete Asset</span>
          )
        }
        renderDescription={
          canDelete ? renderAssetDisableDialog : renderCannotDisableDialog
        }
        boxProps={{ sx: { maxWidth: "25rem" } }}
      />
    </>
  );
};

export default AssetListPage;
