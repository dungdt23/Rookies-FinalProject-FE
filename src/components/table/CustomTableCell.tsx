import { Box, styled, TableCell, TableCellProps } from "@mui/material";
import { FC, ReactNode } from "react";

export const StyledTableCell = styled(TableCell)(() => ({
    border: "0",
    paddingRight: "0.5rem",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    whiteSpace: "normal",
    height: "inherit"
}))

interface CustomTableCellProps extends TableCellProps {
    children: ReactNode;
}

const CustomTableCell: FC<CustomTableCellProps> = ({ children, ...props }) => {
    return (
        <StyledTableCell {...props}>
            <Box sx={{
                padding: "0 0 1px 0",
                minHeight:"2vh",
                borderBottom: "1px solid #c0c0c0",
            }}>
                {children}
            </Box>
        </StyledTableCell >
    )
}

export default CustomTableCell