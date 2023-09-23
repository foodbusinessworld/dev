import Refer from '../../../Assests/Refer.jpg';
import R1 from '../../../Assests/R1.png';
import R2 from '../../../Assests/R2.png';
import R3 from '../../../Assests/R3.png';
import WA from '../../../Assests/WA.png';
import R4 from '../../../Assests/R4.png';
import Card1 from '../../../Assests/Card1.png';
import Card2 from '../../../Assests/Card2.png';
import Card3 from '../../../Assests/Card3.png';
import Card4 from '../../../Assests/Card4.png';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../../App';
import { IStickyData, IStickyEntity } from '../../General/GeneralUtils';
import { GetAdminReferralsService } from '../../Admin/AdminServices';
import NoDataFound from '../../../Common/Components/NoDataFound';
import { IReferedMembersData, IReferedMembersModel, IWithdrawLimitData, IWithdrawLimitModel } from './ProfileUtils';

const Referral = () => {
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [Referrals, setReferrals] = useState<any>([]);
    const [AmountData, setAmountData] = useState<IReferedMembersModel>(IReferedMembersData);
    const [WithdrawLimit, setWithdrawLimit] = useState<IWithdrawLimitModel>(IWithdrawLimitData);

    const GetReferralsData = async () => {
        let GetAdminReferralsEntity = {
            ReferredBy: context.LoginUserID
        }
        const res: any = await GetAdminReferralsService(GetAdminReferralsEntity);
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            debugger
            if (resData) {
                setReferrals(resData.Table)
                setAmountData({...resData.Table1[0]})
                setWithdrawLimit({...resData.Table2[0]})
            }
            else {
                setReferrals([])
                setAmountData(IReferedMembersData)
                setWithdrawLimit({Amount :0})
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
        GetReferralsData()
    }, [])
    return (<>
        <div className="referrals">
            <div className="referrals-items">
                <div className="side1">
                    <img src={Refer} />
                </div>
                <div className="side2">
                    <div className='r-title-div'>
                        <p className='r-title'>Refer & Earn</p>
                        <a href={`https://wa.me/?text=DailyIncomePayment. Referal Code - ${context.ReferralCode} `}><button>Refer Now <img src={WA} /></button></a>
                    </div>
                    <h4>Refer your friend, you will Earn <span>₹{WithdrawLimit.Amount}</span></h4>
                    <div className='r-code-div'>
                        <p>Referral Code</p>
                        <p className='r-code'>{context.ReferralCode}</p>
                    </div>
                    <div className='refer-card'>
                        <div className='refer-card-item1'>
                            <div className='refer-card-item'>
                                <div className='refer-logo1'>
                                    <div className='refer-logo'>
                                        <img src={R1} />
                                    </div>
                                </div>
                            </div>
                            <p>Send a invitation</p>
                        </div>
                        <div className='refer-card-item1'>
                            <div className='refer-card-item'>
                                <div className='refer-logo1'>
                                    <div className='refer-logo'>
                                        <img src={R2} />
                                    </div>
                                </div>
                            </div>
                            <p>Register</p>
                        </div>
                        <div className='refer-card-item1'>
                            <div className='refer-card-item'>
                                <div className='refer-logo1'>
                                    <div className='refer-logo'>
                                        <img src={R3} />
                                    </div>
                                </div>
                            </div>
                            <p>Invest</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='referrals1'>
            {/* <h2>Hi {context.LoginUserName} !</h2> */}
            {
                Referrals.length ?
                    <>
                        <div className="container1 dashboard">
                            <div className="cards ref-cards">
                                <div className="card-item card1">
                                    <div className="card-info">
                                        <h2 className="card-title">Referral Persons</h2>
                                        <h1>{AmountData.ReferedMembers}</h1>
                                    </div>
                                    <div className="card-info-img">
                                        <div className="card-info-img1">
                                            <img src={R4} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="cards ref-cards">
                                <div className="card-item card3">
                                    <div className="card-info">
                                        <h2 className="card-title">Referral Amount</h2>
                                        <h1>₹ {AmountData.EarnedAmount}</h1>
                                    </div>
                                    <div className="card-info-img">
                                        <div className="card-info-img1">
                                            <img src={Card2} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="Orders">
                            <div className="cards">
                                <div className='table-head'>
                                    <p>User Name</p>
                                    {/* <p>Referred By</p> */}
                                    <p>No. of Referrals</p>
                                    <p>Created On</p>
                                    <p>First Order</p>
                                </div>
                                {
                                    Referrals.map((data: any) => <>
                                        <div className='table-body ptb-10'>
                                            <p><span><b>User Name &nbsp; : &nbsp;</b></span>{data.UserName}</p>
                                            {/* <p><span><b>Referred By &nbsp; : &nbsp;</b></span>{data.ReferredBy}</p> */}
                                            <p><span><b>No. of Referrals &nbsp; : &nbsp;</b></span> {data.NoOfReferrals}</p>
                                            <p><span><b>Created On &nbsp; : &nbsp;</b></span> {data.CreatedOn}</p>
                                            <p><span><b>First Order &nbsp; : &nbsp;</b></span> {data.FirstOrderOn}</p>
                                            <hr />
                                        </div>
                                    </>)
                                }
                            </div>
                        </div>
                    </>
                    :
                    <NoDataFound message={"No Referrels"} />
            }
        </div>
    </>)
}

export default Referral