import React from "react";
import { useCurrentApp } from "components/context/app.context";
import { Button, Result } from "antd";
import { useLocation, Link } from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}
const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="Oops! It looks like you are not logged in"
                extra={
                    <Button type="primary">
                        <Link to="/login">Log in</Link>
                    </Button>
                }
            />
        );
    }
    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === "USER") {
            return (
                <Result
                    status="403"
                    title="Sorry, you are not authorized to access this page"
                    extra={
                        <Button type="primary">
                            <Link to="/">Back Home</Link>
                        </Button>
                    }
                />
            );
        }
    }
    return <>{props.children}</>;
};
export default ProtectedRoute;
