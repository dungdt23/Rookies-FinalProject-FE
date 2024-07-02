import { Box, Button, styled } from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";
import { theme } from "../../constants/appTheme";
import { routeNames } from "../../constants/routeName";
import { useAuth } from "../../contexts/AuthContext";
import AccountPopover from "./AccountPopover";
import Breadcrumbs from "./Breadcrumbs";
const RootBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.primary.main,
    padding: '1.5rem 1rem'
}))

const Header: FC = () => {
    const { user } = useAuth();
    return (
        <RootBox className="header">
            <Breadcrumbs/>
            {user ? <AccountPopover /> 
            : <Button component={Link} to={routeNames.login} sx={{color: theme.palette.common.white}}>Login</Button>}
        </RootBox>
    )
}

export default Header;