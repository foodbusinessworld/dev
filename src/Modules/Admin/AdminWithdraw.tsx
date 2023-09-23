import { useContext, useEffect, useState } from 'react';
import { IStickyData, IStickyEntity } from '../General/GeneralUtils';
import { ToastMessage } from '../../Common/Components/ToastMessage';
import { Context } from '../../App';
import Card1 from '../../Assests/Card1.png';
import Card2 from '../../Assests/Card2.png';
import Card3 from '../../Assests/Card3.png';
import Card4 from '../../Assests/Card4.png';
import R4 from '../../Assests/R4.png';
import { IDashboardEntity, IDashboardData } from '../User/HomePage/HomeUtils';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import { IWithdrawHistory } from './../User/Profile/ProfileUtils';
import NoDataFound from '../../Common/Components/NoDataFound';
import { GetWithdrawAmountHistoryService } from '../User/Profile/ProfileServices';
import { GetDashboardDataService, UpsertWithdrawPaymentStatusService } from './AdminServices';
import DeleteConfirmationComponent from '../../Common/Components/DeleteConfirmation';
import { IPaymentStatus, IPaymentStatusData } from './AdminUtils';
import PaymentConfirmation from '../../Common/Components/PaymentConfirmation';

const AdminWithdraw = () => {
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [dashboard, setDashboard] = useState<IDashboardEntity>(IDashboardData);
    const [WithdrawHistory, setWithdrawHistory] = useState<IWithdrawHistory[]>([]);
    const [paymentStatus, setpaymentStatus] = useState<IPaymentStatus>(IPaymentStatusData);

    const ShowPaymentStatusModel = (CartID: number) => {
        setpaymentStatus({ 
            ...paymentStatus, 
            ConfirmationShow: true, 
            paymentStatusMessage:"Are you sure you want to send the money ?",
            WID : CartID 
        })
    }
    const paymentStatusInfo = async (deleteconfirmation: boolean) => {
        setpaymentStatus({ ...paymentStatus, ConfirmationShow: false })
        if (deleteconfirmation) {
            let RemoveCartItemsEntity = {
                WID: paymentStatus.WID,
                Status: 2
            }
            const res: any = await UpsertWithdrawPaymentStatusService(RemoveCartItemsEntity);
            if (res.status === 200) {
                setTimeout(() => {
                    GetDashboardData();
                    GetWithdrawAmountHistory();
                },500)                
            }
            else if (res.message !== "") {
                setIStickyEntity(prevState => ({
                    ...prevState,
                    ID: 0,
                    Type: 0, // Error
                    Message: res.message,
                    Time: 3000,
                    ShowToast: true
                }));
            }
        }
    }
    const GetDashboardData = async () => {
        debugger
        let GetDashboardDataEntity = {}
        const res: any = await GetDashboardDataService(GetDashboardDataEntity);
        debugger
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData.length) {
                setDashboard({ ...resData[0] })
            }
            else {
                setIStickyEntity(prevState => ({
                    ...prevState,
                    Type: 0,
                    Message: 'Error while login',
                    Time: 3000,
                    ShowToast: true
                }));
            }
        }
        else if (res.message !== "") {
            setIStickyEntity(prevState => ({
                ...prevState,
                ID: 0,
                Type: 0, // Error
                Message: res.message,
                Time: 3000,
                ShowToast: true
            }));
        }
    }
    const GetWithdrawAmountHistory = async () => {
        debugger
        setIStickyEntity(prevState => ({
            ...prevState,
            ShowToast: false
        }));
        let GetWithdrawAmountHistoryEntity = {
            UserID: context.LoginUserID,
            Status: 0
        }
        const res: any = await GetWithdrawAmountHistoryService(GetWithdrawAmountHistoryEntity);
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData) {
                setWithdrawHistory(resData.Table)
            }
            else {
                setIStickyEntity(prevState => ({
                    ...prevState,
                    Type: 0,
                    Message: 'Error while login',
                    Time: 3000,
                    ShowToast: true
                }));
            }
        }
        else if (res.message !== "") {
            setIStickyEntity(prevState => ({
                ...prevState,
                ID: 0,
                Type: 0, // Error
                Message: res.message,
                Time: 3000,
                ShowToast: true
            }));
        }
    }
    useEffect(() => {
        GetDashboardData();
        GetWithdrawAmountHistory();
    }, [])
    return (<>
        {
            IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
        }
        {
            paymentStatus.ConfirmationShow ?
                <PaymentConfirmation
                    display={paymentStatus.ConfirmationShow}
                    DeleteMessageTitle={paymentStatus.paymentStatusTitle}
                    DeleteMessage={paymentStatus.paymentStatusMessage}
                    sendData={paymentStatusInfo}
                />
                :
                <></>
        }
        <div className="container1 dashboard a-w-dashboard">
            <div className="cards">
                <div className="card-item card2">
                    <div className="card-info">
                        <h2 className="card-title">Pending</h2>
                        <h1>₹ {dashboard.Pending}</h1>
                    </div>
                    <div className="card-info-img">
                        <div className="card-info-img1">
                            <img src={Card2} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="cards">
                <div className="card-item card3">
                    <div className="card-info">
                        <h2 className="card-title">Success</h2>
                        <h1>₹ {dashboard.Success}</h1>
                    </div>
                    <div className="card-info-img">
                        <div className="card-info-img1">
                            <img src={Card3} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="cards">
                <div className="card-item card4">
                    <div className="card-info">
                        <h2 className="card-title">Reject</h2>
                        <h1>₹ {dashboard.Rejected}</h1>
                    </div>
                    <div className="card-info-img">
                        <div className="card-info-img1">
                            <img src={Card4} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {
            WithdrawHistory.length ?
                <div className="Orders">
                    <div className="cards">
                        <h1>Withdraw Hishory</h1>
                        <div className='table-head'>
                            <p>User Name</p>
                            <p>Requested Date</p>
                            <p>Withdraw Amount</p>
                            <p>Accepted Date</p>
                            {/* <p>Credited To</p> */}
                            <p>Status</p>
                        </div>
                        {
                            WithdrawHistory.map((data: IWithdrawHistory) => <>
                                <div className='table-body ptb-10'>
                                    <p><span><b>User Name &nbsp; : &nbsp;</b></span>{data.UserName}</p>
                                    <p><span><b>Requested Date &nbsp; : &nbsp;</b></span>{data.RequestedDate}</p>
                                    <p><span><b>Withdraw Amount &nbsp; : &nbsp;</b></span>₹ {data.Amount}</p>
                                    <p><span><b>Accepted Date &nbsp; : &nbsp;</b></span>{data.AcceptedDate}</p>
                                    {/* <p><span><b>Credited To &nbsp; : &nbsp;</b></span>{data.CreditedTo}</p> */}
                                    <p><span><b>Status &nbsp; : &nbsp;</b></span>
                                        <Tag
                                            onClick={() => ShowPaymentStatusModel(data.WID)} 
                                            color={
                                            data.StatusID === 1 ? '#f28e4b' :
                                                data.StatusID === 2 ? '#2bbb8d' : '#f85772'
                                        }>{data.Status}</Tag>
                                    </p>
                                    <hr />
                                </div>
                            </>)
                        }
                    </div>
                </div>

                :
                <NoDataFound message={"No Withdraw History"} />
        }
    </>)
}

export default AdminWithdraw
