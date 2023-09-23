//import { EP_URL } from '../../Common/Endpoint';
import { Endpoint_URL } from '../../../Common/API';
import { loginMethod, PostMethod } from '../../../Common/AxiosSetup';
//import { ILoginEntity } from './GeneralUtils';


export const GetCartItemsService = async (GetCartItemsEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Cart/GetCartItems', GetCartItemsEntity);
}

export const UpsertCartItemsService = async (UpsertCartItemsEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Cart/UpsertCartItems', UpsertCartItemsEntity);
}

export const RemoveCartItemsService = async (RemoveCartItemsEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Cart/RemoveCartItems', RemoveCartItemsEntity);
}
export const BookAnOrderService = async (BookAnOrderEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Cart/BookAnOrder', BookAnOrderEntity);
}