import { getBookCategoriesAPI, uploadFileAPI } from "services/api";
import {
    Modal,
    Form,
    Input,
    App,
    InputNumber,
    Select,
    Row,
    Col,
    Upload,
    Image,
} from "antd";
import type { FormProps, GetProp, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
type FieldType = {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
};

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    refreshTable: () => void;
}

type TUSerUploadFile = "thumbnail" | "slider";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
const CreateBook = ({
    isCreateModalOpen,
    setIsCreateModalOpen,
    refreshTable,
}: IProps) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [options, setOptions] = useState<{ value: string; label: string }[]>(
        []
    );
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>(
        []
    );
    const [fileListSlider, setFileListSLider] = useState<UploadFile[]>([]);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const { message } = App.useApp();
    const [form] = Form.useForm();

    const onCancel = () => {
        setFileListSLider([]);
        setFileListThumbnail([]);
        setIsCreateModalOpen(false);
        form.resetFields();
    };
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
    };
    const handleChange = (info: UploadChangeParam, type: TUSerUploadFile) => {
        if (info.file.status === "uploading") {
            type === "slider"
                ? setLoadingSlider(true)
                : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === "done") {
            // Get this url from response in real world.
            type === "slider"
                ? setLoadingSlider(false)
                : setLoadingThumbnail(false);
        }
    };

    useEffect(() => {
        const getBookCategories = async () => {
            const res = await getBookCategoriesAPI();
            if (res && res.data) {
                const mapped = res.data.map((item) => ({
                    value: item,
                    label: item,
                }));
                setOptions(mapped);
            }
        };
        getBookCategories();
    }, []);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true);
        console.log(values);
        setIsSubmit(false);
    };
    const handleRemove = async (file: UploadFile, type: TUSerUploadFile) => {
        if (type === "thumbnail") {
            setFileListThumbnail([]);
        }
        if (type === "slider") {
            const newSlider = fileListSlider.filter((x) => x.uid !== file.uid);
            setFileListSLider(newSlider);
        }
    };
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const handleUploadFile = async (
        options: RcCustomRequestOptions,
        type: TUSerUploadFile
    ) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");
        if (res && res.data) {
            const uploadFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    res.data.fileUploaded
                }`,
            };
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadFile }]);
                setLoadingThumbnail(false);
            } else {
                setFileListSLider((prevState) => [
                    ...prevState,
                    { ...uploadFile },
                ]);
                setLoadingSlider(false);
            }
            if (onSuccess) {
                onSuccess("ok");
            } else {
                message.error(res.message);
            }
        }
    };
    return (
        <Modal
            title="Add new book"
            open={isCreateModalOpen}
            onCancel={onCancel}
            onOk={() => form.submit()}
            okText="Submit"
            confirmLoading={isSubmit}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Book Name"
                            name="mainText"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter book name!",
                                },
                            ]}
                            style={{ marginBottom: 16 }}
                        >
                            <Input
                                placeholder="Enter book name"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Author"
                            name="author"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter author!",
                                },
                            ]}
                            style={{ marginBottom: 16 }}
                        >
                            <Input
                                placeholder="Enter author"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 16 }}
                        >
                            <InputNumber
                                addonAfter="đ"
                                style={{ width: "100%" }}
                                controls={false}
                                accept=""
                                formatter={(value) => {
                                    return `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                    );
                                }}
                                parser={(value) =>
                                    value?.replace(/\D/g, "") || ""
                                }
                                onKeyDown={(e) => {
                                    const allowedKeys = [
                                        "Backspace",
                                        "Delete",
                                        "ArrowLeft",
                                        "ArrowRight",
                                        "Tab",
                                    ];
                                    if (
                                        !/[0-9]/.test(e.key) &&
                                        !allowedKeys.includes(e.key)
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                onPaste={(e) => {
                                    const pasted =
                                        e.clipboardData.getData("Text");
                                    if (!/^\d+$/.test(pasted)) {
                                        e.preventDefault(); // chặn dán chữ
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 16 }}
                        >
                            <Select
                                options={options}
                                defaultValue={options[0]}
                                placeholder="Select category"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: "Please specify quantity!",
                                },
                            ]}
                            style={{ marginBottom: 16 }}
                        >
                            <Input
                                placeholder="Specify quantity"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Thumbnail"
                            name="thumbnail"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 16 }}
                        >
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                beforeUpload={beforeUpload}
                                onChange={(info) =>
                                    handleChange(info, "thumbnail")
                                }
                                onRemove={(file) =>
                                    handleRemove(file, "thumbnail")
                                }
                                customRequest={(options) =>
                                    handleUploadFile(options, "thumbnail")
                                }
                                fileList={fileListThumbnail}
                                onPreview={handlePreview}
                                maxCount={1}
                            >
                                {" "}
                                <div>
                                    {loadingThumbnail ? (
                                        <LoadingOutlined />
                                    ) : (
                                        <PlusOutlined />
                                    )}{" "}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: "none" }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) =>
                                            setPreviewOpen(visible),
                                        afterOpenChange: (visible) =>
                                            !visible && setPreviewImage(""),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Slider"
                            name="slider"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 16 }}
                        >
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                multiple={true}
                                beforeUpload={beforeUpload}
                                onChange={(info) =>
                                    handleChange(info, "slider")
                                }
                                onRemove={(file) =>
                                    handleRemove(file, "slider")
                                }
                                customRequest={(options) =>
                                    handleUploadFile(options, "slider")
                                }
                                onPreview={handlePreview}
                                fileList={fileListSlider}
                            >
                                <div>
                                    {loadingSlider ? (
                                        <LoadingOutlined />
                                    ) : (
                                        <PlusOutlined />
                                    )}{" "}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: "none" }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) =>
                                            setPreviewOpen(visible),
                                        afterOpenChange: (visible) =>
                                            !visible && setPreviewImage(""),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateBook;
