import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';
import { routeNames } from '../../constants/routeName';

interface LogoProps {
  disabledLink?: boolean;
  sx?: object;
  [key: string]: any; // for any other props
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <img
        src={`/images/logo.png`}
        alt="Logo"
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to={routeNames.index} component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

export default Logo;
