import { FC } from "react";
import { Helmet } from "react-helmet-async";
import AssignmentListPageStaff from "../assignmentPages/assignmentList/AssginmentListPageStaff";

const HomePage: FC = () => {
    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <AssignmentListPageStaff/>
        </>
    )
}

export default HomePage;