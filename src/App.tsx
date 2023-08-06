import "./App.css";
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   UploadOutlined,
//   UserOutlined,
//   VideoCameraOutlined,
// } from '@ant-design/icons';
import { AiFillSetting, AiOutlineMenuFold } from "react-icons/ai";
import { BsFillHouseExclamationFill } from "react-icons/bs";
import { BsFillPersonFill } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { RiListOrdered, RiShutDownLine } from "react-icons/ri";
import { BiSolidDish } from "react-icons/bi";
import { CgTrending } from "react-icons/cg";
import { Layout, Menu, Button } from "antd";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import DashBoard from "./page/DashBoard";
import Statistics from "./page/Statistics";
import Login from "./page/Login";
import OrderManagement from "./page/OrderManagement";
import SkyLogo from "./assets/Logo.svg";
import DishManagement from "./page/DishManagement";
import CategoryManagement from "./page/CategoryManagement";
import EmployeeManagement from "./page/EmployeeManagement";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Storage/redux/store";
import { userModel } from "./interfaces";
import { useEffect, useState } from "react";
import { emptyUserState, setLoggedInUser } from "./Storage/redux/userAuthSlice";
import { GiHamburgerMenu } from "react-icons/gi";

const { Header, Sider, Content } = Layout;
import type { MenuProps } from "antd";
import { Dropdown, message, Space } from "antd";

import WithAuth from "./HOC/WithAuth";
import PrivateRoute from "./HOC/ProtectedRoute";

