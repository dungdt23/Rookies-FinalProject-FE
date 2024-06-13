import { List, ListItem, ListItemText, styled } from '@mui/material';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [activeItem, setActiveItem] = useState('Manage User');
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
        setActiveItem(item.label);
        if (item.to) navigate(item.to);
    };

    return (
        <StyledList>
            {menuItems.map((item) => (
                <StyledListItem
                    key={item.label}
                    active={activeItem === item.label}
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
