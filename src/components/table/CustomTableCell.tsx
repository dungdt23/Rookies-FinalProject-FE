import { Divider, styled, TableCell, TableCellProps } from "@mui/material";
import { FC, ReactNode } from "react";

export const StyledTableCell = styled(TableCell)(() => ({
    border: "0",
    paddingRight: "0.5rem",
}))

interface CustomTableCellProps extends TableCellProps {
    children: ReactNode;
}

const CustomTableCell: FC<CustomTableCellProps> = ({ children, ...props }) => {
    return (
        <StyledTableCell {...props}>
            {children}
            <Divider sx={{ marginTop: "3px", backgroundColor: "#c0c0c0" }} />
        </StyledTableCell>
    )
}

export default CustomTableCell