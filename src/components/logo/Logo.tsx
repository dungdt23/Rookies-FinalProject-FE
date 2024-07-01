import { forwardRef, FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps, Link } from '@mui/material';
import { routeNames } from '../../constants/routeName';
import { SxProps } from '@mui/system';

interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  sx?: SxProps;
}

const Logo: FC<LogoProps> = ({ disabledLink = false, sx, ...props }) => {
  const theme = useTheme();

  const logo = (
    <Box
      component="div"
      sx={{
        display: 'inline-flex',
        ...sx,
      }}
      {...props}
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
};

export default Logo;
