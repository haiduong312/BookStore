import { useCurrentApp } from "../context/app.context";

const AppHeader = () => {
    const { user } = useCurrentApp();
    return (
        <div>
            app header
            <div>{JSON.stringify(user)}</div>
        </div>
    );
};
export default AppHeader;
