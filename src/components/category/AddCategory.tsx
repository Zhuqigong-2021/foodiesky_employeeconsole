import { ArrowLeftOutlined } from "@ant-design/icons";
import { FormEvent, useEffect, useState } from "react";
import inputHelper from "../../helper/inputHelper";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery } from "../../Apis/userApi";
import { message } from "antd";
import { useAddCategoryMutation } from "../../Apis/categoryApi";

const AddCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState("");
  const { data, isLoading } = useGetUserQuery({ id });
  // const [userData, setUserData] = useState();
  const [AddCategory] = useAddCategoryMutation();

  const [userInput, setUserInput] = useState({
    name: "",
    type: "",
    sort: "",
  });
  useEffect(() => {
    if (data) {
      // setUserData(data.data);
      setUserInput({
        name: data.data.name,
        type: data.data.type,
        sort: data.data.sort,
      });
    }
  }, [data]);
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    if (!userInput.name) {
      setError("category name is empty");
      return;
    }
    // if (!userInput.type) {
    //   setError("type is empty");
    //   return;
    // }
    if (!userInput.sort) {
      setError("sort is empty");
      return;
    }
    if (!userInput.type) {
      setError("you should choose a type");
      return;
    }

    // setLoading(true);
    await AddCategory({ id, ...userInput });
    navigate("/categorymanagement");
    message.success("you have succefully added an new category");

    setUserInput({
      name: "",
      type: "",
      sort: "",
    });
  };

  return (
    <div className="bg-white">
      <div className="flex items-center">
        <div
          className="flex space-x-2 items-center border-r px-4 "
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined /> <span>Back</span>
        </div>
        <span className="px-4 font-extrabold">Add Category</span>
      </div>
      <form
        action=""
        className="px-10 flex  flex-col space-y-8 py-4 w-full  my-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col space-y-2">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="py-1 border max-w-lg rounded-md"
            value={userInput.name}
            onChange={handleUserInput}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="username">Sort:</label>
          <input
            type="number"
            id="username"
            name="sort"
            className="py-1 border max-w-lg rounded-md"
            value={userInput.sort}
            onChange={handleUserInput}
          />
        </div>

        <div>
          <p className="mb-4">Type:</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <input
                type="radio"
                id="html"
                name="type"
                value="1"
                checked={userInput.type == "1"}
                onChange={handleUserInput}
              />
                <label htmlFor="html">1. Dish</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="radio"
                id="female"
                name="type"
                value="2"
                checked={userInput.type == "2"}
                onChange={handleUserInput}
              />
                <label htmlFor="female">2. Others</label>
            </div>
          </div>
          <div className="text-red-500 mt-5">{error && error}</div>
        </div>

        <div className="flex flex-col md:flex-row lg:flex-row lg:space-x-4 md:space-x-4 space-x-0 space-y-4 md:space-y-0 lg:space-y-0 w-full justify-center border-t py-4 ">
          <button
            className="border py-2 px-4 rounded-md"
            onClick={() => navigate("/categorymanagement")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-yellow-500 py-2 px-4 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
