import { Row, Col, Rate, InputNumber, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "styles/book.scss";
import ModalGallery from "./modal.gallery";
import { getBookByIdAPI } from "@/services/api";
import BookLoader from "./book.loader";
interface IProps {
    bookId?: string;
}
const BookDetails = ({ bookId }: IProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpenModalGallery, setIsOpenModalGallery] =
        useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const refGallery = useRef<ImageGallery>(null);
    const [bookData, setBookData] = useState<IBookTable | null>(null);
    const [bookImages, setBookImages] = useState<
        { original: string; thumbnail: string }[]
    >([]);
    useEffect(() => {
        if (bookId) {
            setIsLoading(true);
            const fetchBookById = async () => {
                const res = await getBookByIdAPI(bookId);
                if (res.data && res) {
                    setBookData(res.data);
                } else {
                    console.log("error");
                }
                setIsLoading(false);
            };
            fetchBookById();
        }
    }, [bookId]);

    useEffect(() => {
        if (bookData) {
            let images = [];
            if (bookData.thumbnail) {
                images.push({
                    original: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/images/book/${bookData.thumbnail}`,
                    thumbnail: `${
                        import.meta.env.VITE_BACKEND_URL
                    }/images/book/${bookData.thumbnail}`,
                });
            }
            if (bookData.slider) {
                bookData.slider.map((item) => {
                    images.push({
                        original: `${
                            import.meta.env.VITE_BACKEND_URL
                        }/images/book/${item}`,
                        thumbnail: `${
                            import.meta.env.VITE_BACKEND_URL
                        }/images/book/${item}`,
                    });
                });
            }
            setBookImages(images);
        }
    }, [bookData]);
    const handleOnclickImage = () => {
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery.current?.getCurrentIndex() ?? 0);
    };

    return (
        <div>
            {isLoading ? (
                <BookLoader />
            ) : (
                <div className="book-details-wrapper">
                    <Row className="book-details-card" gutter={[32, 32]}>
                        <Col xs={24} md={10} className="book-image-wrapper">
                            <div className="image-gallery">
                                <ImageGallery
                                    ref={refGallery}
                                    items={bookImages}
                                    showFullscreenButton={false}
                                    showNav={false}
                                    showPlayButton={false}
                                    additionalClass="custom-image-gallery"
                                    onClick={handleOnclickImage}
                                />
                            </div>
                        </Col>

                        <Col xs={24} md={13} className="book-details-col">
                            <p className="book-author">
                                Tác giả: <a>{bookData?.author}</a>
                            </p>

                            <h2 className="book-title">{bookData?.mainText}</h2>

                            <div className="book-rating">
                                <Rate value={5} disabled />
                                <span>Đã bán {bookData?.sold}</span>
                            </div>

                            <p className="book-price">
                                {bookData?.price
                                    ? new Intl.NumberFormat("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                      }).format(Number(bookData.price))
                                    : "N/A"}
                            </p>

                            <div className="book-info-row">
                                <span className="label">Vận chuyển:</span>
                                <span>Miễn phí vận chuyển</span>
                            </div>

                            <div className="book-info-row">
                                <span className="label">Số lượng:</span>
                                <InputNumber
                                    min={1}
                                    max={99}
                                    defaultValue={1}
                                    style={{ width: 120, height: 40 }}
                                />
                            </div>

                            <div className="book-action-buttons">
                                <Button className="add-to-cart">
                                    Thêm Vào Giỏ Hàng
                                </Button>
                                <Button className="buy-now">Mua Ngay</Button>
                            </div>
                        </Col>
                    </Row>

                    <ModalGallery
                        isOpenModalGallery={isOpenModalGallery}
                        setIsOpenModalGallery={setIsOpenModalGallery}
                        currentIndex={currentIndex}
                        items={bookImages}
                        title={`${bookData?.mainText}`}
                    />
                </div>
            )}
        </div>
    );
};

export default BookDetails;
