import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { FormEvent, useEffect, useState } from "react";
import inputHelper from "../../helper/inputHelper";
import { useNavigate, useParams } from "react-router-dom";

import { Input, Select, Upload, message, Modal } from "antd";

import {} from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import { useGetDishQuery, useUpdateDishMutation } from "../../Apis/dishApi";
import axios from "axios";
import { useGetAllCategoriesQuery } from "../../Apis/categoryApi";

const { TextArea } = Input;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UpdateDish = () => {
  const [imageToStore, setImageToStore] = useState<any>();

  const navigate = useNavigate();

  const { id } = useParams();
  const [error, setError] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [updateDish] = useUpdateDishMutation();

  const { data } = useGetDishQuery({ id });
  //   const [dishData, setDishData] = useState();
  //   const categories = useSelector(
  //     (state: RootState) => state.category.categories
  //     );
  const [uploadedImage, setUploadedImage] = useState<UploadFile<any> | null>(
    null
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { data: allCategories } = useGetAllCategoriesQuery({});
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (allCategories) {
      let arr = [];
      arr = allCategories.data.map((item: { id: string; name: string }) => ({
        value: item.id,
        label: item.name,
      }));

      setCategories(arr);
    }
  }, [allCategories]);

  useEffect(() => {
    if (data && id) {
      setUserInput({
        id: id,
        name: data.data.name,
        categoryId: data.data.categoryId,
        price: data.data.price,
        description: data.data.description,
        image: data.data.image,
        flavour: [],
      });
    }
  }, [data]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      if (data) {
        setPreviewImage(data.data.image);
      } else {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
    }
    // const response = await uploader(formData);
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    let file = newFileList[0]?.originFileObj;
    setSelectedFile(file as File);
    if (!file) {
      message.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
    };

    try {
      if (formData) {
        const response = await axios.post(
          "/api/admin/common/upload",
          formData,
          config
        );

        if (response.data) {
          console.log("Upload success:", response.data);
          setImageToStore(response.data.data);

          message.success("Image uploaded successfully");
          setSelectedFile(null); // Clear selected file
        } else {
          message.error("Image upload failed");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
    }
  };

  const uploadButton = (
    <div className="flex space-x-2">
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
      {/* <div className="flex flex-col absolute left-72 -translate-y-5 items-center space-y-2 text-left border p-2 ">
        <div className="text-left w-full">Image size not exceeding 2MB</div>
        <div className="text-left w-full">Only PNG, JPEG, and JPG allowed</div>
        <div className="text-left w-full">
          Images size recommended 200x200 | 300x300.
        </div>
      </div> */}
    </div>
  );

  useEffect(() => {
    if (uploadedImage) {
      setUploadedImage(uploadedImage);
    }
  }, [uploadedImage]);

  const [userInput, setUserInput] = useState({
    id: "",
    name: "",
    categoryId: "",
    price: "",
    description: "",
    flavour: [],
    image: "",
  });

  const handleUserInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleDishCategoryChange = (value: string) => {
    setCategoryValue(value);
  };
  //   useEffect(() => {
  //     console.log(userInput);
  //   }, [userInput]);
  useEffect(() => {
    if (imageToStore) {
      setUserInput({ ...userInput, image: imageToStore });
    }
    if (categoryValue) {
      setUserInput({ ...userInput, categoryId: categoryValue });
    }
  }, [categoryValue, imageToStore]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!userInput.name) {
      setError("category name is empty");
      return;
    }
    if (!userInput.categoryId) {
      setError("category is empty");
      return;
    }
    if (!userInput.price) {
      setError("price is empty");
      return;
    }
    if (!userInput.description) {
      setError("you should input some description");
      return;
    }
    if (!imageToStore && !userInput.image) {
      setError("you should upload an image");
      return;
    }

    // setLoading(true);
    console.log(userInput);
    await updateDish({ ...userInput });
    navigate("/dishmanagement");
    message.success("you have succefully updated an new dish");

    setUserInput({
      id: "",
      name: "",
      categoryId: "",
      price: "",
      description: "",
      flavour: [],
      image: "",
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
        <span className="px-4 font-extrabold">Update Dish</span>
      </div>
      <form
        action=""
        className="px-10 flex  flex-col space-y-8 py-4 w-full  my-4"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center space-x-20  ">
          <div className="flex flex-col space-y-2">
            <label htmlFor="name">Name:</label>

            <Input
              placeholder="search dish name.."
              name="name"
              value={userInput.name}
              style={{ width: "260px" }}
              onChange={handleUserInput}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="name">Dish Category:</label>

            <Select
              defaultValue=" "
              //   name="category"
              style={{ width: 200 }}
              value={userInput.categoryId}
              onChange={handleDishCategoryChange}
              options={[...categories]}
            />
          </div>
        </div>
        <div className="flex items-center ">
          <div className="flex flex-col space-y-2">
            <label htmlFor="username">Price:</label>

            <Input
              placeholder="search dish name.."
              type="number"
              name="price"
              value={userInput.price}
              style={{ width: "260px" }}
              onChange={handleUserInput}
            />
          </div>
        </div>
        <div className="flex  ">
          {!fileList.length && (
            <img
              src={data?.data.image}
              alt=""
              className="h-24 w-24 rounded-lg mr-4 "
            />
          )}
          <Upload
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            // showUploadList={false}
            beforeUpload={() => false}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{ width: "100%" }}
              src={previewImage}
              className="m-2"
            />
          </Modal>
        </div>

        <div className="flex  items-center justify-start space-x-2 ">
          <div className="flex flex-col space-y-2">
            <label htmlFor="username">Description:</label>
            <TextArea
              placeholder="give this dish description.."
              name="description"
              value={userInput.description}
              rows={4}
              className="w-96"
              onChange={handleUserInput}
            />
          </div>
        </div>

        <div className="text-red-500 mt-5">{error && error}</div>
        <div className="flex flex-col md:flex-row lg:flex-row lg:space-x-4 md:space-x-4 space-x-0 space-y-4 md:space-y-0 lg:space-y-0 w-full justify-center border-t py-4 ">
          <button
            className="border py-2 px-4 rounded-md"
            onClick={() => navigate("/dishmanagement")}
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

export default UpdateDish;
