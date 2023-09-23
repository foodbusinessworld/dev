import React, { useContext, useEffect } from 'react';
import { Layout } from 'antd';
import ItemsList from '../Items/ItemsList';
import { Route, Routes } from 'react-router-dom';
import HomePageBody from './HomePageBody';
import Cart from '../Cart/Cart';
import Profile from '../Profile/ChangePassword';
import Navbar from './NavBar';
import ChangePassword from '../Profile/ChangePassword';
import Account from '../Profile/Account';
import Orders from '../Profile/Orders';
import Referrals from '../Profile/Referral';
import CartCount from '../../../Common/ContextStore/CartCount';
import { Context } from '../../../App';
import Withdraw from '../Profile/Withdraw';

const { Header, Content, Footer } = Layout;

const HomePage: React.FC = () => {
  const [context, setContext] = useContext<any>(Context);
  const GetCartData = async() => {
    let GetCartCountEntity = {
      UserID: context.LoginUserID
    }
    var count = await CartCount(GetCartCountEntity);
    setContext((prevState: any) => ({
      ...prevState,
      CartCount: count
    }));
    setTimeout(() => {
      localStorage.setItem('UserData', JSON.stringify(context));
    }, 500)
  }
  useEffect(() => {
    GetCartData();
  }, [])
  return (
    <Layout>
      <Header className="header">
        <Navbar />
      </Header>
      <Content>
        <Routes>
          <Route path="/" element={<HomePageBody />} />
          <Route path="/Items" element={<ItemsList />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/Referrals" element={<Referrals />} />
          <Route path="/Withdraw" element={<Withdraw />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};

export default HomePage;