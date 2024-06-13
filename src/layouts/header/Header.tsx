import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { FC, useState } from "react";
import { NoStyleLink } from "../../components/noStyleLink";

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

const Header: FC = () => {
    const [history, setHistory] = useState<BreadcrumbsInfo[]>(HeaderMockInfo)
    return (
        <Box className="header">
            <Breadcrumbs separator=">" aria-label="breadcrumb">
                {history.map((page) => {
                    return (
                        page === history[history.length - 1]
                            ? <Typography key={page.label} variant="body2">{page.label}</Typography>
                            : <NoStyleLink key={page.label} to={page.to}><Link variant="body2">{page.label}</Link> </NoStyleLink>
                    );
                })}
            </Breadcrumbs>
        </Box>
    )
}

export default Header;