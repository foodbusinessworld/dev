export interface IAccountUtils {
    AccountID : number
    UserID : number
    AccountHolderName : string
    AccountNumber : string
    IFSC_Code : string
    Branch_Name : string
    Branch_Address : string
}

export const IAccountData = {
    AccountID : 0,
    UserID : 0,
    AccountHolderName : '',
    AccountNumber : '',
    IFSC_Code : '',
    Branch_Name : '',
    Branch_Address : '',
}

export interface IWithdrawHistory {
    WID : number
    UserID : number
    UserName : string
    Amount : number
    Status : string
    StatusID : number
    RequestedDate : string
    AcceptedDate : string
    CreditedTo : string
}

export interface IReferedMembersModel  {
    ReferedMembers : number,
    EarnedAmount : number
}

export const IReferedMembersData : IReferedMembersModel = {
    ReferedMembers : 0,
    EarnedAmount : 0
}

export interface IWithdrawLimitModel  {
    Amount : number
}

export const IWithdrawLimitData : IWithdrawLimitModel = {
    Amount : 0
}