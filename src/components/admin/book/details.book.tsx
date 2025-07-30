import { Descriptions, Drawer, Divider } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE } from "services/helpers";
import PicturePreview from "./picture.preview";
interface IProps {
    openViewDetails: boolean;
    setOpenViewDetails: (v: boolean) => void;
    dataViewDetails: IBookTable | null;
    setDataViewDetails: (v: IBookTable | null) => void;
}
const DetailsBook = ({
    openViewDetails,
    setOpenViewDetails,
    dataViewDetails,
    setDataViewDetails,
}: IProps) => {
    const onClose = () => {
        setOpenViewDetails(false);
        setDataViewDetails(null);
    };

    return (
        <>
            <Drawer
                title="Customer information"
                closable={{ "aria-label": "Close Button" }}
                width={"50vw"}
                onClose={onClose}
                open={openViewDetails}
            >
                <Descriptions title="Book Info" bordered column={2}>
                    <Descriptions.Item label="Book Name" span={2}>
                        {dataViewDetails?.mainText}
                    </Descriptions.Item>
                    <Descriptions.Item label="Category">
                        {dataViewDetails?.category}
                    </Descriptions.Item>
                    <Descriptions.Item label="Author">
                        {dataViewDetails?.author}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                        {dataViewDetails?.price
                            ? new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                              }).format(Number(dataViewDetails.price))
                            : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created at">
                        {dayjs(dataViewDetails?.createdAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left">Thumbnails</Divider>
                <PicturePreview
                    dataViewDetails={dataViewDetails}
                    setDataViewDetails={setDataViewDetails}
                />
            </Drawer>
        </>
    );
};

export default DetailsBook;
