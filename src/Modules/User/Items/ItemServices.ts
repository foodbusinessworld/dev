//import { EP_URL } from '../../Common/Endpoint';
import { Endpoint_URL } from '../../../Common/API';
import { loginMethod } from '../../../Common/AxiosSetup';
//import { ILoginEntity } from './GeneralUtils';


export const GetItemsService = async (GetItemsEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Home/GetItems', GetItemsEntity);
}

export const UpsertCartItemsService = async (UpsertCartItemsEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Cart/UpsertCartItems', UpsertCartItemsEntity);
}