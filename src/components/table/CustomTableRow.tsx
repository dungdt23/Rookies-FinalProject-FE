import { styled, TableRow } from "@mui/material";

export const ClickableTableRow = styled(TableRow)(({ theme }) => ({
    cursor: "pointer",
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.primary.main,
    },
}));
