import { useContext, useEffect, useState } from "react";
import { IStickyData, IStickyEntity } from '../General/GeneralUtils';
import { Context } from '../../App';
import { GetOrdersService, GetUserDropdownService, UpsertOrderPaymentStatusService } from "./AdminServices";
import { ToastMessage } from "../../Common/Components/ToastMessage";
import NoDataFound from "../../Common/Components/NoDataFound";
import { AutoComplete, Popover, Tag } from "antd";
import { useParams } from "react-router-dom";
import { IPaymentAcceptData, IPaymentAcceptStatus  } from "./AdminUtils";
import AcceptOrderConfirmation from "../../Common/Components/AcceptOrderConfirmation";

const PopoverContent = (PurchasedOn: string,AcceptedOn:string ) => {
    return(
        <div>
            <p><b>Purchased On : </b>{PurchasedOn}</p>
            <p><b>Accepted On :</b> {AcceptedOn}</p>
        </div>
    )
}

const Orders = () => {
    const { id } = useParams();
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [Orders, setOrders] = useState<any>([]);
    const [Users, setUsers] = useState<any>([{ value: '' }]);
    const [paymentStatus, setpaymentStatus] = useState<IPaymentAcceptStatus>(IPaymentAcceptData);

    const onClearFun = () => {
        GetOrdersData(0);
    }

    const onSelectFun = (value: any, option: any) => {
        if (value.length) {
            var id: number = option.key;
            GetOrdersData(id);
        }
    }
    const ShowPaymentStatusModel = (OrderID: number, status :number, TransactionID: string) => {
            setpaymentStatus({ 
                ...paymentStatus, 
                ConfirmationShow: true, 
                paymentStatusMessage:"Are you sure you received money for this order?",
                OrderID : OrderID,
                TransactionID: TransactionID,
                paymentStatusID:status
            })

    }
    const paymentStatusInfo = async (confirmation: boolean) => {
        setpaymentStatus({ ...paymentStatus, ConfirmationShow: false })
        if (confirmation) {
            let OrderPaymentptEntity = {
                OrderID: paymentStatus.OrderID,
                Status: 2
            }
            const res: any = await UpsertOrderPaymentStatusService(OrderPaymentptEntity);
            if (res.status === 200) {
                setTimeout(() => {
                    GetOrdersData(id);
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

    const GetOrdersData = async (id: any) => {
        if(id === null || id === undefined || id === '') {
            return false
        }
        let GetOrdersEntity = {
            UserID: id
        }
        const res: any = await GetOrdersService(GetOrdersEntity);
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
    const GetUsersData = async () => {
        let GetUsersEntity = {}
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
    
    useEffect(() => {
        GetOrdersData(id);
        GetUsersData()
    }, [])
    return (<>
        {
            IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
        }
        {
            paymentStatus.ConfirmationShow ?
                <AcceptOrderConfirmation
                    display={paymentStatus.ConfirmationShow}
                    DeleteMessageTitle={paymentStatus.paymentStatusTitle}
                    DeleteMessage={paymentStatus.paymentStatusMessage}
                    TransactionID = {paymentStatus.TransactionID}
                    PaymentStatusID = {paymentStatus.paymentStatusID}
                    sendData={paymentStatusInfo}
                />
                :
                <></>
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
                            <p></p>
                            <p>User</p>
                            <p>Investment</p>
                            <p>Profit/Day</p>
                            <p>Quantity</p>
                            <p>No. of Days</p>
                            <p>Total Profit</p>
                            <p>Status</p>
                            <p>Action</p>
                        </div>
                        {
                            Orders.map((data: any) => <>
                                <div className='table-body'>
                                    <p className="p-image">
                                        <img src={`data:image/png;base64,${data.ImageBiteCode}`} alt={data.ItemName} />
                                        <br/><b>{data.ItemName}</b>
                                    </p>
                                    <p><span><b>User Name : </b></span>{data.UserName}</p>
                                    <p><span><b>Investment : </b></span>₹{data.Item_Base_Prise}</p>
                                    <p><span><b>Profit per Day : </b></span> ₹{data.Item_WD_Prise}</p>
                                    <p><span><b>Quantity : </b></span> {data.ItemQty}</p>
                                    <p><span><b>No of Days : </b></span> {data.NoOfDays}</p>
                                    <p className='p2'><span><b>Total Profit : </b></span>₹ {data.Profit}</p>
                                    <p><span><b>Status &nbsp; : &nbsp;</b></span>
                                        <Tag
                                            onClick={() => ShowPaymentStatusModel(data.OrderID, data.Status, data.TransactionID)} 
                                            color={
                                            data.Status === 1 ? '#f28e4b' :
                                                data.Status === 2 ? '#2bbb8d' : '#f85772'
                                        }>{data.StatusText}</Tag>
                                    </p>
                                    <p>
                                    <p className="">
                                        <Popover content={PopoverContent(data.PurchasedOn, data.AcceptedOn)}>
                                            <span className="dis_block">More</span>
                                        </Popover>
                                    </p>
                                    </p>
                                    <hr />
                                </div>
                            </>)
                        }
                    </div>
                </div>
                :
                <NoDataFound message={"No orders"} />
        }
    </>)
}

export default Orders