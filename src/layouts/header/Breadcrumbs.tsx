import { Box, Breadcrumbs as BreadcrumbsMui, Link as LinkMui, Typography } from '@mui/material';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { theme } from '../../constants/appTheme';
import { routeNameBreadcrumbsNameMap } from '../../constants/routeNameMaps';
import { routeNames } from '../../constants/routeName';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbs = pathnames.map((_, index) => {
        const url = `/${pathnames.slice(0, index + 1).join('/')}`;
        if (url.includes('/edit/')) return;
        const routeName = routeNameBreadcrumbsNameMap[url] || 'Unknown';

        if (index < pathnames.length - 1)
            return (
                <LinkMui component={Link} key={url} to={url} color="inherit" underline="hover">
                    <Typography component={Box}>{routeName}</Typography>
                </LinkMui>
            )
        else
            return (
                <Typography key={url} color={theme.palette.common.white}>{routeName}</Typography>
            )
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
