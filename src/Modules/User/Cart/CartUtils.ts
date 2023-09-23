
export interface ILoginEntity {
    EMail : string,
    Password : string
}

export interface IUpsertUserEntity {
    UserID : number,
    UserName? : string,
    EMail : string
    Password:string,
    Mobile:string
}