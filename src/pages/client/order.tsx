import OrderDetails from "@/components/client/order.details";
import Payment from "@/components/client/payment";
import Transaction from "@/components/client/transaction";
import { Steps, Button } from "antd";
import { useState } from "react";

const OrderPage = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);

    return (
        <div
            style={{
                padding: "24px",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    margin: "0 auto",
                    backgroundColor: "#fff",
                    padding: "24px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
            >
                <Steps
                    size="small"
                    current={currentStep}
                    items={[
                        {
                            title: "Đơn hàng",
                        },
                        {
                            title: "Đặt hàng",
                        },
                        {
                            title: "Thanh toán",
                        },
                    ]}
                    style={{ marginBottom: 24 }}
                />

                {currentStep === 0 && (
                    <OrderDetails setCurrentStep={setCurrentStep} />
                )}

                {currentStep === 1 && (
                    <Payment setCurrentStep={setCurrentStep} />
                )}
                {currentStep === 2 && <Transaction />}

                {currentStep === 1 && (
                    <Button
                        style={{
                            marginTop: 10,
                        }}
                        onClick={() => {
                            setCurrentStep(0);
                        }}
                    >
                        <b>Previous</b>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OrderPage;
