import React, { useState, useEffect, useContext } from 'react';
import { IStickyData, IStickyEntity } from '../../General/GeneralUtils';
import { ToastMessage } from '../../../Common/Components/ToastMessage';
import { Context } from '../../../App';
import { BookAnOrderService, GetCartItemsService, RemoveCartItemsService, UpsertCartItemsService } from './CartServices';
import DeleteConfirmationComponent from '../../../Common/Components/DeleteConfirmation';
import { ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons';
import NoDataFound from '../../../Common/Components/NoDataFound';
import CartCount from '../../../Common/ContextStore/CartCount';
import PaymentGatewayComponent from '../../../Common/Components/PaymentGatewayComponent';

const Cart = () => {
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [CartItems, setCartItems] = useState<any>([]);
    const [deleteCartData, setDeleteCartData] = useState<any>([]);
    const [gateWayShow, setGateWayShow] = useState<boolean>(false);

    const UpsertCart = async (data: any, type: string) => {
        var qty = data.ItemQty
        if (type === 'delete') {
            ShowDeleteModel(data.CartID);
        }
        else if (type === 'decrease' && qty === 1) {
            ShowDeleteModel(data.CartID);
        }
        else {
            if (type === 'decrease') {
                qty = data.ItemQty - 1;
            }
            else {
                qty = data.ItemQty + 1;
            }
            let UpsertCartItemsEntity = {
                CartID: data.CartID,
                UserID: data.UserID,
                ItemID: data.ItemID,
                ItemQty: qty
            }
            const res: any = await UpsertCartItemsService(UpsertCartItemsEntity);
            debugger
            if (res.status === 200) {
                GetCartItemsData();
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
    const ShowDeleteModel = (CartID: number) => {
        setDeleteCartData({
            ...deleteCartData,
            DeleteConfirmationShow: true,
            DeleteMessage: "Are you sure you want to remove from cart ?",
            CartID: CartID
        })
    }

    const DeleteCartInfo = async (deleteconfirmation: boolean) => {
        setDeleteCartData({ ...deleteCartData, DeleteConfirmationShow: false })
        if (deleteconfirmation) {
            let RemoveCartItemsEntity = {
                CartID: deleteCartData.CartID,
                UserID: context.LoginUserID
            }
            const res: any = await RemoveCartItemsService(RemoveCartItemsEntity);
            debugger
            if (res.status === 200) {
                GetCartItemsData();
                let GetCartCountEntity = {
                    UserID: context.LoginUserID
                }
                var count = await CartCount(GetCartCountEntity);
                setContext((prevState: any) => ({
                    ...prevState,
                    CartCount: count
                }));
                setTimeout(() => {
                    localStorage.setItem('UserData', JSON.stringify(context));
                }, 500)
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

    const OpenPaymentGatewayModel = () => {
        setGateWayShow(true)
    }

    const BookAnOrder = async (payment: boolean,transactionID:string) => {
        setGateWayShow(false)
        if (payment) {
            var temp: any = [];
            CartItems.forEach((element: any) => {
                temp.push({
                    UserID: element.UserID,
                    ItemID: element.ItemID,
                    ItemQty: element.ItemQty,
                    Item_Base_Prise: element.ItemBasePrise,
                    Item_WD_Prise: element.WD_Profit,
                    Item_WE_Prise: element.WE_Profit,
                    InvestmentAmount: element.TotalPrise,
                    TransactionID :transactionID
                })
            });
            var BookAnOrderEntity = {
                inputDataJson: JSON.stringify(temp),
                UserID: context.LoginUserID
            }
            const res: any = await BookAnOrderService(BookAnOrderEntity);
            debugger
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
                        window.setTimeout(() => { GetCartItemsData() }, 2000)
                    }

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
    }
    const GetCartItemsData = async () => {
        setIStickyEntity(prevState => ({
            ...prevState,
            ShowToast: false
        }));
        let GetCartItemsEntity = {
            UserID: context.LoginUserID
        }
        const res: any = await GetCartItemsService(GetCartItemsEntity);
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            setCartItems(resData)
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
        GetCartItemsData()
    }, [])
    return (<>

        {
            IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
        }
        {
            deleteCartData.DeleteConfirmationShow ?
                <DeleteConfirmationComponent
                    display={deleteCartData.DeleteConfirmationShow}
                    DeleteMessageTitle={deleteCartData.DeleteTitle}
                    DeleteMessage={deleteCartData.DeleteMessage}
                    sendData={DeleteCartInfo}
                />
                :
                <></>
        }
        {
            gateWayShow ?
                <PaymentGatewayComponent
                    display={gateWayShow}
                    sendData={BookAnOrder}
                />
                :
                <></>
        }
        {
            CartItems.length ?
                <div className="container1 cart">
                    <div className='cart1'>
                        <div className="cards">
                            <div className="cards-item">
                                <div className='table-head'>
                                    <p></p>
                                    <p>Price</p>
                                    <p>Quantity</p>
                                    <p>Subtotal</p>
                                    <p>Remove</p>
                                </div>
                                {
                                    CartItems.map((data: any) => <>
                                        <div className='table-body'>
                                            <p className="p-image">
                                                <img src={`data:image/png;base64,${data.ImageBiteCode}`} alt={data.ItemName} />
                                                <br /><b>{data.ItemName}</b>
                                            </p>
                                            <p><span><b>Price : </b></span>₹ {data.ItemBasePrise}</p>
                                            <p>
                                                <div className="btn-group">
                                                    <button onClick={() => UpsertCart(data, 'decrease')}>-</button>
                                                    <button>{data.ItemQty}</button>
                                                    <button onClick={() => UpsertCart(data, 'increase')}>+</button>
                                                </div>
                                            </p>
                                            <p className='p2'><span><b>Subtotal : </b></span>₹ {data.TotalPrise}</p>
                                            <p><span className='delete' onClick={() => UpsertCart(data, 'delete')}><b>Remove</b></span> <DeleteOutlined className='c-p' onClick={() => UpsertCart(data, 'delete')} /></p>
                                            <hr />
                                        </div>
                                    </>)
                                }
                            </div>
                        </div>
                    </div>
                    <div className='cart2'>
                        <div className="cards">
                            <div className="cards-item">
                                <h2 className="card-title">Order Summary</h2>

                                <div className='card-body'>
                                    <div>
                                        <p className="key">No. of Products</p>
                                        <p className="key">No. of Items</p>
                                        <p className="key1">Total</p>
                                    </div>
                                    <div>
                                        <p className='value'>{CartItems.length}</p>
                                        <p className='value'>{CartItems[0].TotalQuantity}</p>
                                        <p className='value1'>₹{CartItems[0].TotalAmount}</p>
                                    </div>
                                </div>
                                <button className='pay-btn' onClick={() => OpenPaymentGatewayModel()}>PROCEED TO CHECKOUT <ArrowRightOutlined /></button>
                            </div>
                        </div>
                    </div>
                </div>
                : <NoDataFound message={"No items in cart"} />
        }
    </>)
}

export default Cart