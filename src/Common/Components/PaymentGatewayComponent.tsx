import { Row, Col, Modal, Divider } from 'antd';
import { Component } from 'react';
import QRCode from './../../Assests/QRCode1.jpg'

interface IState {
    display: boolean;
}
interface IProps {
    display: boolean;
    sendData: (value: boolean, transactionID : string) => void;
}

class PaymentGatewayComponent extends Component<any, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            display: this.props.display
        }
    }
    handleCancel = () => {
        this.setState({ display: false });
        this.props.sendData(false,'');
    }
    showInputDiv = () => {
        // this.setState({ btnDisplay: false });
        let ID = prompt('Please Enter Phonepay transaction ID');
        if(ID !== null) {
            this.props.sendData(true, ID);
        }

    }
    handleDelete = () => {
        this.setState({ display: false });
        this.props.sendData(true, '');
    }

    render() {
        const { display } = this.state;
        return (
            <>

                {
                    display ?
                        <>
                            <Modal
                                visible={display}
                                style={{ top: 20 }}
                                className="Confirmation payment"
                                onCancel={() => this.handleCancel()}
                                footer={[]}
                            >
                                <Row gutter={16}>
                                    <Col className="gutter-row" span={24}>
                                        <p>QR Code</p>
                                        <img src={QRCode} alt="" />
                                    </Col>
                                </Row>
                                <Divider plain>OR</Divider>
                                <Row gutter={16}>
                                    <Col className="gutter-row" span={24}>
                                        <p>Phone pay UPI : restjgc@ybl.com</p>
                                    </Col>
                                </Row>
                                <Row gutter={16} className="ConfirmationBtnDiv mt-12">
                                    <div key="No" className='ConfirmationNoBtn' onClick={() => this.handleCancel()}>
                                        Don't want to pay
                                    </div>
                                    <div key="Yes" className='ConfirmationYesBtn_payment' onClick={() => this.showInputDiv()}>
                                        Paid
                                    </div>
                                </Row>
                            </Modal>
                        </>
                        :
                    null
                }
            </>
        )
    }
}
export default PaymentGatewayComponent