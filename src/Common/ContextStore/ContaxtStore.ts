export const ILoginData = {
  LoginUserID : 0,
  LoginUserName : '',
  ReferralCode : '',
  UserType : 0,
  CartCount : 0,
  Spin : false,
  page : 1
}
export interface IUserLoginData {
  LoginUserID : number,
  LoginUserName : string,
  ReferralCode : string,
  UserType : number,
  CartCount : number,
  Spin : boolean
  page : number
}