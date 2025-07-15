import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            Hello layout
            <Outlet />
        </div>
    );
}

export default Layout;
