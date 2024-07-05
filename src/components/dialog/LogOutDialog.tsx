import { FC, ReactNode } from "react";
import { logout } from "../../contexts/AuthContext";
import CustomDialog from "./CustomDialog";
import { useNavigate } from "react-router-dom";
import { routeNames } from "../../constants/routeName";
import { LoadingButton } from "@mui/lab";
import { Box, Typography, Button } from "@mui/material";

interface LogOutDialogProps{
    open: boolean;
    logout: () => void;
    setOpen: (value: React.SetStateAction<boolean>) => void;
}

const LogOutDialog: FC<LogOutDialogProps> = ({open , logout, setOpen}) => {
const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            logout();
            navigate(routeNames.login);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };
    
    const handleCloseLogOutDialog = () => {
        setOpen(false);
    }

    const renderLogoutDialogBody = (): ReactNode => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" gutterBottom>
                    Do you want to log out?
                </Typography>
                <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
                    <LoadingButton
                        loading={false}
                        type="submit"
                        variant="contained"
                        onClick={handleLogout}
                    >
                        Log out
                    </LoadingButton>
                    <Button variant="outlined" onClick={() => handleCloseLogOutDialog()}>
                        Cancel
                    </Button>
                </Box>
            </Box >
        )
    }

    return (
        <CustomDialog
            open={open}
            handleClose={handleCloseLogOutDialog}
            renderTitle={() => <span>Are you sure?</span>}
            renderBody={renderLogoutDialogBody}
            boxProps={{ sx: { maxWidth: '30rem' } }}
        />
    )
}

export default LogOutDialog