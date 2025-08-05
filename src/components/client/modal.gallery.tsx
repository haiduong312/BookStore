import { Modal, Row, Col, Image } from "antd";
import { useState, useRef, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import "styles/book.scss";

interface IProps {
    isOpenModalGallery: boolean;
    setIsOpenModalGallery: (v: boolean) => void;
    currentIndex: number;
    items: {
        original: string;
        thumbnail: string;
    }[];
    title: string;
}

const ModalGallery = ({
    isOpenModalGallery,
    setIsOpenModalGallery,
    currentIndex,
    items,
    title,
}: IProps) => {
    const [indexActive, setIndexActive] = useState<number>(0);
    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (isOpenModalGallery) {
            setIndexActive(currentIndex);
        }
    }, [isOpenModalGallery, currentIndex]);

    return (
        <Modal
            open={isOpenModalGallery}
            onCancel={() => setIsOpenModalGallery(false)}
            width="80vw"
            footer={null}
            closable={false}
            className="custom-modal-gallery"
        >
            <div className="modal-gallery-container">
                <Row gutter={[24, 24]}>
                    <Col span={16}>
                        <div className="modal-main-image">
                            <ImageGallery
                                ref={refGallery}
                                items={items}
                                showFullscreenButton={false}
                                showNav={false}
                                showPlayButton={false}
                                startIndex={currentIndex}
                                showThumbnails={false}
                                onSlide={(i) => setIndexActive(i)}
                                slideDuration={0}
                            />
                        </div>
                    </Col>

                    <Col span={8}>
                        <div className="right-panel">
                            <div className="title">{title}</div>
                            <div className="thumbnails">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`thumb-box ${
                                            index === indexActive
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            refGallery.current?.slideToIndex(
                                                index
                                            )
                                        }
                                    >
                                        <Image
                                            width={80}
                                            height={80}
                                            src={item.original}
                                            preview={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

export default ModalGallery;
