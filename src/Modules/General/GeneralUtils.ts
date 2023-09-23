
export interface ILoginEntity {
    EMail : string,
    Password : string
}

export const IStickyData =  { 
    ID: 0, 
    Type: 0, 
    Message:"", 
    Time:0, 
    ShowToast:false
}

export interface IStickyEntity {
    ID : number,
    Type : number,
    Message : string
    Time:number,
    ShowToast:boolean
}

export interface IUpsertUserEntity {
    UserID : number,
    UserName? : string,
    EMail : string
    Password:string,
    Mobile:string
}

export interface IOrderSummaryEntity {
    TotalOrders: number;
    TotalInvestment : number;
    TotalProfit: number
}
export const IOrderSummaryData = {
    TotalOrders: 0,
    TotalInvestment : 0,
    TotalProfit: 0
}