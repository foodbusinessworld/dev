import { useContext, useEffect, useState } from "react";
import { IOrderSummaryData, IOrderSummaryEntity, IStickyData, IStickyEntity } from '../../General/GeneralUtils';
import { Context } from '../../../App';
import { GetOrdersService } from "./ProfileServices";
import { ToastMessage } from "../../../Common/Components/ToastMessage";
import NoDataFound from "../../../Common/Components/NoDataFound";
import { Popover, Tag, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const PopoverContent = (PurchasedOn: string,AcceptedOn:string ) => {
    return(
        <div>
            <p><b>Purchased On : </b>{PurchasedOn}</p>
            <p><b>Accepted On :</b> {AcceptedOn}</p>
        </div>
    )
}

const Orders = () => {
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [Orders, setOrders] = useState<any>([]);
    const [OrderSummary, setOrderSummary] = useState<IOrderSummaryEntity>(IOrderSummaryData);

    const GetOrdersData = async () => {
        let GetOrdersEntity = {
            UserID: context.LoginUserID
        }
        const res: any = await GetOrdersService(GetOrdersEntity);
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData.length) {
                setOrders(resData);
                let TotalOrders = resData.length;
                let TotalInvestment =  resData.reduce(function (sum:any, val:any) {
                    return sum + (val.Item_Base_Prise * val.ItemQty);
                }, 0);
                let Totalprofit =  resData.reduce(function (sum:any, val:any) {
                    return sum + val.Profit;
                }, 0);
                let obj = {
                    TotalOrders: TotalOrders,
                    TotalInvestment : TotalInvestment,
                    TotalProfit: Totalprofit
                }
                setOrderSummary(obj)
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
        GetOrdersData();
        document.documentElement.scrollTop = document.documentElement.clientHeight;
        document.documentElement.scrollLeft = document.documentElement.clientWidth;
    }, [])
    return (<>
        {
            IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
        }

        <div className="Orders_page">
            <div className="Orders_Account">
                <div className="pb-20 b-b">
                    <p className="title__">Account</p>
                    <p className="text__">{context.LoginUserName}</p>
                </div>
                <div className="ptb-20">
                    {/* <p className="title__">Filter</p>
                    <p className="text__"><div className="pending_div"></div>Pending</p>
                    <p className="text__"><div className="success_div"></div>Success</p>
                    <p className="text__"><div className="rejected_div"></div>Rejected</p> */}
                    <p className="title__">Order Summary</p>
                    <p className="text__">Total No. of Orders : {OrderSummary.TotalOrders}</p>
                    <p className="text__">Total Investment : ₹{OrderSummary.TotalInvestment}</p>
                    <p className="text__">Total Profit : ₹{OrderSummary.TotalProfit}</p>
                </div>
            </div>
            <div className="Orders_Details">
                    {
                        Orders.length ? Orders.map((data: any) =>
                            <div className="Orders_Details_items">
                                <Row>
                                    <Col sm={2} className="text-align-center">
                                        <img src={`data:image/png;base64,${data.ImageBiteCode}`} alt={data.ItemName} />
                                    </Col>
                                    <Col sm={3} className="align-items-center">
                                        <div>
                                            <p className="title__">{data.ItemName}</p>
                                            <p className="text__">Cost : &nbsp;₹{data.Item_Base_Prise}</p>
                                            <p className="text__">Profit per Day :&nbsp;₹{data.Item_WD_Prise}</p>
                                        </div>
                                    </Col>                                    
                                    <Col sm={3} className="align-items-center">
                                        <div>
                                            <p className="text__">Quantity :&nbsp;<b>{data.ItemQty}</b></p>
                                            <p className="text__">No. of days :&nbsp;<b>{data.NoOfDays}</b></p>
                                            <p className="text__">Total Profit :&nbsp;<b>₹{data.Profit}</b></p>
                                        </div>
                                    </Col>
                                    <Col sm={4} className="align-items-center">
                                        <div>
                                            <p className="title__">
                                                <div  className="align-items-center">
                                                    <div className={data.Status === 1 ? "pending_div" : data.Status === 2 ? "success_div" : "rejected_div" }></div>
                                                    {data.StatusText}
                                                </div>
                                            </p>
                                            <p className="text__">Purchased On :&nbsp;{data.PurchasedOn}</p>
                                            <p className="text__">Accepted On :&nbsp;<b>{data.AcceptedOn}</b></p>
                                        </div>
                                    </Col>
                                </Row>
                                
                            </div>)

                        :   <NoDataFound message={"No orders"}/>
                    }
            </div>
        </div>
    </>)
}

export default Orders