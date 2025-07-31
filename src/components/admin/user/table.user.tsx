import { getUsersAPI, deleteUserAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helpers";
import {
    PlusOutlined,
    EditTwoTone,
    DeleteTwoTone,
    CloudDownloadOutlined,
    ExportOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm, App } from "antd";

import DetailsUser from "./details.user";
import CreateUser from "./create.user";
import ImportUser from "./import.user";

import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import UpdateUser from "./update.user";
interface ISearch {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const { message } = App.useApp();
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const [openViewDetails, setOpenViewDetails] = useState<boolean>(false);
    const [dataViewDetails, setDataViewDetails] = useState<IUserTable | null>(
        null
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [tableData, setTableData] = useState<IUserTable[]>([]);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [idDelete, setIdDelete] = useState<string | null>(null);

    const refreshTable = () => {
        actionRef.current?.reload();
    };
    const handleDelete = async () => {
        setIsDelete(true);
        const res = await deleteUserAPI(idDelete!);
        if (res.data) {
            message.success("Deleted successfully");
            refreshTable();
        }
        setIdDelete(null);
        setIsDelete(false);
    };

    const columns: ProColumns<IUserTable>[] = [
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
            title: "Full Name",
            dataIndex: "fullName",
            sorter: true,
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            valueType: "date",
            hideInSearch: true,
            sorter: true,
        },
        {
            title: "Created At",
            dataIndex: "createdAtRange",
            valueType: "dateRange",
            hideInTable: true,
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
                        setDataUpdate(record);
                        setIsUpdateModalOpen(true);
                    }}
                >
                    <EditTwoTone />
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setIdDelete(record._id);
                    }}
                    style={{ marginLeft: 15 }}
                >
                    <Popconfirm
                        title="Delete user"
                        description="Are you sure to delete this user?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ loading: isDelete }}
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
                <ProTable<IUserTable, ISearch>
                    columns={columns}
                    actionRef={actionRef}
                    cardBordered
                    request={async (params, sort, filter) => {
                        let query = "";
                        if (params) {
                            query += `current=${params.current}&pageSize=${params.pageSize}`;
                            if (params.email) {
                                query += `&email=/${params.email}/i`;
                            }
                            if (params.fullName) {
                                query += `&fullName=/${params.fullName}/i`;
                            }
                            const createDateRange = dateRangeValidate(
                                params.createdAtRange
                            );
                            if (createDateRange) {
                                query += `&createdAt>=${createDateRange[0]}&createdAt<=${params.createdAt}`;
                            }
                        }

                        if (sort && sort.createdAt) {
                            query += `&sort=${
                                sort.createdAt === "ascend"
                                    ? "createdAt"
                                    : "-createdAt"
                            }`;
                        } else {
                            query += `&sort=-createdAt`;
                        }

                        const res = await getUsersAPI(query);
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
                        <CSVLink data={tableData} filename="export-user.csv">
                            <Button
                                key="button"
                                icon={<ExportOutlined />}
                                onClick={() => {}}
                                type="primary"
                            >
                                Export
                            </Button>
                        </CSVLink>,
                        <Button
                            key="button"
                            icon={<CloudDownloadOutlined />}
                            onClick={() => {
                                setIsImportModalOpen(true);
                            }}
                            type="primary"
                        >
                            Import
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
            <DetailsUser
                openViewDetails={openViewDetails}
                setOpenViewDetails={setOpenViewDetails}
                dataViewDetails={dataViewDetails}
                setDataViewDetails={setDataViewDetails}
            />
            <CreateUser
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                refreshTable={refreshTable}
            />
            <ImportUser
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
            />
        </>
    );
};

export default TableUser;
