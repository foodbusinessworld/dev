import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../Common/CSS/NavBar.css";
import { AppstoreFilled, AppstoreOutlined, CloseOutlined, DownOutlined, HomeFilled, HomeOutlined, LogoutOutlined, MenuUnfoldOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Dropdown, MenuProps, Space, Tooltip } from "antd";
import { Context } from "../../../App";

const items: MenuProps['items'] = [
  {
    label: (<Link to="/Account">Account</Link>),
    key: '1'
  },
  {
    label: (<Link to="/Orders">Orders</Link>),
    key: '2'
  },
  {
    label: (<Link to="/Referrals">Referrals</Link>),
    key: '3'
  },
  {
    label: (<Link to="/Withdraw">Withdraw</Link>),
    key: '4'
  },
  {
    label: (<Link to="/ChangePassword">Change Password</Link>),
    key: '5'
  }
];
const Logout = () => {
  localStorage.clear();
  window.location.href = "/"
}
function Navbar() {
  const [context, setContext] = useContext<any>(Context);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
    }
  }, [size.width, menuOpen]);

  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
  };

  return (
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__content__logo">
          Logo
        </Link>
        <nav
          className={`${"header__content__nav"} 
          ${menuOpen && size.width < 768 ? `${"isMenu"}` : ""} 
          }`}
        >
          <ul>
            <Tooltip title="Home">
              <li>
                <Link to="/">
                  <span className="icon">
                    <HomeFilled /> 
                  </span>
                  <span className="text">Home</span>
                </Link>
              </li>
            </Tooltip>
            <Tooltip title="Food Invest">
              <li>
                <Link to="/Items">
                  <span className="icon">
                    <AppstoreFilled />  
                  </span>
                  <span className="text">Food Invest</span>
                </Link>
              </li>
            </Tooltip>
            <Tooltip title="Cart">
              <li>
                <Link to="/Cart">
                  <Badge count={context.CartCount}>
                    <span className="icon"><ShoppingCartOutlined /></span>
                  </Badge>
                  <span className="text">Cart</span>
                </Link>
              </li>
            </Tooltip>
            <li>
              <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {/* <UserOutlined />{context.LoginUserName} */}
                    Profile
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </li>
            <li onClick={() => Logout()}>
              <Link to="/">
                <span className="icon">
                  <LogoutOutlined />
                </span>
                <span className="text">Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header__content__toggle">
          {!menuOpen ? (
            <MenuUnfoldOutlined onClick={menuToggleHandler} />
          ) : (
            <CloseOutlined onClick={menuToggleHandler} />
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;