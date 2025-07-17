import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
type FieldType = {
    username?: string;
    password?: string;
    email?: string;
    phonenumber?: string;
    remember?: string;
};

const RegisterPage = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        console.log("Success:", values);
        setLoading(true);
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
    };
    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                backgroundColor: "#f0f2f5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "40px 30px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    maxWidth: "480px",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "24px",
                        color: "#333",
                    }}
                >
                    Đăng ký tài khoản
                </h1>
                <Form
                    name="register"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Tên đăng nhập"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên đăng nhập!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên đăng nhập" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu!",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập email!",
                            },
                            {
                                pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                message: "Email phải có định dạng @gmail.com!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Số điện thoại"
                        name="phonenumber"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                            {
                                pattern: /^[0-9]{9,11}$/,
                                message: "Số điện thoại không hợp lệ!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                    >
                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>

                    <Form.Item
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <Spin
                            indicator={<LoadingOutlined spin />}
                            size="small"
                            spinning={loading}
                        >
                            <Button type="primary" htmlType="submit">
                                Đăng ký
                            </Button>
                        </Spin>
                    </Form.Item>
                    <div style={{ textAlign: "center" }}>
                        <span>Bạn đã có tài khoản? </span>
                        <Link to="/login">Đăng nhập</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};
export default RegisterPage;
