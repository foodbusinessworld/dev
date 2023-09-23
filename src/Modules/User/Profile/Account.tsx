import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../../App';
import { ToastMessage } from '../../../Common/Components/ToastMessage';
import { IStickyData, IStickyEntity, IUpsertUserEntity } from '../../General/GeneralUtils';
import { ChangePasswordService, GetAccountService, UpsertAccountService } from './ProfileServices';
import Edit from '../../../Assests/edit.png'
import { Empty, Modal } from 'antd';
import { IAccountData, IAccountUtils } from './ProfileUtils';
import { setTimeout } from 'timers/promises';
import NoDataFound from '../../../Common/Components/NoDataFound';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';

const Account = () => {
    const [IStickyEntity, setIStickyEntity] = useState<IStickyEntity>(IStickyData);
    const [context, setContext] = useContext<any>(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Account, setAccount] = useState<any>([])
    const [EditAccount, setEditAccount] = useState<IAccountUtils>(IAccountData)

    const showModal = (id:number) => { 
        // 0 - create
        // 1 - update
        setIsModalOpen(true);
        if(id === 0) {
            setEditAccount({...EditAccount, ...IAccountData})
        }
        else {
            setEditAccount({...EditAccount, ...Account[0]})
        }
    };

    const handleCancel = () => {
        setIStickyEntity((prevState: any) => ({
            ...prevState,
            ShowToast: false
        }));
        setIsModalOpen(false);
        setEditAccount(IAccountData)
        GetAccounts();
    }

    const handleChange = (e: any) => {
        setIStickyEntity((prevState: any) => ({
            ...prevState,
            ShowToast: false
        }));
        setEditAccount({ ...EditAccount, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        debugger
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var AccountHolderName = EditAccount.AccountHolderName;
        var AccountNumber = EditAccount.AccountNumber;
        var IFSC_Code = EditAccount.IFSC_Code;
        var Branch_Name = EditAccount.Branch_Name;

        if (AccountHolderName === "" || AccountHolderName === null || AccountHolderName === undefined) {
            setIStickyEntity((prevState: any) => ({
                ...prevState,
                ID: 0,
                Type: 0,
                Message: 'Please Enter Account Holder Name',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }
        if (AccountNumber === "" || AccountNumber === null || AccountNumber === undefined) {
            setIStickyEntity((prevState: any) => ({
                ...prevState,
                ID: 0,
                Type: 0,
                Message: 'Please Enter Account Number',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }
        if (IFSC_Code === "" || IFSC_Code === null || IFSC_Code === undefined) {
            setIStickyEntity((prevState: any) => ({
                ...prevState,
                ID: 0,
                Type: 0,
                Message: 'Please Enter IFSC Code',
                Time: 3000,
                ShowToast: true
            }));
            return false;
        }
        let UpsertAccountEntity: any = {
            AccountID: EditAccount.AccountID,
            UserID: EditAccount.UserID,
            AccountHolderName: AccountHolderName,
            AccountNumber: AccountNumber,
            IFSC_Code: EditAccount.IFSC_Code,
            Branch_Name: Branch_Name,
            Branch_Address: ''
        }
        setContext((prevState: any) => ({
            ...prevState,
            Spin: true
        }));
        const res: any = await UpsertAccountService(UpsertAccountEntity);
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
                    setIsModalOpen(false);
                    window.setTimeout(() => { handleCancel() }, 2000)
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
    const GetAccounts = async () => {
        let GetAccountEntity = {
            UserID: context.LoginUserID
        }
        const res: any = await GetAccountService(GetAccountEntity);
        if (res.status === 200) {
            var resData = res?.data?.result;
            resData = resData === undefined || resData === null || JSON.parse(resData).length === 0 ? [] : JSON.parse(resData);
            if (resData.length) {
                setAccount(resData)
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
    }
    useEffect(() => {
        GetAccounts();
    }, [])
    return (<>
        {
            IStickyEntity.ShowToast ? <ToastMessage data={IStickyEntity} /> : <></>
        }
        {
            Account.length ? <></> :
                <div className='AddAccountBtn'>
                    <button className='btn' onClick={() => showModal(0)}><PlusOutlined /> Add Account</button>
                </div>
        }
        {
            Account.length ?
                <div className='AccountCard'>
                    <div className='acnt-title'>
                        <h3>Account Details</h3>
                        <img src={Edit} onClick={() => showModal(1)} />
                    </div>
                    <hr />
                    <div className='acnt-body'>
                        <div className='part'>
                            <div>
                                <p className='label'>Account Holder Name :</p>
                                <p className='value'>{Account[0].AccountHolderName}</p>
                            </div>
                            <div>
                                <p className='label'>IFSC Code :</p>
                                <p className='value'>{Account[0].IFSC_Code}</p>
                            </div>
                        </div>
                        <div className='part'>
                            <div>
                                <p className='label'>Account Number :</p>
                                <p className='value'>{Account[0].AccountNumber}</p>
                            </div>
                            <div>
                                <p className='label'>Branch Name :</p>
                                <p className='value'>{Account[0].Branch_Name}</p>
                            </div>
                        </div>
                    </div>
                </div>
                : 
                <NoDataFound message={"Accounts are not linked"}/>
        }
        <Modal
            title="Account Details"
            open={isModalOpen}
            onCancel={handleCancel}
        >
            <form onSubmit={handleSubmit}>
                <div className='input-div'>
                    <div className="inputContainer">
                        <div className="input-field">
                            <input type="text" name="AccountHolderName" required spellCheck="false" value={EditAccount.AccountHolderName} onChange={(e) => handleChange(e)} />
                            <label><span>*</span>Account Holder Name</label>
                        </div>
                    </div>
                    <div className="inputContainer">
                        <div className="input-field">
                            <input type="text" name="AccountNumber" required spellCheck="false" value={EditAccount.AccountNumber} onChange={(e) => handleChange(e)} />
                            <label><span>*</span>Account Number</label>
                        </div>
                    </div>
                </div>
                <div className='input-div'>
                    <div className="inputContainer">
                        <div className="input-field">
                            <input type="text" name="IFSC_Code" required spellCheck="false" value={EditAccount.IFSC_Code} onChange={(e) => handleChange(e)} />
                            <label><span>*</span>IFSC Code</label>
                        </div>
                    </div>
                    <div className="inputContainer">
                        <div className="input-field">
                            <input type="text" name="Branch_Name" required spellCheck="false" value={EditAccount.Branch_Name} onChange={(e) => handleChange(e)} />
                            <label>Branch Name</label>
                        </div>
                    </div>
                </div>
                <div className='SaveAccountBtn'>
                    <button className='btn'><SaveOutlined /> Save</button>
                </div>
            </form>
        </Modal>
    </>)
}
export default Account;