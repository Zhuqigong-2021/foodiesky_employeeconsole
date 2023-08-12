import {
  Badge,
  Space,
  Table,
  message,
  Spin,
  Popconfirm,
  Divider,
  Checkbox,
  Select,
  Input,
  Button,
} from "antd";

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
import {
  useBlockDishMutation,
  useDeleteBulkDishMutation,
  useEnableDishMutation,
  useGetDishesQuery,
} from "../Apis/dishApi";
import apiResponse from "../interfaces/apiResponse";
import { useDispatch } from "react-redux";
import { setCurrentCategoriesArr } from "../Storage/redux/categorySlice";

const DishManagement: React.FC = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Default page size
  });
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [finalCategoryData, setFinalCategoryData] = useState([]);
  const { data: dishData, isLoading } = useGetDishesQuery({
    name: search,
    page: pagination.current,
    pageSize: pagination.pageSize,
    categoryId: categoryId ? categoryId : "",
    status: status,
  });
  const { data: categoryData } = useGetCategoriesQuery({
    page: pagination.current,
    pageSize: categoryTotal ? categoryTotal : pagination.pageSize,
    type: "1",
  });

  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteBulkDishes] = useDeleteBulkDishMutation();
  const [blockDish] = useBlockDishMutation();
  const [enableDish] = useEnableDishMutation();
  const [total, setTotal] = useState(0);
  const [ids, setIds] = useState("");

  const [categoriesData, setCategoriesData] = useState([]);

  const cancel = (e: React.MouseEvent<HTMLElement> | undefined) => {
    e?.preventDefault();
    message.error("Click on No");
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      setIds(`${selectedRowKeys}`);
    },
  };

  useEffect(() => {
    if (dishData) {
      setTotal(Number(dishData.apiResponse.data.total));
      setCategoriesData(dishData.apiResponse.data.records);
    }
  }, [dishData, search, pagination]);

  useEffect(() => {
    if (categoryData) {
      setCategoryTotal(Number(categoryData.apiResponse.data.total));

      let arr = [];
      arr = categoryData.apiResponse.data.records;
      setFinalCategoryData(
        arr.map((item: { id: any; name: any }) => ({
          value: item.id,
          label: item.name,
        }))
      );

      // { value: "14", label: "update " },
    }
  }, [categoryData]);

  useEffect(() => {
    if (finalCategoryData) {
      dispatch(setCurrentCategoriesArr(finalCategoryData));
    }
  }, [finalCategoryData]);

  // useEffect(() => {
  //   console.log(search);
  // }, [search]);

  const handleBlock = async (userId: string) => {
    try {
      await blockDish({ id: userId });
    } catch (err) {
      // console.log(err);
      // console.log("there is err");

      return;
    }

    message.error("you stop selling this dish");
  };
  const handleEnable = async (id: string) => {
    await enableDish({ id: id });
    message.success("you put this dish on sale");
  };

  const handleDelete = async (ids: string) => {
    if (!ids) {
      message.error("No dish is selected");
      return;
    }

    const response: apiResponse = await deleteBulkDishes(ids);
    if (response.data) {
      if (response.data.msg) {
        message.error(response.data.msg);
        return;
      } else {
        message.success("you have succefull deleted dish/dishes");
      }
    }
  };

  interface DataType {
    key: React.Key;
    id: number;
    name: string;
    image: string;
    category: string;
    price: string;
    // type: string;
    // sort: string;
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
      title: "Dish Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text: string) => (
        <img src={text} alt="img" className="h-10 w-10" />
      ),
    },
    {
      title: "Dish Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text: string) => <a>{text}</a>,
    },
    // {
    //   title: "Type",
    //   dataIndex: "type",
    //   key: "type",
    //   render: (text: string) => <a>{text == "1" ? "dish" : "others"}</a>,
    // },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text: string) => <a>${text}</a>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        if (!record.status) {
          return <Badge status="error" text="offline" />;
        } else {
          return <Badge status="success" text="online" />;
        }
      },
    },

    {
      title: "Last Change Time",
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
  const handleDishCategoryChange = (value: string) => {
    setCategoryId(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
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
            <div className="flex items-center space-x-4  ">
              <div className="flex space-x-2 items-center ">
                <span className="font-bold ">Dish:</span>
                <Input
                  placeholder="search dish name.."
                  // className="min-w-96"
                  style={{ minWidth: 100 }}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* <div className="relative flex space-x-2">
                  <input
                    type="text"
                    className="px-2 border border-gray-100"
                    placeholder="search..."
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="absolute right-0 top-0 bottom-2">
                    <SearchOutlined className="h-full" />
                  </button>
                </div> */}
              </div>
              <div className="flex space-x-2 items-center ">
                <span className="font-bold">Dish Category:</span>
                <Select
                  defaultValue="all"
                  style={{ width: 180 }}
                  onChange={handleDishCategoryChange}
                  options={
                    [{ value: "", label: "all" }, ...finalCategoryData]
                    //   [
                    //   { value: "14", label: "update " },
                    //   { value: "lucy", label: "Lucy" },
                    //   { value: "Yiminghe", label: "yiminghe" },
                    //   { value: "disabled", label: "Disabled", disabled: true },
                    // ]
                  }
                />
              </div>

              <div className="flex space-x-2 items-center ">
                <span className="font-bold">Status:</span>
                <Select
                  defaultValue="all"
                  style={{ width: 120 }}
                  onChange={handleStatusChange}
                  options={[
                    { value: "1", label: "online" },
                    { value: "0", label: "offline" },
                    { value: "", label: "all" },
                  ]}
                />
              </div>
            </div>
            <Button
              // type="primary"
              className="bg-rose-400 hover:bg-rose-600 text-white border-none hover:text-white-300 mx-4"
              onClick={() => handleDelete(ids)}
            >
              Bulk deletion
            </Button>

            <Button
              // type="primary"
              className="bg-yellow-500 hover:bg-yellow-600 text-white border-none hover:text-red-300 mx-4"
              onClick={() => navigate("/dish/new")}
            >
              +Add dish category
            </Button>
          </div>
          <Divider />
          <Table
            style={{ width: "100%" }}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
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

export default DishManagement;
