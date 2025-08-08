import { useCurrentApp } from "components/context/app.context";
import { Row, Col, InputNumber, Popconfirm, App } from "antd";
import { useEffect, useState } from "react";
import "styles/order.scss";
import { DeleteTwoTone } from "@ant-design/icons";
interface IProps {
    setCurrentStep: (v: number) => void;
}
const OrderDetails = ({ setCurrentStep }: IProps) => {
    const { message } = App.useApp();
    const { carts, setCarts } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    useEffect(() => {
        const newTotalPrice = carts.reduce((sum, item) => {
            return sum + (item?.data?.price ?? 0) * item.quantity;
        }, 0);
        const newTotalQuantity = carts.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);
        setTotalPrice(newTotalPrice);
        setTotalQuantity(newTotalQuantity);
    }, [carts]);
    const handleQuantityChange = (value: number, index: number) => {
        const newQuantity = [...carts];
        newQuantity[index].quantity = value;
        setCarts(newQuantity);
    };
    const handleDelete = (index: number) => {
        const oldCarts = localStorage.getItem("carts");
        if (oldCarts) {
            const carts = JSON.parse(oldCarts);
            const newCarts = carts.filter((_: any, i: number) => i !== index);
            localStorage.setItem("carts", JSON.stringify(newCarts));
            setCarts(newCarts);
        }
    };
    const handleNextStep = () => {
        if (carts.length) {
            setCurrentStep(1);
        } else {
            message.error("Cart is empty");
            return;
        }
    };
    return (
        <div className="order-page">
            <Row gutter={24}>
                <Col xs={24} md={16}>
                    {carts.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img
                                src={`${
                                    import.meta.env.VITE_BACKEND_URL
                                }/images/book/${item?.data?.thumbnail}`}
                                alt={item?.data?.mainText}
                                className="cart-img"
                            />

                            <div className="cart-item_name">
                                {item?.data?.mainText}
                            </div>
                            <div className="cart-item_price">
                                Đơn giá:{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(item?.data?.price ?? 0)}
                            </div>
                            <InputNumber
                                className="cart-quantity"
                                min={1}
                                value={item.quantity}
                                onChange={(value) =>
                                    handleQuantityChange(value ?? 1, index)
                                }
                            />
                            <div
                                className="cart-total"
                                style={{ marginLeft: 50 }}
                            >
                                Tổng:{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(item?.data?.price * item?.quantity)}
                            </div>
                            <Popconfirm
                                title="Delete item"
                                description="Are you sure to delete this item?"
                                onConfirm={() => handleDelete(index)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteTwoTone twoToneColor="#f5222d" />
                            </Popconfirm>
                        </div>
                    ))}
                </Col>
                <Col xs={24} md={8}>
                    <div className="summary-box">
                        <div>
                            Tạm tính:{" "}
                            <strong>
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(totalPrice)}
                            </strong>
                        </div>
                        <div>
                            Tổng tiền:{" "}
                            <strong style={{ color: "#ee4d2d" }}>
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(totalPrice)}
                            </strong>
                        </div>
                        <button onClick={() => handleNextStep()}>
                            Mua hàng ({totalQuantity})
                        </button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default OrderDetails;
