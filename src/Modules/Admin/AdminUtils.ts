export interface IDashboardEntity  {
    Users:number
    Coupens:number
    Invenstment:number
    Withdraw:number
}

export const IDashboardData : IDashboardEntity = {
    Users:0,
    Coupens:0,
    Invenstment:0,
    Withdraw:0 
}

export interface IPaymentStatus  {
    ConfirmationShow:boolean
    paymentStatusTitle:string
    paymentStatusMessage:string
    WID:number
}

export const IPaymentStatusData : IPaymentStatus  = {
    ConfirmationShow : false,
    paymentStatusTitle : '',
    paymentStatusMessage : '',
    WID:0 
}

export interface IPaymentAcceptStatus  {
    ConfirmationShow:boolean
    paymentStatusTitle:string
    paymentStatusMessage:string
    OrderID:number
    TransactionID:string
    paymentStatusID:number
}

export const IPaymentAcceptData : IPaymentAcceptStatus  = {
    ConfirmationShow : false,
    paymentStatusTitle : '',
    paymentStatusMessage : '',
    OrderID:0 ,
    TransactionID :'',
    paymentStatusID:0
}