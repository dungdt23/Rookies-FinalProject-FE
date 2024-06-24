import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    Pagination,
    Table,
    TableBody,
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
import { Order, TableHeadInfo } from '../../../components/table/CustomTableHead';
import { removeUndefinedValues } from '../../../helpers/removeUndefined';
import { AssetFieldFilter, fetchAllAssets, GetAllAssetParams } from '../../../services/asset.service';
import { Asset, AssetState } from '../../../types/asset';
import { SortOrder } from '../../../types/common';

const TABLE_HEAD: TableHeadInfo[] = [
    {
        id: "action",
        label: "",
        disableDivider: true
    },
    {
        id: AssetFieldFilter[AssetFieldFilter.assetCode],
        label: "Asset Code",
        sortable: true,
    },
    {
        id: AssetFieldFilter[AssetFieldFilter.assetName],
        label: "Asset Name",
        sortable: true,
    },
    {
        id: AssetFieldFilter[AssetFieldFilter.category],
        label: "Category",
    },
]


interface AssetSelectionDialogProps {
    open: boolean;
    onClose: () => void;
    selected?: Asset;
    onSelectSave: (asset: Asset | null) => void;
}

const AssetSelectionDialog: FC<AssetSelectionDialogProps> = ({ open, onClose, selected: preSelected, onSelectSave }) => {
    const defaultSortOrder: Order = "asc"
    const theme = useTheme();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [selected, setSelected] = useState<Asset | null>(preSelected || null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('name');
    const [search, setSearch] = useState('');

    const pageSize = 10;  // You can adjust the page size as needed

    const getAssets = async () => {
        setIsFetching(true);
        let params: GetAllAssetParams = {
            search: search !== "" ? search : undefined,
            order: order === "asc" ? SortOrder.Ascending : SortOrder.Descending,
            index: page,
            size: pageSize,
            state: AssetState.Available,
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

    useEffect(() => {
        if (open) {
            getAssets();
        } else {
            setAssets([])
        }
    }, [open, page, order, orderBy, search]);

    const handleRowClick = (asset: Asset) => {
        setSelected(asset);
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
        onClose();
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
            onClose={onClose}
            sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        minWidth: "50rem",  // Set your width here
                    },
                },
            }}
        >
            <DialogTitle>Select A Asset</DialogTitle>
            <Box sx={{ display: "flex", flexDirection: "column", p: "0 1rem 1rem 1rem", gap: "0.5rem" }}>
                <SearchBar
                    placeholderSearch='Search asset by code and name'
                    onSearchSubmit={handleSearchSubmit}
                />
                <SimpleBar style={{ maxHeight: "25rem" }}>
                    <CircularProgressWrapper
                        loading={isFetching}
                    >
                        <Box>
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
                                            <StyledTableCell sx={{ maxWidth: "1rem" }}>
                                                <Checkbox
                                                    checked={selected?.id === asset.id}
                                                    inputProps={{
                                                        'aria-label': "checkbox"
                                                    }}
                                                    onClick={() => handleRowClick(asset)}
                                                />
                                            </StyledTableCell>
                                            <CustomTableCell onClick={() => handleRowClick(asset)}>{asset.assetCode}</CustomTableCell>
                                            <CustomTableCell onClick={() => handleRowClick(asset)}>{asset.assetName}</CustomTableCell>
                                            <CustomTableCell onClick={() => handleRowClick(asset)}>{asset.category}</CustomTableCell>
                                        </ClickableTableRow>
                                    ))}
                                    {(assets.length === 0 && isFetching)
                                        && <TableRow style={{ height: 200 }}>
                                        </TableRow>}
                                    {assets.length === 0 && !isFetching && (
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
                                </TableBody>
                            </Table>
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
                    >
                        Save
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default AssetSelectionDialog;
