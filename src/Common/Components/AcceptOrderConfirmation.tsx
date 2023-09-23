import { Row, Col, Modal } from 'antd';
import { Component } from 'react';
import {  ExclamationCircleFilled  } from '@ant-design/icons';

interface IState {
    display: boolean;
    DeleteMessageTitle: string;
    DeleteMessage: string;
    TransactionID:string;
    PaymentStatusID:number
}
interface IProps {
    display: boolean;
    DeleteMessageTitle: string;
    DeleteMessage: string;
    TransactionID:string;
    PaymentStatusID: number
    sendData: (value: boolean) => void;
}

class AcceptOrderConfirmation extends Component<any, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            display: this.props.display,
            DeleteMessageTitle: this.props.DeleteMessageTitle,
            DeleteMessage: this.props.DeleteMessage,
            TransactionID:this.props.TransactionID,
            PaymentStatusID:this.props.PaymentStatusID
        }
    }
    handleCancel = () => {
        this.setState({ display: false });
        this.props.sendData(false);
    }
    handleDelete = () => {
        this.setState({ display: false });
        this.props.sendData(true);
    }

    render() {
        return (
            <>
                {
                    this.state.display ?
                        <>
                            <Modal
                                visible={this.state.display}
                                className="Confirmation"
                                onCancel={() => this.handleCancel()}
                                footer={[]}
                            >
                                <Row gutter={16}>
                                    <Col className="gutter-row" span={24}>
                                        <div className="ConfirmationTitle">
                                            {
                                                this.state.PaymentStatusID == 1 ? 
                                                <><ExclamationCircleFilled/>&nbsp;&nbsp;&nbsp;
                                                    <span>
                                                        {this.state.DeleteMessage}
                                                        <br/>(TransactionID - {this.state.TransactionID})
                                                    </span>
                                                </> 
                                                :
                                                this.state.PaymentStatusID == 2 ? 
                                                    <span>
                                                            Order payment accepted.
                                                        <br/>(TransactionID - {this.state.TransactionID})
                                                    </span>:
                                                    <span>Payment Rejected</span>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                                {
                                    this.state.PaymentStatusID == 1 ? 
                                        <Row gutter={16} className="ConfirmationBtnDiv mt-12">
                                            <div key="No" className='ConfirmationNoBtn' onClick={() => this.handleCancel()}>
                                                No
                                            </div>
                                            <div key="Yes" className='ConfirmationYesBtn_payment' onClick={() => this.handleDelete()}>
                                                Accept
                                            </div>
                                        </Row>
                                    :
                                    <Row gutter={16} className="ConfirmationBtnDiv mt-12">
                                        <div key="No" className='ConfirmationNoBtn' onClick={() => this.handleCancel()}>
                                            Close
                                        </div>                                    
                                    </Row>
                                }
                                
                            </Modal>

                        </>
                        :
                        null
                }
            </>
        )
    }
}
export default AcceptOrderConfirmation