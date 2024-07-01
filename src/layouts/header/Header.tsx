import { Box, Breadcrumbs, Button, styled, Typography } from "@mui/material";
import { FC, useState } from "react";
import { NoStyleLink } from "../../components/noStyleLink";
import AccountPopover from "./AccountPopover";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { routeNames } from "../../constants/routeName";
import { theme } from "../../constants/appTheme";

interface BreadcrumbsInfo {
    label: string,
    to: string
}

const HeaderMockInfo: BreadcrumbsInfo[] = [
    {
        label: "Manage User",
        to: ""
    },
    {
        label: "Create New User",
        to: ""
    }
]

const RootBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.primary.main,
    padding: '1.5rem 1rem'
}))

const Header: FC = () => {
    const [history, setHistory] = useState<BreadcrumbsInfo[]>(HeaderMockInfo)
    const { user } = useAuth();
    return (
        <RootBox className="header">
            <Breadcrumbs separator=">" aria-label="breadcrumb">
                {history.map((page) => {
                    return (
                        page === history[history.length - 1]
                            ? <Typography key={page.label} variant="body2">{page.label}</Typography>
                            : <NoStyleLink key={page.label} to={page.to}>{page.label}</NoStyleLink>
                    );
                })}
            </Breadcrumbs>
            {user ? <AccountPopover /> 
            : <Button component={Link} to={routeNames.login} sx={{color: theme.palette.common.white}}>Login</Button>}
        </RootBox>
    )
}

export default Header;