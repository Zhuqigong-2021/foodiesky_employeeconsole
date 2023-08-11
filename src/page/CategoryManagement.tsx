import {
  Badge,
  Space,
  Table,
  message,
  Spin,
  Popconfirm,
  Divider,
  Input,
} from "antd";
import Button from "antd/lib/button";
import QueueAnim from "rc-queue-anim";
import type { ColumnsType } from "antd/es/table";

import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useBlockCategoryMutation,
  useDeleteCategoryMutation,
  useEnableCategoryMutation,
  useGetCategoriesQuery,
} from "../Apis/categoryApi";

const CategoryManagement: React.FC = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Default page size
  });
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: categoryData, isLoading } = useGetCategoriesQuery({
    name: search,
    page: pagination.current,
    pageSize: pagination.pageSize,
    type: "1",
  });
  const [deleteCategory] = useDeleteCategoryMutation();
  const [blockUser] = useBlockCategoryMutation();
  const [enableUser] = useEnableCategoryMutation();
  const [total, setTotal] = useState(0);
  const [categoriesData, setCategoriesData] = useState([]);

  const cancel = (e: React.MouseEvent<HTMLElement> | undefined) => {
    e?.preventDefault();
    message.error("Click on No");
  };

  useEffect(() => {
    if (categoryData) {
      setTotal(Number(categoryData.apiResponse.data.total));
      setCategoriesData(categoryData.apiResponse.data.records);
      console.log(setCategoriesData);
    }
  }, [categoryData, search, pagination]);

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

    message.error("you have block this category");
  };
  const handleEnable = async (userId: string) => {
    await enableUser({ id: userId });
    message.success("you have enable this category");
  };

  const handleDelete = async (id: string) => {
    message.success("Click on Yes");
    await deleteCategory(id);
    message.success("you have delete this category");
  };

  interface DataType {
    key: string;
    id: number;
    name: string;
    type: string;
    sort: string;
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
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    // {
    //   title: "Type",
    //   dataIndex: "type",
    //   key: "type",
    //   render: (text: string) => <a>{text == "1" ? "dish" : "others"}</a>,
    // },
    {
      title: "Sort",
      dataIndex: "sort",
      key: "sort",
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
              onClick={() => navigate(`/category/${record.id}`)}
            />
          </a>

          <a>
            <Popconfirm
              title="Delete task"
              description={() => (
                <div className="max-w-[180px]">
                  Are you sure to delete{" "}
                  <span className="font-bold text-red-500">{record.name} </span>
                  category
                </div>
              )}
              onConfirm={() => handleDelete(String(record.id))}
              onCancel={cancel}
              okType="default"
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined
                className="bg-fuchsia-300 p-2 rounded-lg text-white"
                // onClick={() => handleDelete(String(record.id))}
              />
            </Popconfirm>
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
              <span className="font-bold">Category:</span>
              <div className="relative flex space-x-2">
                {/* <input
                  type="text"
                  className="px-2 border border-gray-100"
                  placeholder="search..."
                  onChange={(e) => setSearch(e.target.value)}
                /> */}
                <Input
                  placeholder="search category.."
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="absolute right-0 top-0 p-1">
                  <SearchOutlined className="h-full" />
                </button>
              </div>
            </div>
            {/* <button
              className="bg-yellow-500 text-white rounded-md mx-4 px-2 py-1 absolute right-0"
              onClick={() => navigate("/category/new")}
            >
              +Add dish category
            </button> */}
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white border-none hover:text-red-300 mx-4"
              onClick={() => navigate("/category/new")}
            >
              +Add dish category
            </Button>
          </div>
          <Divider />
          <Table
            columns={columns}
            rowKey="id"
            dataSource={categoriesData}
            onChange={handleTableChange}
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "30"],
              position: ["bottomCenter"],
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

export default CategoryManagement;
