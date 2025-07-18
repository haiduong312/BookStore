import type { FormProps } from "antd";
import { App, Button, Checkbox, Form, Input, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { loginAPI } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";
type FieldType = {
    username: string;
    password: string;
    remember?: string;
};

const LoginPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { message } = App.useApp();
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setLoading(true);
        const { username, password } = values;
        const res = await loginAPI(username, password);
        console.log(res.data);
        if (res.data) {
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem("access_token", res.data.access_token);
            message.success("success");
            navigate("/");
        } else {
            message.error("Error");
        }
        setLoading(false);
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
                    Đăng nhập tài khoản
                </h1>
                <Form
                    name="register"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Email"
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
                                Đăng nhập
                            </Button>
                        </Spin>
                    </Form.Item>
                    <div style={{ textAlign: "center" }}>
                        <span>Bạn chưa có tài khoản? </span>
                        <Link to="/register">Đăng ký</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};
export default LoginPage;
