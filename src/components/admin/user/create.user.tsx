import { Modal, Form, Input, App } from "antd";
import type { FormProps } from "antd";
import { createUserAPI } from "@/services/api";
import { useState } from "react";

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
};
interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    refreshTable: () => void;
}

const CreateUser = ({
    isCreateModalOpen,
    setIsCreateModalOpen,
    refreshTable,
}: IProps) => {
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const onCancel = () => {
        setIsCreateModalOpen(false);
        form.resetFields();
    };

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { email, fullName, phone, password } = values;
        setIsSubmit(true);
        try {
            const res = await createUserAPI(fullName, email, phone, password);
            if (res && res.data) {
                message.success("Created successfully");
                setIsCreateModalOpen(false);
                form.resetFields();
                refreshTable();
            } else {
                notification.error({
                    message: "Error",
                    description: "User creation failed!",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "User creation failed!",
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Create user"
            closable={{ "aria-label": "Custom Close Button" }}
            open={isCreateModalOpen}
            onCancel={onCancel}
            onOk={() => {
                form.submit();
            }}
            okText="Submit"
            confirmLoading={isSubmit}
        >
            <Form
                name="register"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >
                <Form.Item<FieldType>
                    label="Tên đăng nhập"
                    name="fullName"
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
                    name="phone"
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
            </Form>
        </Modal>
    );
};
export default CreateUser;
