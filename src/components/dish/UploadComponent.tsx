import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { useUploadImageMutation } from "../../Apis/commonApi";
import { RcFile } from "antd/es/upload";
import axios from "axios";

const UploadComponent = () => {
  const [uploadFile, { isLoading }] = useUploadImageMutation();

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append("file", file as RcFile);
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
    };
    try {
      const response = await axios.post(
        "/api/admin/common/upload",
        formData,
        config
      );

      if ("data" in response) {
        message.success("Upload successful");
        onSuccess();
      } else if ("error" in response) {
        message.error("Upload failed");
        // onError(response.error);
      }
    } catch (error) {
      message.error("An error occurred during upload");
      onError(error);
    }
  };
  const handleChange = (info: { file: any }) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Upload customRequest={customRequest} onChange={handleChange}>
      <Button icon={<UploadOutlined />} loading={isLoading}>
        Click to Upload
      </Button>
    </Upload>
  );
};

export default UploadComponent;
