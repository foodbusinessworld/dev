import React, { useState, useContext } from 'react';
import { CheckValidUserService } from './GeneralServices';
import { IStickyData, IStickyEntity } from './GeneralUtils';
import { ToastMessage } from '../../Common/Components/ToastMessage';
import { Context } from '../../App';
import LoginLogo from './../../Assests/LoginLogo.jpg';

const SignIn = () => {
  const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
  const [context, setContext] = useContext<any>(Context);

  const ChangePage = (id: number) => {
    setContext((prevState: any) => ({
      ...prevState,
      page: id
    }));
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var email = data.get('email');
    var password = data.get('password');
    let LoginEntity: any = {
      email: email,
      password: password
    }
    if (email === "" || email === null || email === undefined) {
      setIStickyEntity((prevState: any) => ({
        ...prevState,
        ID: 0,
        Type: 0,
        Message: 'Please enter email',
        Time: 3000,
        ShowToast: true
      }));
      return false;
    }
    if (password === "" || password === null || password === undefined) {
      setIStickyEntity((prevState: any) => ({
        ...prevState,
        ID: 0,
        Type: 0,
        Message: 'Please enter password',
        Time: 3000,
        ShowToast: true
      }));
      return false;
    }
    setContext((prevState: any) => ({
      ...prevState,
      Spin: true
    }));
    const res: any = await CheckValidUserService(LoginEntity);
    setContext((prevState: any) => ({
      ...prevState,
      Spin: false
    }));
    if (res.status === 200) {
      var resData = res?.data?.result;
      resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
      if (resData.length) {
        var Type = resData[0].Type;
        var Message = resData[0].Message;
        setIStickyEntity(prevState => ({
          ...prevState,
          Type: Type,
          Message: Message,
          Time: 3000,
          ShowToast: true
        }));
        if (Type === 1) {
          var UserData = {
            LoginUserID: resData[0].UserID,
            LoginUserName: resData[0].UserName,
            ReferralCode : resData[0].ReferralCode,
            UserType : resData[0].UserType,
            CartCount : resData[0].CartCount,
            Spin: false,
            page : 1
          }
          setContext(UserData);
          localStorage.setItem('UserData', JSON.stringify(UserData));
        }
      }
      else {
        setIStickyEntity(prevState => ({
          ...prevState,
          Type: 0,
          Message: 'Error while login',
          Time: 3000,
          ShowToast: true
        }));
      }
    }
    else if (res.message !== "") {
      setIStickyEntity(prevState => ({
        ...prevState,
        ID: 0,
        Type: 0, // Error
        Message: res.message,
        Time: 3000,
        ShowToast: true
      }));
    }
  };
  return (
    <>
      {
        IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
      }
      <div className="LoginPageContainer">
        <div className="LoginPageInnerContainer">
          <div className="ImageContianer">
            <img src={LoginLogo} className="GroupImage" />
          </div>
          <div className="LoginFormContainer">
            <div className="LoginFormInnerContainer">
              <header className="header_login">Log in</header>
              <header className="subHeader">Welcome to <b>Daily Income Payment!</b> Please Enter Your Credentials</header>
              <form onSubmit={handleSubmit}>
                <div className="inputContainer">
                  <div className="input-field">
                    <input type="email" name="email"  required spellCheck="false" />
                    <label>Enter Email</label>
                  </div>
                </div>
                <div className="inputContainer">
                  <div className="input-field">
                    <input type="password" name="password" required spellCheck="false" />
                    <label>Enter Password</label>
                  </div>
                </div>
                <div className="OptionsContainer">
                  <div className="checkboxContainer">
                    <label onClick={() => ChangePage(2)}>Don't have an account ?</label>
                  </div>
                  {/* <span className="ForgotPasswordLink" onClick={() => ChangePage(3)}>Forgot Password?</span> */}
                </div>
                <button className="LoginButton">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
