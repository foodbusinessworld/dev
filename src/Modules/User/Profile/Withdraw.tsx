import { useContext, useEffect, useRef, useState } from 'react';
import { IStickyData, IStickyEntity } from '../../General/GeneralUtils';
import { ToastMessage } from '../../../Common/Components/ToastMessage';
import { Context } from '../../../App';
import Card1 from '../../../Assests/Card1.png';
import Card2 from '../../../Assests/Card2.png';
import Card3 from '../../../Assests/Card3.png';
import Card4 from '../../../Assests/Card4.png';
import R4 from '../../../Assests/R4.png';
import { GetDashboardDataService } from './../HomePage/HomeServices';
import { IDashboardEntity, IDashboardData } from './../HomePage/HomeUtils';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import { GetWithdrawAmountHistoryService, RequestWithdrawAmountService } from './ProfileServices';
import { IWithdrawHistory } from './ProfileUtils';
import NoDataFound from '../../../Common/Components/NoDataFound';

const Withdraw = () => {
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [dashboard, setDashboard] = useState<IDashboardEntity>(IDashboardData);
    const [WithdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [WithdrawAmountLimit, setWithdrawAmountLimit] = useState<number>(0);
    const [WithdrawHistory, setWithdrawHistory] = useState<IWithdrawHistory[]>([]);
    const refWithdraw:any = useRef(null);
    
    const setWithdrawAmountFun = () => {
        refWithdraw.current.value = null;
    }

    const WithdrawAmountFun = async () => {
        debugger
        const amount = Number(refWithdraw.current.value)
        let WithdrawAmountEntity = {
            UserID: context.LoginUserID,
            Amount: amount
        }
        if(amount < 1 || isNaN(amount)) {
            setIStickyEntity(prevState => ({
                ...prevState,
                Type: 0,
                Message: 'Please enter valid amount',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }
        else if(dashboard.Withdrawable < WithdrawAmountLimit) {
            setIStickyEntity(prevState => ({
                ...prevState,
                Type: 0,
                Message: 'You do not limit to withdraw amount',
                Time: 3000,
                ShowToast: true
            }));
            refWithdraw.current.value =  null;
            return false;
        }        
        else if(amount > dashboard.Withdrawable) {
            setIStickyEntity(prevState => ({
                ...prevState,
                Type: 0,
                Message: 'Can not withdraw more than withdrawable amount',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }        
        else if(amount > ( dashboard.Withdrawable - WithdrawAmountLimit) ) {
            setIStickyEntity(prevState => ({
                ...prevState,
                Type: 0,
                Message: 'Minimum 200 need to maintain withdrawable amount',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }
        const res: any = await RequestWithdrawAmountService(WithdrawAmountEntity)
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData.length) {
                var Type = resData[0].Type;
                var Message = resData[0].Message;
                setIStickyEntity(prevState => ({
                    ...prevState,
                    Type: Type,
                    Message: Message,
                    Time: 3000,
                    ShowToast: true
                }));
                if (Type === 1) {
                    setWithdrawAmountFun();
                    setTimeout(() => {
                        GetDashboardData();
                        GetWithdrawAmountHistory();
                    },2000)
                }
            }
            else {
                setIStickyEntity(prevState => ({
                    ...prevState,
                    Type: 0,
                    Message: 'Error while sending withdraw request',
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

    const GetDashboardData = async () => {
        setIStickyEntity(prevState => ({
            ...prevState,
            ShowToast: false
        }));
        let GetDashboardDataEntity = {
            UserID: context.LoginUserID
        }
        const res: any = await GetDashboardDataService(GetDashboardDataEntity);
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
                setWithdrawAmountLimit(resData.Table1[0].Amount)
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
        <div className="container1 dashboard w-dashboard">
            <div className="cards">
                <div className="card-item card2">
                    <div className="card-info">
                        <h2 className="card-title">Investment Amount</h2>
                        <h1>₹ {dashboard.Invenstment}</h1>
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
                        <h2 className="card-title">Profit Amount</h2>
                        <h1>₹ {dashboard.Profit}</h1>
                    </div>
                    <div className="card-info-img">
                        <div className="card-info-img1">
                            <img src={Card3} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="cards">
                <div className="card-item card1">
                    <div className="card-info">
                        <h2 className="card-title">Referral Amount</h2>
                        <h1>₹ {dashboard.ReferralAmount}</h1>
                    </div>
                    <div className="card-info-img">
                        <div className="card-info-img1">
                            <img src={R4} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="cards">
                <div className="card-item card4">
                    <div className="card-info">
                        <h2 className="card-title">Withdraw Amount</h2>
                        <h1>₹ {dashboard.Withdraw}</h1>
                    </div>
                    <div className="card-info-img">
                        <div className="card-info-img1">
                            <img src={Card4} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="cards">
                <div className="card-item card5">
                    <div className="card-info">
                        <h2 className="card-title">Withdrawable&nbsp;
                            <Tooltip title={`Min ₹${WithdrawAmountLimit}`}>
                                <InfoCircleOutlined />
                            </Tooltip>
                        </h2>
                        <h1>₹ {dashboard.Withdrawable}</h1>
                    </div>
                    <div className="card-info-img">
                        <div className="card-info-img1">
                            <img src={Card1} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='m-withdraw'>
            <h1>Request for withdraw</h1>
            <div className='m-withdraw1'>
                <div className="inputContainer">
                    <div className="input-field">
                        <input type="number" name="username"
                            ref ={refWithdraw}
                            required spellCheck="false" />
                        <label>Enter Amount</label>
                    </div>
                </div>
                <button className="W-Button" onClick={() => WithdrawAmountFun()}>Withdraw</button>
            </div>
        </div>
        {
            WithdrawHistory.length ?
                <div className="Orders">
                    <div className="cards">
                        <h1>Withdraw Hishory</h1>
                        <div className='table-head'>
                            <p>Requested Date</p>
                            <p>Accepted Date</p>
                            <p>Withdraw Amount</p>
                            {/* <p>Credited To</p> */}
                            <p>Status</p>
                        </div>
                        {
                            WithdrawHistory.map((data: IWithdrawHistory) => <>
                                <div className='table-body ptb-10'>
                                    <p><span><b>Requested Date &nbsp; : &nbsp;</b></span>{data.RequestedDate}</p>
                                    <p><span><b>Accepted Date &nbsp; : &nbsp;</b></span>{data.AcceptedDate}</p>
                                    <p><span><b>Withdraw Amount &nbsp; : &nbsp;</b></span>₹ {data.Amount}</p>
                                    {/* <p><span><b>Credited To &nbsp; : &nbsp;</b></span>{data.CreditedTo}</p> */}
                                    <p><span><b>Status &nbsp; : &nbsp;</b></span>
                                        <Tag color = {
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

export default Withdraw
