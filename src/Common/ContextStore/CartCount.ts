import { useContext } from "react";
import { Context } from "../../App";
import { GetCartCountService } from "../../Modules/General/GeneralServices";

const CartCount = async (GetCartCountEntity:any) => {
    const res: any = await GetCartCountService(GetCartCountEntity);
    if (res.status === 200) {
        var resData = res?.data?.result;
        resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
        if (resData.length) {
             return resData[0].CartCount
        }
    }
    else {
        return 0
    }
    
}

export default CartCount