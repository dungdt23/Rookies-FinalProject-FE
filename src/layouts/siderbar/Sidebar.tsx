import { List, ListItem, ListItemText, styled } from '@mui/material';
import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routeNames } from '../../constants/routeName';

const StyledListItem = styled(ListItem)<{ active: boolean }>(({ theme, active }) => ({
    backgroundColor: active ? theme.palette.primary.main : theme.palette.lightGrey.main,
    color: active ? 'white' : 'black',
    '&:hover': {
        backgroundColor: active ? '#d50000' : '#eff1f5',
    },
    marginTop: '5px'
}));

const StyledList = styled(List) (() => ({
    minWidth: '15rem',
}))

interface SidebarItem {
    label: string,
    to?: string
}

const Sidebar: FC = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState<string>(location.pathname);
    const navigate = useNavigate();

    const menuItems: SidebarItem[] = [
        { label: 'Home', to: routeNames.index },
        { label: 'Manage User', to: routeNames.user.list },
        { label: 'Manage Asset' },
        { label: 'Manage Assignment' },
        { label: 'Request for Returning' },
        { label: 'Report' },
    ];

    const handleItemClick = (item: SidebarItem) => {
        if (item.to) {
            navigate(item.to);
            setActiveItem(item.to);
        }
    };

    return (
        <StyledList>
            {menuItems.map((item) => (
                <StyledListItem
                    key={item.label}
                    active={activeItem === item.to}
                    onClick={() => handleItemClick(item)}
                >
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                            fontWeight: 'bold' ,
                        }} />
                </StyledListItem>
            ))}
        </StyledList>
    );
};

export default Sidebar;
