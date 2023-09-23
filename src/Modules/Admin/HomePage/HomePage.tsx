import React from 'react';
import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import Navbar from './NavBar';
import HomePageBody from './HomePageBody';
import Orders from '../Orders';
import Users from '../Users';
import UserReferral from '../UserReferral';
import AdminWithdraw from '../AdminWithdraw';
import Administrative from '../Administrative/Administrative';

const { Header, Content, Footer } = Layout;

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Header className="header">
        <Navbar/>
      </Header>
      <Content>
        <Routes>
          <Route path="/" element={<HomePageBody />} />
          <Route path="/Users" element={<Users />} />
          <Route path="/Orders/:id" element={<Orders />} />
          <Route path="/UserReferral/:id" element={<UserReferral />} />
          <Route path="/AdminWithdraw" element={<AdminWithdraw />} />
          <Route path="/Administrative" element={<Administrative />} />
          
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};

export default HomePage;