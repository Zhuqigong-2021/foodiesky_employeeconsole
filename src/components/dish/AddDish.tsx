import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { FormEvent, useEffect, useState } from "react";
import inputHelper from "../../helper/inputHelper";
import { useNavigate } from "react-router-dom";

import { Input, Select, Upload, message, Modal } from "antd";

import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import axios from "axios";
import { useAddDishMutation } from "../../Apis/dishApi";
import { useGetAllCategoriesQuery } from "../../Apis/categoryApi";

const { TextArea } = Input;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AddDish = () => {
  const [imageToStore, setImageToStore] = useState<any>();
  const { data } = useGetAllCategoriesQuery({});

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [AddDish] = useAddDishMutation();

  const [uploadedImage, setUploadedImage] = useState<UploadFile<any> | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (data) {
      let arr = [];
      arr = data.data.map((item: { id: string; name: string }) => ({
        value: item.id,
        label: item.name,
      }));

      setCategories(arr);
    }
  }, [data]);

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    let file = newFileList[0].originFileObj;
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
        console.log("response", response);
        if ("data" in response) {
          message.success("Image uploaded successfully");
          setSelectedFile(null);
          setImageUrl(response.data.data);
          setImageToStore(response.data.data);
          // Clear selected file
        } else {
          // console.error("Upload error:", response.error);
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
      <div className="flex flex-col absolute left-48 -translate-y-5 items-center space-y-2 text-left border p-2 ">
        <div className="text-left w-full">Image size not exceeding 2MB</div>
        <div className="text-left w-full">Only PNG, JPEG, and JPG allowed</div>
        <div className="text-left w-full">
          Images size recommended 200x200 | 300x300.
        </div>
      </div>
    </div>
  );

  //   const handleImageChange = async (
  //     info: UploadChangeParam<UploadFile<any>>
  //   ) => {
  //     const formData = new FormData();
  //     if (info.file) {
  //       //   formData.append("image", info.file.thumbUrl);
  //       setUploadedImage(info.file);
  //       console.log(info.file);
  //     }

  //     try {
  //       const response = await uploader(formData);

  //       message.success("Image uploaded successfully");
  //     } catch (error) {
  //       console.error("Upload error:", error);
  //       message.error("Image upload failed");
  //     }
  //     // }
  //     // setUploadedImage(info.file);
  //     // console.log(info.file);
  //     // setUploadedImage(info.file);
  //   };

  useEffect(() => {
    if (uploadedImage) {
      setUploadedImage(uploadedImage);
    }
  }, [uploadedImage]);

  // const categories: categoryModel[] = useSelector(
  //   (state: RootState) => state.categoryStore.categories
  // );

  const [userInput, setUserInput] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
    falvour: [],
    image: "",
    status: "0",
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

  useEffect(() => {
    setUserInput({ ...userInput, categoryId: categoryValue, image: imageUrl });
  }, [categoryValue, imageUrl]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!userInput.name) {
      setError("dish name is empty");
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
    if (!imageToStore) {
      setError("you should upload an image");
      return;
    }

    // setLoading(true);

    await AddDish({ ...userInput });
    navigate("/dishmanagement");
    message.success("you have succefully added an new dish");

    setUserInput({
      name: "",
      categoryId: "",
      price: "",
      description: "",
      falvour: [],
      image: "",
      status: "0",
    });
  };

  // const [progress, setProgress] = useState(0);

  // const handleUpload = async (options: any) => {
  //   const { onSuccess, onError, file, onProgress } = options;

  //   const fmData = new FormData();
  //   const config = {
  //     headers: { "content-type": "multipart/form-data" },
  //     token: localStorage.getItem("token"),
  //     onUploadProgress: (event: any) => {
  //       const percent = Math.floor((event.loaded / event.total) * 100);
  //       setProgress(percent);
  //       if (percent === 100) {
  //         setTimeout(() => setProgress(0), 1000);
  //       }
  //       onProgress({ percent: (event.loaded / event.total) * 100 });
  //     },
  //   };
  //   fmData.append("image", file);
  //   try {
  //     const res = await axios.post("/api/admin/common/upload", fmData, config);
  //     setImageUrl(res.data.data);
  //     setImageToStore(res.data.data);
  //     onSuccess("Ok");
  //     message.success("you have uploaded an image successfully");
  //   } catch (err) {
  //     console.log("Eroor: ", err);
  //     message.error("upload failed");
  //     onError({ err });
  //   }
  // };

  return (
    <div className="bg-white py-8">
      <div className="flex items-center">
        <div
          className="flex space-x-2 items-center border-r px-4 "
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined /> <span>Back</span>
        </div>
        <span className="px-4 font-extrabold">Add Dish</span>
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
              // className="min-w-96"
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
          <Upload
            // customRequest={handleUpload}
            listType="picture-card"
            fileList={fileList}
            accept="image/*"
            beforeUpload={() => false}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
            {/* {progress > 0 ? <Progress percent={progress} /> : null} */}
          </Upload>

          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
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

export default AddDish;
