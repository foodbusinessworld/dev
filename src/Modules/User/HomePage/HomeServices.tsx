//import { EP_URL } from '../../Common/Endpoint';
import { Endpoint_URL } from '../../../Common/API';
import { loginMethod } from '../../../Common/AxiosSetup';

export const GetDashboardDataService = async (GetDashboardDataEntity: any) => {
    return await loginMethod(Endpoint_URL, 'Home/GetUserDashboardData', GetDashboardDataEntity);
}