import { OrderHistoryAPI } from "@/services/api";
import { Divider, Drawer, Table, Tag } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE } from "services/helpers";
import { useEffect, useState } from "react";

const History = () => {
    const [currentData, setCurrentData] = useState<IHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDetails, setOpenDetails] = useState<boolean>(false);
    const [dataDetails, setDataDetails] = useState<IHistory | null>(null);

    const columns: TableProps<IHistory>["columns"] = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (value, record, index) => <>{index + 1}</>,
        },
        {
            title: "Thời gian",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (item) => dayjs(item).format(FORMATE_DATE),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (item) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(item),
        },
        {
            title: "Tags",
            render: () => <Tag color="green">Thành công</Tag>,
        },
        {
            title: "Chi tiết",
            dataIndex: "detail",
            key: "detail",
            render: (_, record) => (
                <a
                    style={{
                        color: "#1890ff",
                        cursor: "pointer",
                        textDecoration: "underline",
                    }}
                    onClick={() => (
                        setOpenDetails(true), setDataDetails(record)
                    )}
                >
                    Xem chi tiết
                </a>
            ),
        },
    ];

    useEffect(() => {
        const data = async () => {
            setLoading(true);
            const res = await OrderHistoryAPI();
            if (res && Array.isArray(res.data)) {
                setCurrentData(res.data);
            }
            setLoading(false);
        };
        data();
    }, []);

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
            }}
        >
            <h2
                style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginBottom: "10px",
                }}
            >
                Lịch sử mua hàng
            </h2>
            <Divider style={{ margin: "10px 0" }} />
            <Table
                columns={columns}
                dataSource={currentData}
                rowKey="_id"
                loading={loading}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                }}
                pagination={{ pageSize: 5 }}
            />
            <Drawer
                title="Chi tiết đơn hàng"
                onClose={() => (setOpenDetails(false), setDataDetails(null))}
                open={openDetails}
                bodyStyle={{ backgroundColor: "#fafafa", padding: "16px" }}
            >
                {dataDetails?.detail?.map((item, index) => (
                    <ul
                        key={index}
                        style={{
                            backgroundColor: "#fff",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "10px",
                            listStyle: "none",
                            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <li style={{ marginBottom: "4px" }}>
                            <strong>Tên sách:</strong> {item.bookName}
                        </li>
                        <li>
                            <strong>Số lượng:</strong> {item.quantity}
                        </li>
                    </ul>
                ))}
            </Drawer>
        </div>
    );
};

export default History;
