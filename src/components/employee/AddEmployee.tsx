import { ArrowLeftOutlined } from "@ant-design/icons";
import { FormEvent, useState } from "react";

import { useNavigate } from "react-router-dom";
import inputHelper from "../../helper/inputHelper";
import { useAddUserMutation } from "../../Apis/userApi";
import { message } from "antd";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [addEmployee] = useAddUserMutation();
  const [isContinue, setContinue] = useState(false);

  const [userInput, setUserInput] = useState({
    name: "",
    username: "",
    phone: "",
    sex: "",
  });
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  console.log(userInput);
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

    setLoading(true);
    await addEmployee(userInput);

    if (isLoading) {
      message.loading("add a new employee");
    }
    setLoading(false);
    if (!isContinue) {
      navigate("/employeemanagement");
      message.success("you have succefully added an new employee");
      return;
    }
    setUserInput({
      name: "",
      username: "",
      phone: "",
      sex: "",
    });
    message.success("you have succefully added an new employee");
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
        <span className="px-4 font-extrabold">Add Employee</span>
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
            className="bg-black py-2 px-4 text-white rounded-md"
            onClick={() => setContinue(false)}
          >
            Save
          </button>
          <button
            type="submit"
            className="bg-yellow-500 py-2 px-4 text-white rounded-md"
            onClick={() => setContinue(true)}
          >
            Save and Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
