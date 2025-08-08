import { useCurrentApp } from "components/context/app.context";
import { Row, Col, Button, Form, Input, Radio, Spin, App } from "antd";
import type { FormProps, RadioChangeEvent } from "antd";
import { useEffect, useState } from "react";
import "styles/order.scss";
import { LoadingOutlined } from "@ant-design/icons";
import { createAnOrder } from "@/services/api";

interface IProps {
    setCurrentStep: (v: number) => void;
}
type FieldType = {
    fullName?: string;
    phone?: string;
    address?: string;
    type?: any;
    totalPrice?: number;
    demoPrice?: number;
};

const Payment = ({ setCurrentStep }: IProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const { carts, setCarts, user } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [value, setValue] = useState(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
            });
        }
    }, [user]);
    useEffect(() => {
        const newTotalPrice = carts.reduce((sum, item) => {
            return sum + (item?.data?.price ?? 0) * item.quantity;
        }, 0);

        setTotalPrice(newTotalPrice);

        form.setFieldsValue({
            demoPrice: newTotalPrice,
            totalPrice: newTotalPrice,
        });
    }, [carts]);
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsLoading(true);
        const detail = carts.map((item) => ({
            _id: item.data._id,
            quantity: item.quantity,
            bookName: item.data.mainText,
        }));
        const { fullName, address, phone, totalPrice, type } = values;
        const res = await createAnOrder(
            fullName!,
            address!,
            phone!,
            totalPrice!,
            type,
            detail
        );
        if (res.data && res) {
            message.success("success");
            localStorage.removeItem("carts");
            setCarts([]);
            setCurrentStep(2);
        } else {
            message.error("error");
        }
        setIsLoading(false);
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
                            <div className="cart-quantity">
                                Số lượng: {item.quantity}
                            </div>
                            <div
                                className="cart-total"
                                style={{ marginLeft: 200 }}
                            >
                                Tổng:{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(item?.data?.price * item?.quantity)}
                            </div>
                        </div>
                    ))}
                </Col>
                <Col xs={24} md={8}>
                    <div className="summary-box">
                        <Form
                            name="basic"
                            form={form}
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                label={null}
                                name="type"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginBottom: 20,
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng chọn hình thức thanh toán!",
                                    },
                                ]}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Hình thức thanh toán
                                    </div>
                                    <Radio.Group
                                        onChange={onChange}
                                        value={value}
                                        defaultValue={1}
                                        options={[
                                            {
                                                value: "COD",
                                                label: "Thanh toán khi nhận hàng",
                                            },
                                            {
                                                value: "Banking",
                                                label: "Chuyển khoản nhận hàng",
                                            },
                                        ]}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 8,
                                        }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Họ tên"
                                name="fullName"
                                style={{ marginBottom: 20 }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập họ tên!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Số điện thoại"
                                name="phone"
                                style={{ marginBottom: 20 }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số điện thoại!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Địa chỉ"
                                name="address"
                                style={{ marginBottom: 20 }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập địa chỉ!",
                                    },
                                ]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="demoPrice"
                                style={{ marginBottom: 12 }}
                            >
                                <div style={{ fontSize: 16 }}>
                                    Tạm tính:{" "}
                                    <strong>
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(totalPrice)}
                                    </strong>
                                </div>
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="totalPrice"
                                style={{ marginBottom: 24 }}
                            >
                                <div style={{ fontSize: 16 }}>
                                    Tổng tiền:{" "}
                                    <strong
                                        style={{
                                            color: "#ee4d2d",
                                            fontSize: 18,
                                        }}
                                    >
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(totalPrice)}
                                    </strong>
                                </div>
                            </Form.Item>

                            <Form.Item style={{ textAlign: "right" }}>
                                <Spin
                                    spinning={isLoading}
                                    indicator={<LoadingOutlined spin />}
                                >
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            minWidth: 120,
                                            height: 40,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Thanh toán
                                    </Button>
                                </Spin>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
export default Payment;