const items: MenuProps["items"] = [
  {
    label: "open",
    key: "1",
  },
  {
    label: "close",
    key: "2",
  },
];
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const [status, setStatus] = useState(false);

  function handleSignout() {
    localStorage.removeItem("currentUser");

    dispatch(setLoggedInUser({ ...emptyUserState }));
    navigate("/login");
  }
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  useEffect(() => {
    const localToken = localStorage.getItem("currentUser");
    if (localToken) {
      dispatch(setLoggedInUser(JSON.parse(localToken)));
    }
  }, []);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key == "1") {
      setStatus(true);
      message.info(`restaurant is set in bussiness`);
    } else {
      message.info(`restaurant is set close`);
      setStatus(false);
    }
  };

  return (
    <Layout className="w-full  flex-1 h-screen relative">
      {/* <Routes>
        <Route path="/login" element={<Login />} />
      </Routes> */}
      <Header className="bg-yellow-400 flex items-center space-x-4 ">
        <img src={SkyLogo} alt="foodie-sky" className="w-32 " />

        <div className="flex justify-between border-red-400 w-full items-center">
          <div className="ml-4 flex items-center">
            {/* <AiOutlineMenuFold className="scale-150 " /> */}
            <Button
              type="text"
              icon={
                collapsed ? (
                  <AiOutlineMenuFold className="scale-150 " />
                ) : (
                  <AiOutlineMenuFold className="scale-150 " />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
            />
            {!status && (
              <span className="  h-4  items-center justify-center ml-4  flex space-x-2">
                <span className="w-3 h-3  rounded-full bg-rose-500 shadow-sm shadow-red-500"></span>
                <span
                  className="text-[13px] text-red-500 font-bold"
                  style={{ textShadow: "0,0,2px pink" }}
                >
                  close
                </span>
              </span>
            )}
            {status && (
              <span className="  h-4  items-center justify-center ml-4  flex space-x-2">
                <span className="w-3 h-3  rounded-full bg-green-500 shadow-sm shadow-green-700"></span>
                <span
                  className="text-[13px] text-emerald-600 font-bold"
                  style={{ textShadow: "0,0,2px pink" }}
                >
                  open
                </span>
              </span>
            )}
          </div>
          <div className="md:flex lg:flex items-center space-x-4 hidden ">
            <Dropdown menu={{ items, onClick }}>
              <div className="flex items-center space-x-2 ">
                <AiFillSetting className="scale-[1.5] " />
                <a onClick={(e) => e.preventDefault()}>
                  <Space>status</Space>
                </a>
              </div>
            </Dropdown>

            <div className="flex items-center space-x-2">
              <div className="flex space-x-2 items-center">
                <img
                  src={"https://randomuser.me/api/portraits/men/2.jpg"}
                  className="h-10 w-10 rounded-full border-[3px] border-white"
                />
                <span className="capitalize">{userData.name}</span>
              </div>

              <button onClick={handleSignout}>
                <RiShutDownLine className="scale-[1.25] " />
              </button>
            </div>
          </div>
          <div className="md:hidden lg:hidden absolute right-4">
            <GiHamburgerMenu
              className="scale-[1.5]"
              onClick={() => setIsToggle(!isToggle)}
            />
          </div>
          {isToggle && (
            <div className="md:hidden lg:hidden flex flex-col items-right z-50 fixed top-12 right-4 bg-white p-2 rounded-lg shadow-lg shadow-stone-300">
              <div className="flex items-center space-x-2 w-full justify-end ">
                <AiFillSetting className="scale-[1.5] " />
                <span>status</span>
              </div>
              <div className="flex  space-x-2 w-full justify-end">
                <button onClick={handleSignout}>
                  <RiShutDownLine className="scale-[1.25] " />
                </button>
                <div className="flex space-x-2 items-center">
                  <span className="capitalize">{userData.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Header>

      <Layout className="overflow-x-scroll">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            className="mt-16 space-y-6"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: (
                  <BsFillHouseExclamationFill className="scale-[1.25] font-bold origin-bottom" />
                ),
                label: (
                  <Link to="/dashboard">
                    <span className="font-semibold scale-[1.25] origin-bottom">
                      Dashboard
                    </span>
                  </Link>
                ),
              },
              {
                key: "2",
                icon: (
                  <CgTrending className="scale-[1.25] font-bold origin-bottom" />
                ),
                label: (
                  <Link to="/statistics">
                    <span className="font-semibold scale-y-[1.25] origin-bottom">
                      Statistics
                    </span>
                  </Link>
                ),
              },
              {
                key: "3",
                icon: (
                  <RiListOrdered className="scale-[1.25] font-bold origin-bottom" />
                ),
                label: (
                  <Link to="/ordermanagement">
                    <span className="font-semibold scale-[1.25] origin-bottom">
                      Order
                    </span>
                  </Link>
                ),
              },
              {
                key: "4",
                icon: (
                  <BiSolidDish className="scale-[1.25] font-bold origin-bottom" />
                ),
                label: (
                  <Link to="/dishmanagement">
                    <span className="font-semibold scale-[1.25] origin-bottom">
                      Dish
                    </span>
                  </Link>
                ),
              },
              {
                key: "5",
                icon: (
                  <RxDashboard className="scale-[1.25] font-bold origin-bottom fill-white" />
                ),
                label: (
                  <Link to="/categorymanagement">
                    <span className="font-semibold scale-[1.25] origin-bottom">
                      Category
                    </span>
                  </Link>
                ),
              },
              {
                key: "6",
                icon: (
                  <BsFillPersonFill className="scale-[1.25] font-bold origin-bottom" />
                ),
                label: (
                  <Link to="/employeemanagement">
                    <span className="font-semibold scale-[1.25] origin-bottom">
                      Employee
                    </span>
                  </Link>
                ),
              },
            ]}
          />
        </Sider>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "white",
          }}
          className="overflow-x-scroll"
        >
          <Routes>
            <Route path="/" element={<PrivateRoute component={DashBoard} />} />
            <Route
              path="/dashBoard"
              element={<PrivateRoute component={DashBoard} />}
            />
            <Route
              path="/statistics"
              element={<PrivateRoute component={Statistics} />}
            />
            <Route
              path="/ordermanagement"
              element={<PrivateRoute component={OrderManagement} />}
            />
            <Route
              path="/dishmanagement"
              element={<PrivateRoute component={DishManagement} />}
            />

            <Route
              path="/categorymanagement"
              element={<PrivateRoute component={CategoryManagement} />}
            />
            <Route
              path="/employeemanagement"
              element={<PrivateRoute component={EmployeeManagement} />}
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
