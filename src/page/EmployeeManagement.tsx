import { Badge, Space, Table, message, Spin } from "antd";
import Button from "antd/lib/button";
import QueueAnim from "rc-queue-anim";
import type { ColumnsType } from "antd/es/table";
import {
  useBlockUserMutation,
  useEnableUserMutation,
  useGetUsersQuery,
} from "../Apis/userApi";
import {
  EditOutlined,
  LockOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeManagement = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Default page size
  });
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: userdata, isLoading } = useGetUsersQuery({
    name: search,
    page: pagination.current,
    pageSize: pagination.pageSize,
  });

  const [blockUser] = useBlockUserMutation();
  const [enableUser] = useEnableUserMutation();
  const [total, setTotal] = useState(0);
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    if (userdata) {
      setTotal(Number(userdata.apiResponse.data.total));
      setEmployeeData(userdata.apiResponse.data.records);
      console.log(employeeData);
    }
  }, [userdata, search, pagination]);

  useEffect(() => {
    console.log(search);
  }, [search]);

  const handleBlock = async (userId: string) => {
    try {
      await blockUser({ id: userId });
    } catch (err) {
      console.log(err);
      console.log("there is err");

      return;
    }

    message.error("you have block the user");
  };
  const handleEnable = async (userId: string) => {
    await enableUser({ id: userId });
    message.success("you have enable the user");
  };

  interface DataType {
    key: string;
    id: number;
    name: string;
    username: string;
    phonenumber: string;
    status: string;
    lastTime: string;
  }

  const columns: ColumnsType<DataType> = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        if (!record.status) {
          return <Badge status="error" text="locked" />;
        } else {
          return <Badge status="success" text="active" />;
        }
      },
    },

    {
      title: "Last time",
      key: "updateTime",
      dataIndex: "updateTime",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>
            <EditOutlined
              className="bg-indigo-400 p-2 rounded-lg text-white"
              onClick={() => navigate(`/employee/${record.id}`)}
            />
          </a>
          <a>
            {record.status ? (
              <LockOutlined
                className="bg-rose-400 p-2 rounded-lg text-white"
                onClick={() => handleBlock(String(record.id))}
              />
            ) : (
              <button>
                <UnlockOutlined
                  className="bg-teal-500 p-2 rounded-lg text-white"
                  onClick={() => handleEnable(String(record.id))}
                />
              </button>
            )}
          </a>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const rangeStart = (pagination.current - 1) * pagination.pageSize + 1;
  const rangeEnd = Math.min(rangeStart + pagination.pageSize - 1, total);
  return (
    <div className="py-10 ">
      {isLoading && (
        <div className="flex-1 flex justify-center items-center h-[50vh]">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <div>
          <div className="relative flex justify-between mb-4 mx-4 items-center w-full min-w-[465px]">
            <div className="flex space-x-2 items-center ">
              <span className="font-bold">name:</span>
              <div className="relative flex space-x-2">
                <input
                  type="text"
                  className="px-2 border border-gray-100"
                  placeholder="search..."
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="absolute right-0 top-0 bottom-2">
                  <SearchOutlined className="h-full" />
                </button>
              </div>
            </div>
            <button
              className="bg-yellow-500 text-white rounded-lg px-3 mx-4 py-1 absolute right-0"
              onClick={() => navigate("/employee/new")}
            >
              +Add employee
            </button>
          </div>

          <Table
            columns={columns}
            rowKey="id"
            dataSource={employeeData}
            onChange={handleTableChange}
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "30"],
              position: ["bottomCenter"],
              // onChange={pageSize=>(setPageSize(size))},
              total: total,
              showTotal: (total) => {
                return (
                  <div className="flex space-x-2">
                    Showing {rangeStart}-{rangeEnd} of {total} items
                  </div>
                );
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
