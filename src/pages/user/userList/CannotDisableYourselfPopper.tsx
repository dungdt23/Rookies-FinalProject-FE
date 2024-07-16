import { FC, ReactNode } from "react";
import { ListPopper } from "../../../components/popover";
import { Box, Typography } from "@mui/material";

interface CannotDisableYourPopperProps {
    elAnchor: HTMLElement | null;
    handleClose: () => void;
}

const renderDescription = (): ReactNode => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Typography variant="body1" gutterBottom>
                Permission error: You can not disable yourself.
            </Typography>
        </Box>
    )
}

const CannotDisableYourPopper: FC<CannotDisableYourPopperProps> = ({ elAnchor, handleClose }) => {
    return (
        <ListPopper
            elAnchor={elAnchor}
            open={Boolean(elAnchor)}
            handleClose={handleClose}
            renderTitle={() => <span>Can not disable user!</span>}
            renderDescription={renderDescription}
            boxProps={{ sx: { maxWidth: "25rem" } }}
        />
    )
}

export default CannotDisableYourPopper