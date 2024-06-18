import { FC, MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Alert, Box, Button, Divider, Grid, IconButton, InputBase, MenuItem, Pagination, Paper, Select, SelectChangeEvent, styled, Table, TableBody, TableContainer, TableRow, Typography } from "@mui/material";
import { Edit, HighlightOff, Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { CircularProgressWrapper } from "../../../components/loading";
import { CustomPopover } from "../../../components/popover";
import { CustomTableCell, CustomTableHead, StyledTableCell } from "../../../components/table";
import { NoStyleLink } from "../../../components/noStyleLink";
import { theme } from "../../../constants/appTheme";
import { routeNames } from "../../../constants/routeName";
import { toStandardFormat } from "../../../helpers/formatDate";
import { removeUndefinedValues } from "../../../helpers/removeUndefined";
import { ListPageProps, SortOrder } from "../../../types/common";
import { Asset, AssetState } from '../../../types/asset';
import { Order, TableHeadInfo } from "../../../components/table/CustomTableHead";
import { AssetFieldFilter, fetchAllAsset as fetchAllAssets, GetAllAssetParams } from "../../../services/asset.service";
import LoadingSelect from "../../../components/form/LoadingSelect";

const ClickableTableRow = styled(TableRow)(({ theme }) => ({
    cursor: "pointer",
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.primary.main,
    },
}));

const RootBox = styled(Box)(() => ({
    minWidth: '30rem',
    width: '100%',
    p: 2
}))

const StyledTableContainer = styled(TableContainer)(() => ({
    border: '0px',
}))


const TABLE_HEAD: TableHeadInfo[] = [
    {
        id: AssetFieldFilter[AssetFieldFilter.assetCode],
        label: "Asset Code",
        sortable: true
    },
    {
        id: AssetFieldFilter[AssetFieldFilter.assetName],
        label: "Asset Name",
        sortable: true
    },
    {
        id: AssetFieldFilter[AssetFieldFilter.category],
        label: "Category",
    },
    {
        id: AssetFieldFilter[AssetFieldFilter.state],
        label: "State",
        sortable: true
    },
    {
        id: "action",
        label: "Action",
    },
];

