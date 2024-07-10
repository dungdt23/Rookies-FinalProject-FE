import { Box } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../header";
import { Sidebar } from "../siderbar";

const AdminLayout: FC = () => {
    return (
        <Box display={'flex'} sx={{ flexDirection: 'column' }}>
            <Header />
            <Box display={'flex'} sx={{ flexDirection: 'row', m: "1rem 8px 0 8px" }}>
                <Sidebar />
                <main style={{ padding: "1rem", width: "100%", maxHeight: "80vh" }}>
                    <Outlet />
                </main>
            </Box>
        </Box>
    );
}

export default AdminLayout;
