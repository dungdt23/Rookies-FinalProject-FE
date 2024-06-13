import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../header";

const AdminLayout: FC = () => {
    return (
        <>
            <Header />
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;
