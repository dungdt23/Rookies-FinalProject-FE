import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import { Box, BoxProps, Divider, IconButton, Paper, Popper, styled, Typography } from "@mui/material";
import { FC, ReactNode, useEffect, useRef } from "react";

interface PopperProps {
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
}));

const ContentBox = styled(Box)(({ theme }) => ({
    padding: '1rem',
    backgroundColor: theme.palette.background.paper,
}));

const CustomPopper: FC<PopperProps> = ({ elAnchor, open, handleClose, renderTitle, renderDescription, boxProps, ...props }) => {
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
            {...props}
        >
            <Paper elevation={3} ref={popperRef}>
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
