import { ArrowDropDown } from "@mui/icons-material";
import { Divider, TableHead, TableSortLabel } from '@mui/material';
import { FC } from "react";
import { StyledTableCell } from "./CustomTableCell";

export interface TableHeadInfo {
    id: string,
    label: string,
    sortable?: boolean,
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
        <TableHead>
            {columns.map((info) => (
                <StyledTableCell key={info.id} >
                    <TableSortLabel
                        active={info.sortable}
                        hideSortIcon={info.sortable}
                        direction={orderBy === info.id ? order : 'desc'}
                        IconComponent={ArrowDropDown}
                        onClick={info.sortable ? createSortHandler(info.id) : undefined}
                    >
                        {info.label}
                    </TableSortLabel>
                    <Divider sx={{borderBottomWidth: "medium", backgroundColor: orderBy === info.id ? "#949494" : "#c9c9c9"}}/>
                </StyledTableCell>
            ))}
        </TableHead>
    )
}

export default CustomTableHead;