import { Endpoint_URL } from "../../../Common/API";
import { loginMethod } from "../../../Common/AxiosSetup";

export const ChangePasswordService = async (UpsertUserEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Login/ChangePassword', UpsertUserEntity);
}
export const GetAccountService = async (GetAccountEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Home/GetAccounts', GetAccountEntity);
}
export const UpsertAccountService = async (UpsertAccountEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Home/UpsertAccounts', UpsertAccountEntity);
}
export const GetOrdersService = async (GetOrdersEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Home/GetOrders', GetOrdersEntity);
}
export const GetWithdrawAmountHistoryService = async (GetWithdrawAmountHistoryEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Home/GetWithdrawAmountHistory', GetWithdrawAmountHistoryEntity);
}
export const RequestWithdrawAmountService = async (WithdrawAmountEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Home/RequestWithdrawAmount', WithdrawAmountEntity);
}