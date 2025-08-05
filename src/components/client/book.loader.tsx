import { Col, Row, Skeleton } from "antd";

const BookLoader = () => {
    return (
        <div className="book-loader-wrapper">
            <div className="book-details-card">
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={10} className="book-loader-left">
                        <Skeleton.Image style={{ width: 300, height: 400 }} />
                        <div className="thumbnail-skeletons">
                            <Skeleton.Image style={{ width: 70, height: 90 }} />
                            <Skeleton.Image style={{ width: 70, height: 90 }} />
                            <Skeleton.Image style={{ width: 70, height: 90 }} />
                        </div>
                    </Col>
                    <Col xs={24} md={13} className="book-loader-right">
                        <Skeleton.Input
                            active
                            size="default"
                            style={{ width: 200 }}
                        />
                        <Skeleton.Input
                            active
                            size="large"
                            style={{ width: "80%", marginTop: 16 }}
                        />
                        <Skeleton.Input
                            active
                            size="large"
                            style={{ width: "60%", marginTop: 16 }}
                        />
                        <Skeleton
                            active
                            paragraph={{ rows: 3 }}
                            style={{ marginTop: 24 }}
                        />
                        <div className="button-skeletons">
                            <Skeleton.Button
                                active
                                style={{ width: 220, height: 48 }}
                            />
                            <Skeleton.Button
                                active
                                style={{ width: 180, height: 48 }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BookLoader;
