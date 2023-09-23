import { useContext, useEffect, useState } from 'react';
import { IStickyData, IStickyEntity } from '../../General/GeneralUtils';
import { ToastMessage } from '../../../Common/Components/ToastMessage';
import { Context } from '../../../App';
import Card1 from '../../../Assests/Card1.png';
import Card2 from '../../../Assests/Card2.png';
import Card3 from '../../../Assests/Card3.png';
import Card4 from '../../../Assests/Card4.png';
import { GetDashboardDataService } from './HomeServices';
import { IDashboardEntity, IDashboardData } from './HomeUtils';

const HomePageCards = () => {
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [dashboard, setDashboard] = useState<IDashboardEntity>(IDashboardData);
    
    const GetDashboardData = async() => {
        let GetDashboardDataEntity = {
            UserID : context.LoginUserID
        }
        const res: any = await GetDashboardDataService(GetDashboardDataEntity);
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData.length) {
                setDashboard({...resData[0]})
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
        GetDashboardData()
    }, [])
    return (<>
        <div className="container1 dashboard">
            <div className="cards">
                <div className="card-item card1">
                    <div className="card-info">
                        <h2 className="card-title">Purchased Coupens</h2>   
                        <h1>{dashboard.Coupens}</h1>                     
                    </div>
                    <div className="card-info-img">
                        <div className="card-info-img1">
                            <img src={Card1} />
                        </div>
                    </div>
                </div>
            </div>
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
        </div>
    </>)
}

export default HomePageCards