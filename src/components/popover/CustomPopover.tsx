import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import { Box, BoxProps, Divider, IconButton, Paper, Popper, styled, Typography } from "@mui/material";
import { FC, ReactNode, useEffect, useRef } from "react";

interface CustomPopperProps {
    elAnchor: HTMLElement | null;
    open: boolean;
    handleClose: () => void;
    renderTitle: () => ReactNode;
    renderDescription: () => ReactNode;
    boxProps?: BoxProps;
}

const TitleBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.grey[200], // Use appropriate grey color
    color: theme.palette.primary.main,
    alignItems: 'center',
    padding: '0 1rem',
    borderTopLeftRadius: theme.shape.borderRadius, // Apply border radius to match the Paper component
    borderTopRightRadius: theme.shape.borderRadius, // Apply border radius to match the Paper component
}));

const ContentBox = styled(Box)(({ theme }) => ({
    padding: '1rem',
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: theme.shape.borderRadius, // Apply border radius to match the Paper component
    borderBottomRightRadius: theme.shape.borderRadius, // Apply border radius to match the Paper component
}));

const CustomPopper: FC<CustomPopperProps> = ({ elAnchor, open, handleClose, renderTitle, renderDescription, boxProps, ...props }) => {
    const popperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (popperRef.current && !popperRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [open, handleClose]);

    return (
        <Popper
            open={open}
            anchorEl={elAnchor}
            placement="bottom-start"
            sx={{ zIndex: 1000 }}
            {...props}
        >
            <Paper elevation={3} ref={popperRef} square={false} sx={{ borderRadius: 2 }}>
                <Box {...boxProps}>
                    <TitleBox>
                        <Typography variant="h6">
                            {renderTitle()}
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CancelPresentationRoundedIcon color='primary' />
                        </IconButton>
                    </TitleBox>
                    <Divider />
                    <ContentBox>
                        {renderDescription()}
                    </ContentBox>
                </Box>
            </Paper>
        </Popper>
    )
}

export default CustomPopper;
