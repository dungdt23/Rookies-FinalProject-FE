import { Box, BoxProps, Dialog, Divider, Paper, Typography, styled } from "@mui/material";
import { FC, ReactNode } from "react";

interface CustomDialogProps {
    open: boolean;
    handleClose: () => void;
    renderTitle: () => ReactNode;
    renderBody: () => ReactNode;
    boxProps?: BoxProps;
}

const TitleBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.grey[200], // Use appropriate grey color
    color: theme.palette.primary.main,
    alignItems: 'center',
    padding: '0 2rem',
    minHeight: '5vh',
    borderTopLeftRadius: theme.shape.borderRadius, // Apply border radius to match the Paper component
    borderTopRightRadius: theme.shape.borderRadius, // Apply border radius to match the Paper component
}));

const ContentBox = styled(Box)(({ theme }) => ({
    padding: '1rem 2rem 2rem 2rem',
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: theme.shape.borderRadius, // Apply border radius to match the Paper component
    borderBottomRightRadius: theme.shape.borderRadius, // Apply border radius to match the Paper component
}));

const CustomDialog: FC<CustomDialogProps> = ({ open, handleClose, renderTitle, renderBody, boxProps, ...props }) => {
    return (
        <Dialog
            onClose={handleClose}
            open={open}
            sx={{ 
                zIndex: 1000,
             }}
            {...props}>
            <Paper 
            elevation={3} 
            square={false} 
            sx={{ 
                borderRadius: 5 ,
                
            }}>
                <Box {...boxProps}>
                    <TitleBox>
                        <Typography variant="h6">
                            {renderTitle()}
                        </Typography>
                    </TitleBox>
                    <Divider />
                    <ContentBox>
                        {renderBody()}
                    </ContentBox>
                </Box>
            </Paper>
        </Dialog>
    )
}

export default CustomDialog;