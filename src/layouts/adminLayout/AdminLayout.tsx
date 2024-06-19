import { Box } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../header";
import { Sidebar } from "../siderbar";

const AdminLayout: FC = () => {
    return (
        <Box display={'flex'} sx={{ flexDirection: 'column' }}>
            <Header />
            <Box display={'flex'} sx={{ flexDirection: 'row', m: "1rem 1rem 0 1rem" }}>
                <Sidebar />
                <main style={{ padding: "1rem", width: "100%" }}>
                    <Outlet />
                </main>
            </Box>
        </Box>
    );
}

export default AdminLayout;
