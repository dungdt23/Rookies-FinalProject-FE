import { FC } from "react";
import { TableBody, TableRow, IconButton } from "@mui/material";
import CustomTableCell, { StyledTableCell } from "./CustomTableCell";
import { Edit, HighlightOff } from "@mui/icons-material";

interface CustomTableBodyProps<T> {
    items: T[];
    renderCell: (item: T, columnKey: string) => React.ReactNode;
    columnKeys: string[];
}

const CustomTableBody = <T,>({ items, renderCell, columnKeys }: CustomTableBodyProps<T>) => {
    return (
        <TableBody>
            {items.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                    {columnKeys.map((columnKey) => (
                        <CustomTableCell key={columnKey}>{renderCell(item, columnKey)}</CustomTableCell>
                    ))}
                    <StyledTableCell align="center">
                        <IconButton>
                            <Edit />
                        </IconButton>
                        <IconButton>
                            <HighlightOff />
                        </IconButton>
                    </StyledTableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};

export default CustomTableBody;
