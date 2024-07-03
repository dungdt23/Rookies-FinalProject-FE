import { Box, List, ListItem, ListItemText, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/logo';
import { theme } from '../../constants/appTheme';
import { useAuth } from '../../contexts/AuthContext';
import { UserType } from '../../types/user';
import { adminSidebarItems, guestSidebarItems, SidebarItem, staffSidebarItems } from './sidebarItems';
import { routeNameSidebarNameMap } from '../../constants/routeNameMaps';

const StyledListItem = styled(ListItem)<{ active: boolean }>(({ theme, active }) => ({
    backgroundColor: active ? theme.palette.primary.main : theme.palette.lightGrey.main,
    color: active ? 'white' : 'black',
    '&:hover': {
        backgroundColor: active ? '#d50000' : '#eff1f5',
        cursor: 'pointer', // Change cursor on hover
        opacity: 0.7, // Example of graying out effect
    },
    marginTop: '5px'
}));

const StyledList = styled(List)(() => ({
    minWidth: '15rem',
}))

const Sidebar: FC = () => {
    const location = useLocation();
    // if location.pathname == users/edit/blablabla cut it to users/edit
    const pathnames = location.pathname.split('/').filter((x) => x);
    let url = `/${pathnames.slice(0, pathnames.length).join('/')}`;

    // Check for edit pattern and truncate the path
    if (url.includes('/edit/')) {
        url = `/${pathnames.slice(0, pathnames.indexOf('edit') + 1).join('/')}`;
    }

    const activeItem: SidebarItem | undefined = (routeNameSidebarNameMap[url])

    const navigate = useNavigate();
    const { user } = useAuth();

    const handleItemClick = (item: SidebarItem) => {
        if (item.to) {
            navigate(item.to);
        }
    };

    const getSidebarItems = (): SidebarItem[] => {
        switch (user?.role) {
            case UserType.Admin:
                return Object.values(adminSidebarItems).map((item) => item);
            case UserType.Staff:
                return Object.values(staffSidebarItems).map((item) => item);
            default:
                return Object.values(guestSidebarItems).map((item) => item);
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Logo sx={{ maxWidth: '7rem' }} />
                <Typography fontSize='1.2rem' fontWeight='700' color={theme.palette.primary.main}>Online Asset Management</Typography>
            </Box>
            <StyledList>
                {getSidebarItems().map((item) => (
                    <StyledListItem
                        key={item.label}
                        active={JSON.stringify(activeItem) == JSON.stringify(item)}
                        onClick={() => handleItemClick(item)}
                    >
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                                fontWeight: 'bold',
                            }} />
                    </StyledListItem>
                ))}
            </StyledList>
        </Box>
    );
};

export default Sidebar;
