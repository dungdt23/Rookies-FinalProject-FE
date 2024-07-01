import { ArrowDropDown } from "@mui/icons-material";
import { Box, TableHead, TableSortLabel } from '@mui/material';
import { FC } from "react";
import { StyledTableCell } from "./CustomTableCell";

export interface TableHeadInfo {
    id: string,
    label: string,
    sortable?: boolean,
    disableDivider?: boolean
}

export type Order = 'asc' | 'desc';

interface TableHeadProps {
    columns: TableHeadInfo[]
    order: Order,
    orderBy: string,
    onRequestSort: (property: string) => void;
}



const CustomTableHead: FC<TableHeadProps> = ({ columns, order, orderBy, onRequestSort }) => {
    const createSortHandler = (property: string) => (_: unknown) => {
        onRequestSort(property);
    };

    return (
        <TableHead sx={{
            height: "1px",
        }}>
            {columns.map((info) => (
                <StyledTableCell
                    key={info.id}
                    onClick={info.sortable ? createSortHandler(info.id) : undefined}
                >
                    <Box
                        sx={{
                            cursor: info.sortable ? "pointer" : undefined,
                            borderBottom: !info.disableDivider ? (orderBy === info.id ? "3px solid #949494" : "3px solid #c9c9c9") : "0",
                            height: "100%"
                        }}>
                        <TableSortLabel
                            active={info.sortable}
                            hideSortIcon={info.sortable}
                            direction={orderBy === info.id ? order : 'asc'}
                            IconComponent={ArrowDropDown}
                            sx={{
                                '&.MuiTableSortLabel-root': {
                                    overflowWrap: "normal",
                                    wordBreak: "normal"
                                },
                            }}
                        >
                            {info.label}
                        </TableSortLabel>
                    </Box>

                </StyledTableCell>
            ))}
        </TableHead>
    )
}

export default CustomTableHead;