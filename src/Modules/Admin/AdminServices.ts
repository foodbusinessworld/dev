import { Endpoint_URL } from "../../Common/API";
import { loginMethod } from "../../Common/AxiosSetup";

export const GetDashboardDataService = async (GetDashboardDataEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Admin/GetAdminDashboardData', GetDashboardDataEntity);
}
export const GetUserDropdownService = async (GetUsersEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Admin/GetUsersDropdown', GetUsersEntity);
}
export const GetUsersDataService = async (GetUsersEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Admin/GetUsersData', GetUsersEntity);
}
export const GetOrdersService = async (GetOrdersEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Admin/GetAdminOrders', GetOrdersEntity);
}
export const GetAdminReferralsService = async (GetAdminReferralsEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Admin/GetAdminReferrals', GetAdminReferralsEntity);
}
export const UpsertWithdrawPaymentStatusService = async (UpsertPaymentStatusEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Admin/UpsertWithdrawPaymentStatus', UpsertPaymentStatusEntity);
}
export const UpsertOrderPaymentStatusService = async (OrderPaymentptEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Admin/UpsertOrderPaymentStatus', OrderPaymentptEntity);
}