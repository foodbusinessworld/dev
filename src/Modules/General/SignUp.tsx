import React, { useState, useContext } from 'react';
import { UpsertUserService } from './GeneralServices';
import { IStickyData, IStickyEntity, IUpsertUserEntity } from './GeneralUtils';
import { ToastMessage } from '../../Common/Components/ToastMessage';
import { Context } from '../../App';
import LoginLogo from './../../Assests/LoginLogo.jpg';

const SignUp = () => {
  const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
  const [context, setContext] = useContext<any>(Context);
  const [coupon, setCoupon] = useState<boolean>(false);

  const ChangePage = (id: number) => {
    setContext((prevState: any) => ({
      ...prevState,
      page: id
    }));
  }
  const ShowCoupon = (show: boolean) => {
    setCoupon(show);
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var username = data.get('username');
    var mobile = data.get('mobile');
    var email = data.get('email');
    var password = data.get('password');
    var code = data.get('code');
    if (username === "" || username === null || username === undefined) {
      setIStickyEntity((prevState: any) => ({
        ...prevState,
        ID: 0,
        Type: 0,
        Message: 'Please enter user name',
        Time: 3000,
        ShowToast: true
      }));
      return false;
    }
    if (mobile === "" || mobile === null || mobile === undefined) {
      setIStickyEntity((prevState: any) => ({
        ...prevState,
        ID: 0,
        Type: 0,
        Message: 'Please enter mobile',
        Time: 3000,
        ShowToast: true
      }));
      return false;
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

    let UpsertUserEntity: any = {
      UserID: 0,
      UserName: username,
      Mobile: mobile,
      EMail: email,
      Password: password,
      code : code === null ? '' : code
    }
    setContext((prevState: any) => ({
      ...prevState,
      Spin: true
    }));
    const res: any = await UpsertUserService(UpsertUserEntity);
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
        if (Type === 1) { // 1 - success
          setTimeout(() => {
            ChangePage(1); // redirect to login
          }, 3000)
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
          <div className="LoginFormContainer LoginFormContainer1">
            <div className="LoginFormInnerContainer">
              <header className="header_login">Create an account</header>
              <header className="subHeader">Welcome to <b>Daily Income Payment!</b> Please Enter your Details</header>
              <form onSubmit={handleSubmit}>
                <div className="inputContainer">
                  <div className="input-field">
                    <input type="text" name="username" required spellCheck="false" />
                    <label>Enter User Name</label>
                  </div>
                </div>
                <div className="inputContainer">
                  <div className="input-field">
                    <input type="text" name="mobile" required spellCheck="false" />
                    <label>Enter Mobile No.</label>
                  </div>
                </div>
                <div className="inputContainer">
                  <div className="input-field">
                    <input type="email" name="email" required spellCheck="false" />
                    <label>Enter Email</label>
                  </div>
                </div>
                <div className="inputContainer">
                  <div className="input-field">
                    <input type="password" name="password" required spellCheck="false" />
                    <label>Enter Password</label>
                  </div>
                </div>
                {
                  coupon ?
                    <div className="inputContainer">
                      <div className="input-field">
                        <input type="text" name="code" spellCheck="false" />
                        <label>Referral Code</label>
                      </div>
                    </div>
                    : <></>
                }
                <div className="OptionsContainer">
                  <div className="checkboxContainer">
                    <label onClick={() => ChangePage(1)}>Back to Login</label>
                  </div>
                  <span className="ForgotPasswordLink" onClick={() => ShowCoupon(!coupon)}>
                    {coupon ? `Don't have referral code !` : 'Do you have referral code ?'}
                  </span>
                </div>
                <button className="LoginButton">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
