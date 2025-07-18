import type { FormProps } from "antd";
import { App, Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "@/services/api";
type FieldType = {
    username: string;
    password: string;
    remember?: string;
};

const LoginPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { username, password } = values;
        const res = await loginAPI(username, password);
        console.log(res.data);
        if (res.data) {
            localStorage.setItem("access token", res.data.access_token);
            message.success("success");
            navigate("/");
        } else {
            message.error("Error");
        }
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
                        <Button type="primary" htmlType="submit">
                            Đăng nhập
                        </Button>
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
