import { useContext, useEffect, useState } from "react";
import { IStickyData, IStickyEntity } from '../General/GeneralUtils';
import { Context } from '../../App';
import { GetAdminReferralsService } from "./AdminServices";
import { ToastMessage } from "../../Common/Components/ToastMessage";
import NoDataFound from "../../Common/Components/NoDataFound";
import { useParams } from "react-router-dom";

const UserReferral = () => {
    const { id } = useParams();
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [Referrals, setReferrals] = useState<any>([]);

    const GetReferralsData = async () => {
        if(id === null || id === undefined || id === '') {
            return false
        }
        let GetAdminReferralsEntity = {
            ReferredBy: Number(id)
        }
        const res: any = await GetAdminReferralsService(GetAdminReferralsEntity);
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData.length) {
                setReferrals(resData)
            }
            else {
                setReferrals([])
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
        {
            IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
        }
        {
            Referrals.length ?
                <div className="Orders">

                    <div className="cards">
                        <div className='table-head'>
                            <p>User Name</p>
                            <p>Referred By</p>
                            <p>No. of Referrals</p>
                            <p>Created On</p>
                            <p>First Order</p>
                        </div>
                        {
                            Referrals.map((data: any) => <>
                                <div className='table-body ptb-10'>
                                    <p><span><b>User Name &nbsp; : &nbsp;</b></span>{data.UserName}</p>
                                    <p><span><b>Referred By &nbsp; : &nbsp;</b></span>{data.ReferredBy}</p>
                                    <p><span><b>No. of Referrals &nbsp; : &nbsp;</b></span> {data.NoOfReferrals}</p>
                                    <p><span><b>Created On &nbsp; : &nbsp;</b></span> {data.CreatedOn}</p>
                                    <p><span><b>First Order &nbsp; : &nbsp;</b></span> {data.FirstOrderOn}</p>
                                    <hr />
                                </div>
                            </>)
                        }
                    </div>
                </div>
                :
                <NoDataFound message={"No Referrels"} />
        }
    </>)
}

export default UserReferral