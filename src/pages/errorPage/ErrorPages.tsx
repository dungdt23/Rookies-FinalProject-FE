import { Button, Container, Typography, styled } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { routeNames } from '../../constants/routeName';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

interface ErrorPageProps {
  code: number;
  title: string;
  heading: string;
  message: string;
}

const ErrorPage = ({ code, title, heading, message }: ErrorPageProps) => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate(routeNames.index);
  };

  return (
    <>
      <Helmet>
        <title>{`${code} ${title}`}</title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            {heading}
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            {message}
          </Typography>

          <Button sx={{mt: 3}} color='primary' size="large" variant="contained" onClick={goToHome}>
            Go to Home
          </Button>
        </StyledContent>
      </Container>
    </>
  );
};

const Error401 = () => {
  return <ErrorPage code={401} title="Unauthorized" heading="You are unauthorized!" message="Unauthorized - You do not have permission to access this page." />;
};

const Error403 = () => {
  return <ErrorPage code={403} title="Forbidden" heading="Forbidden" message="Forbidden - You do not have permission to access this page." />;
};

const Error404 = () => {
  return <ErrorPage code={404} title="Not Found" heading="Page Not Found" message="Page Not Found - The page you are looking for does not exist." />;
};

const Error500 = () => {
  return <ErrorPage code={500} title="Internal Server Error" heading="Internal Server Error" message="Internal Server Error - Something went wrong on the server." />;
};

export { Error401, Error403, Error404, Error500 };

