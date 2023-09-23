//import { EP_URL } from '../../Common/Endpoint';
import { Endpoint_URL } from '../../Common/API';
import { loginMethod, PostMethod } from './../../Common/AxiosSetup';
//import { ILoginEntity } from './GeneralUtils';


export const CheckValidUserService = async (LoginEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Login/Login', LoginEntity);
}

export const UpsertUserService = async (UpsertUserEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Login/UpsertUser', UpsertUserEntity);
}

export const GetCartCountService = async (UpsertUserEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Login/GetCartCount', UpsertUserEntity);
}