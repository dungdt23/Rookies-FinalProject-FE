import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { Typography } from "@mui/material";

const HomePage: FC = () => {
    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <Typography>
                This is home
            </Typography>
        </>
    )
}

export default HomePage;