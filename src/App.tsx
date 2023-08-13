import "./App.css";
import {
  AiFillSetting,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { BsFillHouseExclamationFill } from "react-icons/bs";
import { BsFillPersonFill } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { RiListOrdered, RiShutDownLine } from "react-icons/ri";
import { BiSolidDish } from "react-icons/bi";
import { CgTrending } from "react-icons/cg";
import { Layout, Menu, Button } from "antd";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import SkyLogo from "./assets/Logo.svg";
import smallSkyLogo from "./assets/smallLogo.svg";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Storage/redux/store";
import { userModel } from "./interfaces";
import { useEffect, useState } from "react";
import { emptyUserState, setLoggedInUser } from "./Storage/redux/userAuthSlice";
import { GiHamburgerMenu } from "react-icons/gi";

const { Header, Sider, Content } = Layout;
import type { MenuProps } from "antd";
import { Dropdown, message, Space } from "antd";

import PrivateRoute from "./HOC/ProtectedRoute";
import useScreenSize from "./helper/useScreenSize";
import {
  CategoryManagement,
  DashBoard,
  DishManagement,
  EmployeeManagement,
  Login,
  OrderManagement,
  Statistics,
} from "./page";
import { useGetWeatherQuery } from "./Apis/weatherApi";
// import AddEmployee from "./components/employee/AddEmployee";
// import { UpdateEmployee } from "./components/employee";
// import { AddCategory, UpdateCategory } from "./components/category";
import {
  AddEmployee,
  UpdateEmployee,
  AddCategory,
  UpdateCategory,
  AddDish,
  UpdateDish,
} from "./components/";
import UploadComponent from "./components/dish/UploadComponent";

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
  const { width } = useScreenSize();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const [status, setStatus] = useState(false);
  const { data, isLoading } = useGetWeatherQuery({});
  const [temp, setTemp] = useState("");
  const [description, setDescription] = useState("");
  const [weatherSrc, setWeatherSrc] = useState("");

  useEffect(() => {
    if (!isLoading && data) {
      setTemp(Math.round(data.main.temp) + "°C");
      setDescription(data.weather[0].main);
      switch (data.weather[0].main) {
        case "Clouds":
          setWeatherSrc("clouds");
          break;
        case "Clear":
          setWeatherSrc("clear");
          break;
        case "Drizzle":
          setWeatherSrc("drizzle");
          break;
        case "Humidity":
          setWeatherSrc("humidity");
          break;
        case "Mist":
          setWeatherSrc("mist");
          break;
        case "Rain":
          setWeatherSrc("rain");
          break;
        case "Snow":
          setWeatherSrc("snow");
          break;
        case "Wind":
          setWeatherSrc("wind");
          break;
        default:
          setWeatherSrc("unknow");
      }
    }
  }, [data]);

  function handleSignout() {
    localStorage.removeItem("currentUser");

    dispatch(setLoggedInUser({ ...emptyUserState }));
    navigate("/login");
    message.info(`system logged out`);
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
  useEffect(() => {
    if (width < 700) {
      setCollapsed(true);
    }
  }, [width]);

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
      <Header className="bg-yellow-400 flex items-center space-x-6 ">
        {!collapsed && <img src={SkyLogo} alt="foodie-sky" className="w-32 " />}
        {collapsed && (
          <img
            src={smallSkyLogo}
            alt="foodie-sky"
            className="w-12 -translate-x-8 "
          />
        )}

        <div className="flex justify-between border-red-400 w-full items-center">
          <div className="flex items-center">
            {/* <AiOutlineMenuFold className="scale-150 " /> */}
            <Button
              type="text"
              icon={
                collapsed ? (
                  <AiOutlineMenuUnfold className="scale-150 -translate-x-10 translate-y-1" />
                ) : (
                  <AiOutlineMenuFold className="scale-150 translate-y-1" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
            />
            {!status &&
              (collapsed ? (
                <span className="  h-4  items-center justify-center ml-4  flex space-x-2 -translate-x-14">
                  <span className="w-3 h-3  rounded-full bg-rose-500 shadow-sm shadow-red-500"></span>
                  <span
                    className="text-[13px] text-red-500 font-bold"
                    style={{ textShadow: "0,0,2px pink" }}
                  >
                    close
                  </span>
                </span>
              ) : (
                <span className="  h-4  items-center justify-center ml-2  flex space-x-2">
                  <span className="w-3 h-3  rounded-full bg-rose-500 shadow-sm shadow-red-500"></span>
                  <span
                    className="text-[13px] text-red-500 font-bold"
                    style={{ textShadow: "0,0,2px pink" }}
                  >
                    close
                  </span>
                </span>
              ))}
            {status &&
              (collapsed ? (
                <span className="  h-4  items-center justify-center ml-4  flex space-x-2 -translate-x-14">
                  <span className="w-3 h-3  rounded-full bg-green-500 shadow-sm shadow-green-700"></span>
                  <span
                    className="text-[13px] text-emerald-600 font-bold"
                    style={{ textShadow: "0,0,2px pink" }}
                  >
                    open
                  </span>
                </span>
              ) : (
                <span className="  h-4  items-center justify-center ml-2  flex space-x-2">
                  <span className="w-3 h-3  rounded-full bg-green-500 shadow-sm shadow-green-700"></span>
                  <span
                    className="text-[13px] text-emerald-600 font-bold"
                    style={{ textShadow: "0,0,2px pink" }}
                  >
                    open
                  </span>
                </span>
              ))}
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
                  src={`https://randomuser.me/api/portraits/men/${userData.id}.jpg`}
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

      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            className="mt-16 space-y-6 "
            // defaultSelectedKeys={["1"]}
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
          <Menu
            theme="dark"
            mode="inline"
            className="mt-24 space-y-6  absolute bottom-4 left-0 right-0  "
            // defaultSelectedKeys={["1"]}

            items={[
              {
                key: "1",
                icon: (
                  <img
                    src={`/weather/${weatherSrc}.png`}
                    alt="description"
                    className="w-6 h-6 absolute top-2 -translate-x-1 "
                  />
                ),
                label: (
                  <div className=" ml-4">
                    <span className="font-semibold space-x-2 origin-bottom flex">
                      <span>{temp}</span>
                      <span>{description}</span>
                    </span>
                  </div>
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
          className="overflow-x-scroll relative"
        >
          <Content
            style={{
              margin: "0px 0px",

              minHeight: 580,
              background: "white",
            }}
            // className="px-8 "
          >
            <div
              style={{
                // background: "white",
                // border: "1px solid black",
                padding: 0,
              }}
              className="flex items-end w-full    bg-stone-100 absolute left-0 right-0 top-0 "
            >
              <h1
                className="font-black text-xl text-gray-600  w-full pb-4  "
                // style={{ textShadow: "3px 3px 1px rgba(0,0,0,0.3)" }}
                // style={{
                //   borderBottom:
                //     location.pathname.includes("dash") ||
                //     location.pathname.includes("statistics")
                //       ? ""
                //       : "4px solid rgba(0,0,0,0.1)",
                // }}
              >
                {location.pathname.includes("dish")
                  ? "DISH MANAGEMENT"
                  : location.pathname.includes("category")
                  ? "CATEGORY MANAGEMENT"
                  : location.pathname.includes("employee")
                  ? "EMPLOYEE MANAGEMENT"
                  : location.pathname.includes("order")
                  ? "ORDER MANAGEMENT"
                  : ""}
              </h1>
            </div>

            <Routes>
              <Route
                path="/"
                element={<PrivateRoute component={DashBoard} />}
              />
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
                path="/dish/new"
                element={<PrivateRoute component={AddDish} />}
              />
              <Route
                path="/dish/:id"
                element={<PrivateRoute component={UpdateDish} />}
              />

              <Route
                path="/categorymanagement"
                element={<PrivateRoute component={CategoryManagement} />}
              />
              <Route
                path="/category/new"
                element={<PrivateRoute component={AddCategory} />}
              />
              <Route
                path="/category/:id"
                element={<PrivateRoute component={UpdateCategory} />}
              />
              <Route
                path="/employeemanagement"
                element={<PrivateRoute component={EmployeeManagement} />}
              />
              <Route
                path="/employee/new"
                element={<PrivateRoute component={AddEmployee} />}
              />
              <Route
                path="/employee/:id"
                element={<PrivateRoute component={UpdateEmployee} />}
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Content>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
