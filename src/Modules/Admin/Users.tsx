import { useContext, useEffect, useState } from "react";
import { IStickyData, IStickyEntity } from '../General/GeneralUtils';
import { Context } from '../../App';
import { GetOrdersService, GetUserDropdownService, GetUsersDataService } from "./AdminServices";
import { ToastMessage } from "../../Common/Components/ToastMessage";
import NoDataFound from "../../Common/Components/NoDataFound";
import { AutoComplete } from "antd";
import { Link, useParams } from "react-router-dom";

const Users = () => {
    const { id } = useParams();
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [Orders, setOrders] = useState<any>([]);
    const [Users, setUsers] = useState<any>([{ value: '' }]);

    const onClearFun = () => {
        GetUsersData(0);
    }

    const onSelectFun = (value: any, option: any) => {
        if (value.length) {
            var id: number = option.key;
            GetUsersData(id);
        }
    }

    const GetUsersData = async (id: number) => {
        let GetOrdersEntity = {
            UserID: id
        }
        const res: any = await GetUsersDataService(GetOrdersEntity);
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData.length) {
                setOrders(resData)
            }
            else {
                setOrders([])
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
    const GetUserDropdown = async () => {
        let GetUsersEntity = { }
        const res: any = await GetUserDropdownService(GetUsersEntity);
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData.length) {
                setUsers(resData)
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
    const options = [
        { value: 'Burns Bay Road' },
        { value: 'Downing Street' },
        { value: 'Wall Street' },
    ];

    useEffect(() => {
        GetUsersData(0);
        GetUserDropdown()
    }, [])
    return (<>
        {
            IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
        }
        <div className='AddAccountBtn'>
            <AutoComplete
                style={{ width: 200 }}
                options={Users}
                placeholder="Search User"
                allowClear={true}
                onClear={onClearFun}
                onSelect={(value, option) => onSelectFun(value, option)}
                filterOption={(inputValue, option: any) =>
                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
            />
        </div>

        {
            Orders.length ?
                <div className="Orders">

                    <div className="cards">
                        <div className='table-head'>
                            <p>User</p>
                            <p>No. of Orders</p>
                            <p>Investment Amount</p>
                            <p>Profit</p>
                            <p>Withdraw</p>
                            <p>No. of Referrals</p>
                        </div>
                        {
                            Orders.map((data: any) => <>
                                <div className='table-body ptb-10'>
                                    <p><span><b>User Name &nbsp; : &nbsp;</b></span>{data.UserName}</p>
                                    <p>
                                        <span><b>No. of Orders &nbsp; : &nbsp;</b></span>
                                        <Link to={`/Orders/${data.UserID}`}>
                                            <span className={`${data.PO > 0 || data.SO > 0 || data.RO > 0 ? 'link' : 'link1'}`}>{data.PO} / {data.SO} / {data.RO}</span>
                                        </Link>
                                    </p>
                                    <p><span><b>Investment Amount &nbsp; : &nbsp;</b></span>₹ {data.TotalItemBasePrise}</p>
                                    <p><span><b>Profit &nbsp; : &nbsp;</b></span>₹ {data.Profit}</p>
                                    <p><span><b>Withdraw &nbsp; : &nbsp;</b></span>₹ {data.Withdraw}</p>
                                    <p>
                                        <span><b>No. of Referrals &nbsp; : &nbsp;</b></span>
                                        <Link to={`/UserReferral/${data.UserID}`}>
                                            <span className={`${data.NoOfReferrals > 0 ? 'link' : 'link1'}`}>{data.NoOfReferrals}</span>
                                        </Link>
                                        
                                    </p>
                                    <hr />
                                </div>
                            </>)
                        }
                    </div>
                </div>
                :
                <NoDataFound message={"No Users"} />
        }
    </>)
}

export default Users