import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Logo } from '../../components/logo';
import { useSnackbar } from '../../contexts/SnackbarContext';
import axiosInstance from '../../services/axios';
import { handleResponseError, handleResponseSuccess } from '../../helpers/axiosHandler';

const StyledHeader = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

export default function SimpleLayout() {
  const { showSnackbar } = useSnackbar();

  axiosInstance.interceptors.response.use(
    (response) => handleResponseSuccess(response, showSnackbar),
    (error) => handleResponseError(error, showSnackbar)
  );
  return (
    <>
      <StyledHeader>
        <Logo sx={{ maxWidth: '5rem' }} />
      </StyledHeader>

      <Outlet />
    </>
  );
}
