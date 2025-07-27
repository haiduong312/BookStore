import { Descriptions, Drawer, Avatar } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE } from "services/helpers";
interface IProps {
    openViewDetails: boolean;
    setOpenViewDetails: (v: boolean) => void;
    dataViewDetails: IUserTable | null;
    setDataViewDetails: (v: IUserTable | null) => void;
}
const DetailsUser = ({
    openViewDetails,
    setOpenViewDetails,
    dataViewDetails,
    setDataViewDetails,
}: IProps) => {
    const onClose = () => {
        setOpenViewDetails(false);
        setDataViewDetails(null);
    };
    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
        dataViewDetails?.avatar
    }`;

    return (
        <>
            <Drawer
                title="Customer information"
                closable={{ "aria-label": "Close Button" }}
                width={"50vw"}
                onClose={onClose}
                open={openViewDetails}
            >
                <Descriptions title="User Info" bordered column={2}>
                    <Descriptions.Item label="UserName">
                        {dataViewDetails?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {dataViewDetails?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                        {dataViewDetails?.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Role">
                        {dataViewDetails?.role}
                    </Descriptions.Item>
                    <Descriptions.Item label="Avatar">
                        <Avatar size={40} src={avatarURL}></Avatar>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created at">
                        {dayjs(dataViewDetails?.createdAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default DetailsUser;
