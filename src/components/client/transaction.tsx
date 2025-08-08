import { Button, Result } from "antd";

const Transaction = () => (
    <Result
        status="success"
        title="Đặt hàng thành công"
        subTitle="Hệ thống đã ghi nhận đơn hàng của bạn"
        extra={[
            <Button
                type="primary"
                key="console"
                style={{ width: 300, height: 40 }}
            >
                Trang chủ
            </Button>,
            <Button key="buy" style={{ width: 300, height: 40 }}>
                Lịch sử mua hàng
            </Button>,
        ]}
    />
);

export default Transaction;
