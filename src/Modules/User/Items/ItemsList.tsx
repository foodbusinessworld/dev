import React, { useState, useEffect, useContext } from 'react';
import { IStickyData, IStickyEntity } from '../../General/GeneralUtils';
import { ToastMessage } from '../../../Common/Components/ToastMessage';
import { Context } from '../../../App';
import { GetItemsService, UpsertCartItemsService } from './ItemServices';
import { IItemsModel } from './ItemsUtils';
import rupee from './../../Assests/rupee.svg'
import { ShoppingCartOutlined } from '@ant-design/icons';
import CartCount from '../../../Common/ContextStore/CartCount';

const ItemsList = () => {
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [items, setItems] = useState<IItemsModel[]>([]);

    const GetCartCount = async() => {
        let GetCartCountEntity = {
            UserID: context.LoginUserID
        }
        var count = await CartCount(GetCartCountEntity); 
        setIStickyEntity(prevState => ({
            ...prevState,
            ShowToast: false
        }));
        setContext((prevState:any) => ({
            ...prevState,
            CartCount : count
        }));  
        setTimeout(() => {
            localStorage.setItem('UserData', JSON.stringify(context));
        },500)  
    }

    const AddToCart = async (data: IItemsModel) => {
        let UpsertCartItemsEntity = {
            CartID: 0,
            UserID: context.LoginUserID,
            ItemID: data.ItemID,
            ItemQty: 1
        }
        const res: any = await UpsertCartItemsService(UpsertCartItemsEntity);
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
                    Time: 1000,
                    ShowToast: true
                }));
                if(Type === 1) {
                    setTimeout(() => {
                        GetCartCount();
                    },1000)
                }                              
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
    }

    const GetItemsData = async () => {
        const res: any = await GetItemsService({});
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData.length) {
                setItems(resData)
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
        GetItemsData()
    }, [])
    return (<>
        <div className="container1 items">
            {
                IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
            }
            {
                items ? items.map((data: IItemsModel) => <>
                    <div className="cards">
                        <div className="card-item">
                            <div className="card-image">
                                <img src={`data:image/png;base64,${data.ImageBiteCode}`} alt={data.ItemName} />
                            </div>
                            <div className="card-info">
                                <h2 className="card-title">{data.ItemName}</h2>
                                <div className='border-down'></div>
                                <p className="card-intro">Investment Amount  <b>- ₹{data.ItemBasePrise}</b></p>
                                <p className="card-intro">Daily Profit <b>- ₹{data.WD_Profit}</b></p>
                                {/* <p className="card-intro">Saturday, Sunday Profit <b>- {data.WE_Profit}</b></p> */}
                                <div className='card-btn-div'>
                                <button className="card-btn" onClick={() => AddToCart(data)}><ShoppingCartOutlined /> Add To Cart</button>
                                {/* <button className="card-btn" onClick={() => AddToCart(data)}>Invest Now</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </>)
                    : <></>
            }

        </div>
    </>)
}

export default ItemsList;