import { Box, List, ListItem, ListItemText, styled, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarItem, menuItems as sidebarItems } from './sidebarItems';
import { Logo } from '../../components/logo';
import { theme } from '../../constants/appTheme';

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
    const [activeItem, setActiveItem] = useState<string>(location.pathname);
    const navigate = useNavigate();

    const handleItemClick = (item: SidebarItem) => {
        if (item.to) {
            navigate(item.to);
            setActiveItem(item.to);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Logo sx={{ maxWidth: '7rem' }} />
                <Typography fontSize='1.2rem' fontWeight='700' color={theme.palette.primary.main}>Online Asset Management</Typography>
            </Box>
            <StyledList>
                {sidebarItems.map((item) => (
                    <StyledListItem
                        key={item.label}
                        active={activeItem === item.to}
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
