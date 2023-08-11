import { ArrowLeftOutlined } from "@ant-design/icons";
import { FormEvent, useEffect, useState } from "react";
import inputHelper from "../../helper/inputHelper";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery, useUpdateUserMutation } from "../../Apis/userApi";
import { message } from "antd";

const UpdateEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState("");
  const { data, isLoading } = useGetUserQuery({ id });
  // const [userData, setUserData] = useState();
  const [updateEmployee] = useUpdateUserMutation();

  const [userInput, setUserInput] = useState({
    name: "",
    username: "",
    phone: "",
    sex: "",
  });
  useEffect(() => {
    if (data) {
      // setUserData(data.data);
      setUserInput({
        name: data.data.name,
        username: data.data.username,
        phone: data.data.phone,
        sex: data.data.sex,
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
      setError("name is empty");
      return;
    }
    if (!userInput.username) {
      setError("username is empty");
      return;
    }
    if (!userInput.phone) {
      setError("phone number is empty");
      return;
    }
    if (!userInput.sex) {
      setError("you should choose a gender");
      return;
    }

    // setLoading(true);
    await updateEmployee({ id, ...userInput });
    navigate("/employeemanagement");
    message.success("you have succefully added an new employee");

    setUserInput({
      name: "",
      username: "",
      phone: "",
      sex: "",
    });
  };

  return (
    <div className="bg-white py-8">
      <div className="flex items-center">
        <div
          className="flex space-x-2 items-center border-r px-4 "
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined /> <span>Back</span>
        </div>
        <span className="px-4 font-extrabold">Update Employee</span>
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
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            className="py-1 border max-w-lg rounded-md"
            value={userInput.username}
            onChange={handleUserInput}
          />
        </div>

        <div className="flex flex-col  space-y-2">
          <label htmlFor="phone">Phone number:</label>
          <input
            type="phone"
            id="phone"
            name="phone"
            className="py-1 border max-w-lg rounded-md"
            value={userInput.phone}
            onChange={handleUserInput}
          />
        </div>

        <div>
          <p className="mb-4">gender:</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <input
                type="radio"
                id="html"
                name="sex"
                value="1"
                checked={userInput.sex == "1"}
                onChange={handleUserInput}
              />
                <label htmlFor="html">male</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="radio"
                id="female"
                name="sex"
                value="2"
                checked={userInput.sex == "2"}
                onChange={handleUserInput}
              />
                <label htmlFor="female">female</label>
            </div>
          </div>
          <div className="text-red-500 mt-5">{error && error}</div>
        </div>

        <div className="flex flex-col md:flex-row lg:flex-row lg:space-x-4 md:space-x-4 space-x-0 space-y-4 md:space-y-0 lg:space-y-0 w-full justify-center border-t py-4 ">
          <button
            className="border py-2 px-4 rounded-md"
            onClick={() => navigate("/employeemanagement")}
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

export default UpdateEmployee;