const AssetListPage: FC<ListPageProps> = ({ alertString }) => {
    const defaultSortOrder: Order = "asc";
    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(15);
    const [search, setSearch] = useState<string>("");
    const [order, setOrder] = useState<Order>(defaultSortOrder);
    const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[0].id);
    const [rowAnchorEl, setRowAnchorEl] = useState<HTMLElement | null>(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(null);
    const [alert, setAlert] = useState<string | undefined>(alertString);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isDisabling, setIsDisabling] = useState<boolean>(false);
    const [selected, setSelected] = useState<Asset | null>(null);
    const [canDisable, setCanDisable] = useState<boolean>(true);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const placeholderSearch = "Search asset by code and name";    

    const getAssets = async () => {
        setIsFetching(true);
        let params: GetAllAssetParams = {
            search: search !== "" ? search : undefined,
            order: order === "asc" ? SortOrder.Ascending : SortOrder.Descending,
            categoryId: undefined,
            state: undefined,
            index: page,
            size: pageSize,
            sort: AssetFieldFilter[orderBy as keyof typeof AssetFieldFilter],
        };

        removeUndefinedValues<GetAllAssetParams>(params);

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

    useEffect(() => {
        getAssets();
    }, [search, order, orderBy, page, pageSize]);

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

    const handleRowClick = (event: MouseEvent<HTMLElement>, asset: Asset) => {
        setRowAnchorEl(event.currentTarget);
        setSelected(asset);
    };

    const handleDeleteClick = (event: MouseEvent<HTMLElement>, asset: Asset) => {
        setDeleteAnchorEl(event.currentTarget);
        setSelected(asset);
        setCanDisable(true); // Assuming you have a similar logic for disabling assets
    };

    const handleClosePopover = () => {
        setSelected(null);
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

    const renderAssetDetailDialog = (): ReactNode => {
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
                value: selected?.state,
            },
        ];
        return (
            <Box>
                {assetDetails.map((item) => (
                    <Grid container spacing={2} key={item.label}>
                        <Grid item xs={4}>
                            <Typography variant="body1" gutterBottom>{item.label}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" gutterBottom>{item.value}</Typography>
                        </Grid>
                    </Grid>
                ))}
            </Box>
        );
    };

    const disableAsset = async () => {
        setIsDisabling(true);
        try {
            // Implement your logic to disable asset here
            // For example:
            // const result = await disableAssetById(selected!.id);
            // setCanDisable(result);
            handleClosePopover();
            getAssets(); // Refresh assets after disabling
            setAlert(`Asset ${selected?.assetCode} is disabled`);
        } catch (error) {
            console.error(error);
        }
        setIsDisabling(false);
    };

    const renderAssetDisableDialog = (): ReactNode => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" gutterBottom>
                    Do you want to disable this asset? <br />
                    Asset Code: {selected?.assetCode}
                </Typography>
                <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
                    <LoadingButton
                        loading={isDisabling}
                        type="submit"
                        variant="contained"
                        onClick={disableAsset}
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

    return (
        <>
            <Helmet>
                <title>Manage Assets</title>
            </Helmet>
            <RootBox sx={{ mb: '1rem' }}>
                <Typography variant="h5" color='primary'>Asset Management</Typography>
            </RootBox>
            <RootBox>
                {alert && <Alert sx={{ mb: '1rem' }} severity="success" onClose={() => setAlert(undefined)}>{alert}</Alert>}
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: '1rem' }} >
                    {/* <LoadingSelect
                        
                    /> */}
                    <Box display={'flex'}>
                        <Paper
                            variant="outlined"
                            sx={{ padding: '0 0.5rem', display: 'flex', alignItems: 'center', minWidth: '20rem' }}
                        >
                            <InputBase
                                inputRef={inputRef}
                                sx={{ ml: 1, flex: 1 }}
                                placeholder={placeholderSearch}
                                inputProps={{ 'aria-label': 'search google maps' }}
                                onKeyUp={handleKeyPress}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchSubmit}>
                                <Search />
                            </IconButton>
                        </Paper>
                        <NoStyleLink to={routeNames.asset.create}>
                            <Button sx={{ marginLeft: "1rem", p: '0 1.5rem', height: '100%' }} variant="contained" color="primary">
                                Create New Asset
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
                                {assets.map((asset) => (
                                    <ClickableTableRow
                                        key={asset.id}
                                        sx={{ backgroundColor: selected?.id === asset.id ? theme.palette.action.hover : 'unset' }}
                                    >
                                        <CustomTableCell onClick={(event) => handleRowClick(event, asset)}>{asset.assetCode}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, asset)}>{asset.assetName}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, asset)}>{asset.category}</CustomTableCell>
                                        <CustomTableCell onClick={(event) => handleRowClick(event, asset)}>{asset.state}</CustomTableCell>
                                        <StyledTableCell align="center">
                                            <NoStyleLink to={routeNames.asset.edit(asset.id)}>
                                                <IconButton>
                                                    <Edit />
                                                </IconButton>
                                            </NoStyleLink>
                                            <IconButton onClick={(event) => handleDeleteClick(event, asset)}>
                                                <HighlightOff color="primary" />
                                            </IconButton>
                                        </StyledTableCell>
                                    </ClickableTableRow>
                                ))}
                                {(assets.length === 0 && isFetching)
                                    && <TableRow style={{ height: 200 }}>
                                    </TableRow>}
                                {(assets.length === 0 && !isFetching)
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
                renderTitle={() => <span>Detailed Asset Information</span>}
                renderDescription={renderAssetDetailDialog}
                boxProps={{ sx: { minWidth: '25rem', maxWidth: '30rem' } }}
            />
            {/* <CustomPopover
                elAnchor={deleteAnchorEl}
                open={Boolean(deleteAnchorEl)}
                handleClose={handleClosePopover}
                renderTitle={() => canDisable ? <span>Are you sure?</span> : <span>Cannot disable asset</span>}
                renderDescription={canDisable ? renderAssetDisableDialog : renderCannotDisableDialog}
                boxProps={{ sx: { maxWidth: '25rem' } }}
            /> */}
        </>
    );
};

export default AssetListPage;
