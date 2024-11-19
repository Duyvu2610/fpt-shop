import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadChangeParam } from "antd/es/upload";

interface CloudinaryUploadProps {
  cloudName: string;
  uploadPreset: string;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ cloudName, uploadPreset }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: RcFile): boolean => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isImage && isLt2M;
  };

  const handleUpload = async (info: UploadChangeParam) => {
    const file = info.file.originFileObj as RcFile;
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        message.success("Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      message.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="uploaded" style={{ width: "100%" }} />
        ) : (
          <Button icon={<UploadOutlined />} loading={loading}>
            Upload Image
          </Button>
        )}
      </Upload>
      {imageUrl && (
        <div style={{ marginTop: 16 }}>
          <strong>Image URL:</strong> <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
