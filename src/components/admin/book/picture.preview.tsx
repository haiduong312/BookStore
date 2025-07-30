import { useState, useEffect } from "react";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { v4 as uuidv4 } from "uuid";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
interface IProps {
    dataViewDetails: IBookTable | null;
    setDataViewDetails: (v: IBookTable | null) => void;
}

const PicturePreview = ({ dataViewDetails, setDataViewDetails }: IProps) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        let imgThumbnails: any = {},
            imgSlider: UploadFile[] = [];
        if (dataViewDetails?.thumbnail) {
            imgThumbnails = {
                uid: uuidv4(),
                name: dataViewDetails.thumbnail,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    dataViewDetails.thumbnail
                }`,
            };
        }
        if (dataViewDetails?.slider && dataViewDetails.slider.length > 0) {
            dataViewDetails.slider.map((item) =>
                imgSlider.push({
                    uid: uuidv4(),
                    name: dataViewDetails.thumbnail,
                    status: "done",
                    url: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/images/book/${item}`,
                })
            );
        }
        setFileList([imgThumbnails, ...imgSlider]);
    }, [dataViewDetails]);
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={{ showRemoveIcon: false }}
            ></Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                            !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};

export default PicturePreview;
