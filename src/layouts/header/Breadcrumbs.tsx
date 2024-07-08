import { Box, Breadcrumbs as BreadcrumbsMui, Link as LinkMui, Typography } from '@mui/material';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { theme } from '../../constants/appTheme';
import { routeNames } from '../../constants/routeName';
import { routeNameBreadcrumbsNameMap } from '../../constants/routeNameMaps';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const generateUrl = (index: number, pathnames: string[]) => {
        return `/${pathnames.slice(0, index + 1).join('/')}`;
    };

    const generateRouteName = (url: string): string => {
        // Check for dynamic paths and replace with generic paths for breadcrumb names
        if (url.match(/\/assets\/[^/]+\/assignment-history/)) {
            return routeNameBreadcrumbsNameMap[routeNames.asset.history('')];
        }

        if (url.includes("/edit/")) return "";
        return routeNameBreadcrumbsNameMap[url] || "";
    };

    const breadcrumbs = pathnames.map((_, index) => {
        const url = generateUrl(index, pathnames);
        const routeName = generateRouteName(url);

        if (routeName === "") return
        if (!url.includes("/edit") && index < pathnames.length - 1) {
            return (
                <LinkMui component={Link} key={url} to={url} color="inherit" underline="hover">
                    <Typography component={Box}>{routeName}</Typography>
                </LinkMui>
            );
        } else {
            return (
                <Typography key={url} color={theme.palette.common.white}>
                    {routeName}
                </Typography>
            );
        }
    });

    const renderHome = () => {
        if (pathnames.length >= 1)
            return (
                <LinkMui key={'home'} component={Link} to={routeNames.index} color="inherit" underline="hover" >
                    <Typography>Home</Typography>
                </LinkMui>
            )
        else
            return (
                <Typography color={theme.palette.common.white}>Home</Typography>
            )
    }

    return (
        <BreadcrumbsMui aria-label="breadcrumb" sx={{ color: theme.palette.lightGrey.main, margin: "auto 0 auto 0" }}>
            {renderHome()}
            {breadcrumbs}
        </BreadcrumbsMui>
    );
};

export default Breadcrumbs;
