import { bulkListUserAPI } from "@/services/api";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload, Modal, Table, App } from "antd";
import { Buffer } from "buffer";
import Exceljs from "exceljs";

import templateFile from "assets/template/[React Test Fresher TS] - Data Users.xlsx?url";

import { useState } from "react";

const { Dragger } = Upload;
interface IProps {
    setIsImportModalOpen: (v: boolean) => void;
    isImportModalOpen: boolean;
    refreshTable: () => void;
}

interface IDataImport {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
}

const ImportUser = ({
    setIsImportModalOpen,
    isImportModalOpen,
    refreshTable,
}: IProps) => {
    const { message, notification } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const onCancel = () => {
        setIsImportModalOpen(false);
        setDataImport([]);
    };

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map((items) => ({
            fullName: items.fullName,
            phone: items.phone,
            email: items.email,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD,
        }));
        const res = await bulkListUserAPI(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Success",
                description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`,
            });
        }
        setIsSubmit(false);
        setIsImportModalOpen(false);
        setDataImport([]);
        refreshTable();
    };

    const props: UploadProps = {
        name: "file",
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 0);
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (status === "done") {
                message.success(
                    `${info.file.name} file uploaded successfully.`
                );
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file to buffer
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    //convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        });
                        jsonData = jsonData.map((items, index) => {
                            return { ...items, id: index + 1 };
                        });
                    });
                    setDataImport(jsonData);
                }
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files);
        },
    };

    const columns = [
        {
            title: "Full Name",
            dataIndex: "fullName",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
    ];

    return (
        <Modal
            title="Import user"
            closable={{ "aria-label": "Custom Close Button" }}
            open={isImportModalOpen}
            onOk={handleImport}
            onCancel={onCancel}
            okText="Import data"
            okButtonProps={{
                disabled: dataImport.length > 0 ? false : true,
                loading: isSubmit,
            }}
            destroyOnClose={true}
        >
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Only accept .csv,
                    .xlsx, .xls.{" "}
                    <a
                        href={templateFile}
                        download
                        onClick={(e) => e.stopPropagation()}
                    >
                        Download sample file
                    </a>
                </p>
            </Dragger>
            <p style={{ marginTop: 20, marginBottom: 10 }}>Dữ liệu upload:</p>
            <Table columns={columns} dataSource={dataImport} rowKey={"id"} />
        </Modal>
    );
};
export default ImportUser;
