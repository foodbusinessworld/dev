import React, { useState, useContext } from 'react';
import { Context } from '../../../App';
import { ToastMessage } from '../../../Common/Components/ToastMessage';
import { IStickyData, IStickyEntity, IUpsertUserEntity } from '../../General/GeneralUtils';
import { ChangePasswordService } from './ProfileServices';

const ChangePassword = () => {
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        debugger
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var oldpassword = data.get('oldpassword');
        var newpassword = data.get('newpassword');
        var confirmpassword = data.get('confirmpassword');
        if (oldpassword === "" || oldpassword === null || oldpassword === undefined) {
            setIStickyEntity((prevState: any) => ({
                ...prevState,
                ID: 0,
                Type: 0,
                Message: 'Please enter old password',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }
        if (newpassword === "" || newpassword === null || newpassword === undefined) {
            setIStickyEntity((prevState: any) => ({
                ...prevState,
                ID: 0,
                Type: 0,
                Message: 'Please enter new password',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }
        if (confirmpassword === "" || confirmpassword === null || confirmpassword === undefined) {
            setIStickyEntity((prevState: any) => ({
                ...prevState,
                ID: 0,
                Type: 0,
                Message: 'Please enter confirm password',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }
        if (newpassword !== confirmpassword) {
            setIStickyEntity((prevState: any) => ({
                ...prevState,
                ID: 0,
                Type: 0,
                Message: 'New password and confirm password not matched',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }
        let UpsertUserEntity: any = {
            UserID: context.LoginUserID,
            oldpassword: oldpassword,
            newpassword: newpassword
        }
        setContext((prevState: any) => ({
            ...prevState,
            Spin: true
        }));
        const res: any = await ChangePasswordService(UpsertUserEntity);
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
                        localStorage.clear();
                        // window.href
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
    return (<>
        {
            IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
        }
        <div className="profile-container">
            <div className="profile-card">
                <h2>Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="inputContainer">
                        <div className="input-field">
                            <input type="password" name="oldpassword" required spellCheck="false" />
                            <label>Old Password</label>
                        </div>
                    </div>
                    <div className="inputContainer">
                        <div className="input-field">
                            <input type="password" name="newpassword" required spellCheck="false" />
                            <label>New Password</label>
                        </div>
                    </div>
                    <div className="inputContainer">
                        <div className="input-field">
                            <input type="password" name="confirmpassword" required spellCheck="false" />
                            <label>Confirm Password</label>
                        </div>
                    </div>
                    <button className="LoginButton">Submit</button>
                </form>
            </div>
        </div>
    </>)
}
export default ChangePassword;