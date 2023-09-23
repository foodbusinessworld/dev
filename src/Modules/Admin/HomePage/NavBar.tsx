import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../Common/CSS/NavBar.css";
import { CloseOutlined, LogoutOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const Logout = () => {
  localStorage.clear();
  window.location.href = "/"
}
function Navbar() {
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

  const Logout = () => {
    localStorage.clear();
    window.location.href = "/"
  }

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
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Users">Users</Link>
            </li>
            <li>
              <Link to="/Orders/0">Orders</Link>
            </li>
            <li>
              <Link to="/AdminWithdraw">Withdraw</Link>
            </li>
            {/* <li>
              <Link to="/Administrative">Administrative</Link>
            </li> */}
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
