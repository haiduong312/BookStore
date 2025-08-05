import { getBookCategoriesAPI, getBooksAPI } from "@/services/api";
import {
    FilterTwoTone,
    LoadingOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import type { FormProps, TabsProps } from "antd";
import {
    Button,
    Checkbox,
    Form,
    Row,
    Col,
    Divider,
    InputNumber,
    Rate,
    Tabs,
    Pagination,
    Spin,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type FieldType = {
    range: {
        from: number;
        to: number;
    };
    category: string[];
};

const items: TabsProps["items"] = [
    {
        key: "1",
        label: "Phổ biến",
        children: <></>,
    },
    {
        key: "2",
        label: "Hàng mới",
        children: <></>,
    },
    {
        key: "3",
        label: "Giá từ thấp đến cao",
        children: <></>,
    },
    {
        key: "4",
        label: "Giá từ cao đến thấp",
        children: <></>,
    },
];
const HomePage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<
        { value: string; label: string }[]
    >([]);
    const [book, setBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

    const handleChangeFilter = (changeValues: any, values: any) => {
        console.log(changeValues, values);
        if (changeValues.category) {
            const category = values.category;
            if (category && category.length) {
                const f = category.join(",");
                setFilter(`category=${f}`);
            } else {
                setFilter("");
            }
        }
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        if (values?.range?.to >= 0 && values?.range?.from >= 0) {
            let f = `price>=${values.range.from}&price<=${values?.range?.to}`;
            if (values?.category?.length) {
                const cate = values.category.join(",");
                f += `&category=${cate}`;
            }
            setFilter(f);
        }
    };

    const onChange = (key: string) => {
        if (key === "1") {
            setSortQuery(`sort=-sold`);
        }
        if (key === "2") {
            setSortQuery(`sort=-updatedAt`);
        }
        if (key === "3") {
            setSortQuery(`sort=price`);
        }
        if (key === "4") {
            setSortQuery(`sort=-price`);
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
                setCategories(mapped);
            }
        };
        getBookCategories();
    }, []);
    useEffect(() => {
        const getBookList = async () => {
            setIsLoading(true);
            let query = `current=${current}&pageSize=${pageSize}`;
            if (filter) {
                query += `&${filter}`;
            }
            if (sortQuery) {
                query += `&${sortQuery}`;
            }

            const res = await getBooksAPI(query);
            if (res.data && res) {
                setBook(res.data.result);
                setTotal(res.data.meta.total);
            }
            setIsLoading(false);
        };
        getBookList();
    }, [current, pageSize, sortQuery, filter]);

    const handlePageChange = (pagination: {
        current: number;
        pageSize: number;
    }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };
    return (
        <div
            style={{
                maxWidth: 1440,
                margin: "0 auto",
                padding: 20,
                background: "#f9f9f9",
            }}
        >
            <Row gutter={24} align="stretch" style={{ minHeight: "100vh" }}>
                <Col md={4} sm={0} xs={0} style={{ height: "100%" }}>
                    <div
                        style={{
                            height: "100vh",
                            background: "#fff",
                            padding: 16,
                            borderRadius: 8,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <FilterTwoTone />
                                Bộ lọc tìm kiếm
                            </span>
                            <ReloadOutlined
                                title="Reset"
                                onClick={() => {
                                    form.resetFields(), setFilter("");
                                }}
                                style={{
                                    float: "right",
                                    cursor: "pointer",
                                }}
                            />
                        </div>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            onValuesChange={(changedValues, values) =>
                                handleChangeFilter(changedValues, values)
                            }
                            layout="vertical"
                            style={{ marginTop: 16 }}
                        >
                            <Form.Item<FieldType>
                                label="Danh mục sản phẩm"
                                name="category"
                            >
                                <Checkbox.Group>
                                    <Row
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {categories.map((item, index) => {
                                            return (
                                                <Col key={index}>
                                                    <Checkbox
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </Checkbox>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Divider />
                            <Form.Item label="Khoảng giá">
                                <Row gutter={8} align="middle">
                                    <Col span={10}>
                                        <Form.Item<FieldType>
                                            name={["range", "from"]}
                                            noStyle
                                        >
                                            <InputNumber
                                                style={{ width: "100%" }}
                                                placeholder="Từ"
                                                min={0}
                                                formatter={(value, info) => {
                                                    if (value === undefined)
                                                        return "";
                                                    return value
                                                        .toString()
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                        );
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col>-</Col>
                                    <Col span={10}>
                                        <Form.Item
                                            name={["range", "to"]}
                                            noStyle
                                        >
                                            <InputNumber
                                                style={{ width: "100%" }}
                                                placeholder="Đến"
                                                min={0}
                                                formatter={(value, info) => {
                                                    if (value === undefined)
                                                        return "";
                                                    return value
                                                        .toString()
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                        );
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div
                                    style={{
                                        marginTop: 8,
                                        textAlign: "center",
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        onClick={() => form.submit()}
                                    >
                                        Áp dụng
                                    </Button>
                                </div>
                            </Form.Item>
                            <Divider />
                            <Form.Item label="Đánh giá">
                                <div>
                                    <div style={{ marginBottom: 8 }}>
                                        <Rate value={5} disabled />
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <Rate value={4} disabled />
                                        <span style={{ marginLeft: 8 }}>
                                            trở lên
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <Rate value={3} disabled />
                                        <span style={{ marginLeft: 8 }}>
                                            trở lên
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <Rate value={2} disabled />
                                        <span style={{ marginLeft: 8 }}>
                                            trở lên
                                        </span>
                                    </div>
                                    <div>
                                        <Rate value={1} disabled />
                                        <span style={{ marginLeft: 8 }}>
                                            trở lên
                                        </span>
                                    </div>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col md={20} xs={24}>
                    <Spin
                        spinning={isLoading}
                        indicator={<LoadingOutlined spin />}
                    >
                        <Row>
                            <Tabs
                                defaultActiveKey="1"
                                items={items}
                                onChange={(key) => {
                                    onChange(key);
                                }}
                            />
                        </Row>
                        <Row gutter={[8, 16]}>
                            {book.map((item, index) => (
                                <Col
                                    key={index}
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                    xl={6}
                                    onClick={() =>
                                        navigate(`/book/${item._id}`)
                                    }
                                >
                                    <div>
                                        <div>
                                            <div
                                                style={{
                                                    background: "#fff",
                                                    borderRadius: 8,
                                                    padding: 16,
                                                    boxShadow:
                                                        "0 2px 8px rgba(0,0,0,0.1)",
                                                    display: "flex",
                                                    flex: 1,
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 120,
                                                        height: 160,
                                                        overflow: "hidden",
                                                        marginBottom: 12,
                                                    }}
                                                >
                                                    <img
                                                        src={`${
                                                            import.meta.env
                                                                .VITE_BACKEND_URL
                                                        }/images/book/${
                                                            item.thumbnail
                                                        }`}
                                                        alt=""
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        fontWeight: 500,
                                                        marginBottom: 8,
                                                        minHeight: 48,
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                    }}
                                                >
                                                    {item.mainText}
                                                </div>
                                                <div
                                                    style={{
                                                        color: "#cf1322",
                                                        fontWeight: 600,
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    {new Intl.NumberFormat(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }
                                                    ).format(item.price)}
                                                </div>
                                                <div>
                                                    <Rate value={5} disabled />
                                                    <div>
                                                        Đã bán {item.sold}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <Row
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 10,
                            }}
                        >
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                defaultCurrent={1}
                                onChange={(page, pageSize) =>
                                    handlePageChange({
                                        current: page,
                                        pageSize,
                                    })
                                }
                            />
                        </Row>
                    </Spin>
                </Col>
            </Row>
        </div>
    );
};

export default HomePage;
