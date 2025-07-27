import { Modal, Form, Input, App } from "antd";
import type { FormProps } from "antd";
import { updateUserAPI } from "@/services/api";
import { useState, useEffect } from "react";

type FieldType = {
    email: string;
    fullName: string;
    _id: string;
    phone: string;
};
interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: IUserTable | null;
    setDataUpdate: (v: IUserTable | null) => void;
    refreshTable: () => void;
}

const UpdateUser = ({
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    refreshTable,
    dataUpdate,
    setDataUpdate,
}: IProps) => {
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const onCancel = () => {
        setIsUpdateModalOpen(false);
        form.resetFields();
    };

    const [form] = Form.useForm();
    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                email: dataUpdate.email,
                fullName: dataUpdate.fullName,
                phone: dataUpdate.phone,
            });
        }
    }, [dataUpdate]);
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { fullName, phone, _id, email } = values;
        setIsSubmit(true);
        try {
            const res = await updateUserAPI(_id, fullName, phone);
            if (res && res.data) {
                message.success("Updated successfully");
                setIsUpdateModalOpen(false);
                setDataUpdate(null);
                refreshTable();
            } else {
                notification.error({
                    message: "Error",
                    description: "User update failed!",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "User update failed!",
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Create user"
            closable={{ "aria-label": "Custom Close Button" }}
            open={isUpdateModalOpen}
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
                    hidden
                    label="id"
                    name="_id"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>
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
export default UpdateUser;
