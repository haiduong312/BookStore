import { getBooksAPI } from "@/services/api";
import {
    PlusOutlined,
    EditTwoTone,
    DeleteTwoTone,
    ExportOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm, App } from "antd";

import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import DetailsBook from "./details.book";
import CreateBook from "./create.book";

interface ISearch {
    mainText: string;
    author: string;
}

const TableBook = () => {
    const { message } = App.useApp();
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const [openViewDetails, setOpenViewDetails] = useState<boolean>(false);
    const [dataViewDetails, setDataViewDetails] = useState<IBookTable | null>(
        null
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [tableData, setTableData] = useState<IBookTable[]>([]);
    // const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
    // const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    // const [isDelete, setIsDelete] = useState<boolean>(false);
    // const [idDelete, setIdDelete] = useState<string | null>(null);

    const refreshTable = () => {
        actionRef.current?.reload();
    };
    const handleDelete = async () => {
        // setIsDelete(true);
        // const res = await deleteUserAPI(idDelete!);
        // if (res.data) {
        //     message.success("Deleted successfully");
        //     refreshTable();
        // }
        // setIdDelete(null);
        // setIsDelete(false);
    };

    const columns: ProColumns<IBookTable>[] = [
        {
            dataIndex: "index",
            valueType: "indexBorder",
            width: 48,
        },
        {
            title: "id",
            dataIndex: "_id",
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={() => (
                            setOpenViewDetails(true), setDataViewDetails(entity)
                        )}
                        href="#"
                    >
                        {entity._id}
                    </a>
                );
            },
        },
        {
            title: "Book Name",
            dataIndex: "mainText",
        },
        {
            title: "Category",
            dataIndex: "category",
            hideInSearch: true,
        },
        {
            title: "Author",
            dataIndex: "author",
        },
        {
            title: "Price",
            dataIndex: "price",
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                const formatted = new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(entity.price);
                return <>{formatted}</>;
            },
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            valueType: "date",
            hideInSearch: true,
            sorter: true,
        },
        {
            title: "Action",
            valueType: "option",
            hideInSearch: true,
            key: "option",
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        // setDataUpdate(record);
                        // setIsUpdateModalOpen(true);
                    }}
                >
                    <EditTwoTone />
                </a>,
                <a
                    key="delete"
                    // onClick={() => {
                    //     setIdDelete(record._id);
                    // }}
                    style={{ marginLeft: 15 }}
                >
                    <Popconfirm
                        title="Delete user"
                        description="Are you sure to delete this user?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                        // okButtonProps={{ loading: isDelete }}
                    >
                        <DeleteTwoTone />
                    </Popconfirm>
                </a>,
            ],
        },
    ];
    return (
        <>
            <>
                <ProTable<IBookTable, ISearch>
                    columns={columns}
                    actionRef={actionRef}
                    cardBordered
                    request={async (params, sort, filter) => {
                        let query = "";
                        if (params) {
                            query += `current=${params.current}&pageSize=${params.pageSize}`;
                            if (params.mainText) {
                                query += `&mainText=/${params.mainText}/i`;
                            }
                            if (params.author) {
                                query += `&author=/${params.author}/i`;
                            }
                        }

                        let sortArr: string[] = [];

                        if (sort?.createdAt) {
                            sortArr.push(
                                sort.createdAt === "ascend"
                                    ? "createdAt"
                                    : "-createdAt"
                            );
                        }
                        if (sort?.price) {
                            sortArr.push(
                                sort.price === "ascend" ? "price" : "-price"
                            );
                        }

                        if (sortArr.length === 0) {
                            sortArr.push("-createdAt"); // mặc định
                        }

                        query += `&sort=${sortArr.join(",")}`;

                        const res = await getBooksAPI(query);
                        if (res.data) {
                            setMeta(res.data.meta);
                            setTableData(res.data?.result ?? []);
                        }

                        return {
                            // data: data.data,
                            data: res.data?.result,
                            page: 1,
                            success: true,
                            total: res.data?.meta.total,
                        };
                    }}
                    rowKey="_id"
                    pagination={{
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => {
                            return (
                                <div>
                                    {range[0]} - {range[1]} trên {total}
                                </div>
                            );
                        },
                    }}
                    headerTitle="Table user"
                    toolBarRender={() => [
                        <Button
                            key="button"
                            icon={<ExportOutlined />}
                            onClick={() => {}}
                            type="primary"
                        >
                            <CSVLink
                                data={tableData}
                                filename="export-data.csv"
                            >
                                Export
                            </CSVLink>
                        </Button>,
                        <Button
                            key="button"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setIsCreateModalOpen(true);
                            }}
                            type="primary"
                        >
                            Add new
                        </Button>,
                    ]}
                />
            </>
            <DetailsBook
                openViewDetails={openViewDetails}
                setOpenViewDetails={setOpenViewDetails}
                dataViewDetails={dataViewDetails}
                setDataViewDetails={setDataViewDetails}
            />
            <CreateBook
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                refreshTable={refreshTable}
            />
            {/* <ImportUser
                isImportModalOpen={isImportModalOpen}
                setIsImportModalOpen={setIsImportModalOpen}
                refreshTable={refreshTable}
            />
            <UpdateUser
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                refreshTable={refreshTable}
            />  */}
        </>
    );
};

export default TableBook;
