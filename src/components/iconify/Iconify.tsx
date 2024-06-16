import { forwardRef, ForwardedRef } from 'react';
// icons
import { Icon, IconProps } from '@iconify/react';
// @mui
import { Box, BoxProps } from '@mui/material';
import { SxProps, Theme } from '@mui/system';

// Define the props interface
interface IconifyProps extends BoxProps {
  icon: string | React.ElementType;
  width?: number | string;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

const Iconify = forwardRef<HTMLElement, IconifyProps>(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref as ForwardedRef<HTMLElement>}
    component={Icon}
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
));

export default Iconify;
