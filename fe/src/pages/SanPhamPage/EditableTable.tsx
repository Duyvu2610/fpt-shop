import React, { useEffect, useState } from "react";
import { Table, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import { ChiTietSanPhamRequest } from "../../types/types";
import EditableCell from "./EditableCell";

interface EditableTableProps {
  data: ChiTietSanPhamRequest[];
  onDataChange: (newData: any) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ data, onDataChange }) => {
  const [dataSource, setDataSource] = useState(data);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const handleSave = (row: ChiTietSanPhamRequest) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.idChiTietSanPham === item.idChiTietSanPham);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    onDataChange(newData);
  };

  const handleUpload = async (file: RcFile, record: ChiTietSanPhamRequest) => {
    const cloudName = "dnp8wwi3r"; // Thay bằng cloud name của bạn
    const uploadPreset = "images"; // Thay bằng upload preset của bạn

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
        const newData = dataSource.map((item) =>
          item.idChiTietSanPham === record.idChiTietSanPham
            ? { ...item, imageUrl: data.secure_url, urlAnh: data.secure_url }
            : item
        );
        setDataSource(newData);
        onDataChange(newData);
        message.success("Upload ảnh thành công!");
      }
    } catch (error) {
      message.error("Upload ảnh thất bại!");
    }
  };

  const columns = [
    {
      title: "Tên Màu Sắc",
      dataIndex: "tenMauSac",
      key: "tenMauSac",
    },
    {
      title: "Mã Màu",
      dataIndex: "maMau",
      key: "maMau",
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-block",
              width: "16px",
              height: "16px",
              backgroundColor: text,
              border: "1px solid #000",
            }}
          ></span>
          {text}
        </div>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text: string, record: ChiTietSanPhamRequest) => (
        <div>
          {text ? (
            <img src={text} alt="product" style={{ width: 100, height: 100 }} />
          ) : (
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleUpload(file, record);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
            </Upload>
          )}
        </div>
      ),
    },
    {
      title: "Tên Kích Cỡ",
      dataIndex: "tenKichCo",
      key: "tenKichCo",
    },
    {
      title: "Số Lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      editable: true,
    },
    {
      title: "Giá Bán",
      dataIndex: "giaBan",
      key: "giaBan",
      editable: true,
      render: (text: number) => text.toLocaleString("vi-VN") + " VND",
    },
  ];

  const edit = (key: string) => {
    setEditingKey(key);
  };

  // Hàm để lưu giá trị chỉnh sửa
  const save = async (key: string) => {
    const row = dataSource.find((item: any) => key === item.idChiTietSanPham);
    if (row) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.idChiTietSanPham);
      if (index > -1) {
        newData[index] = { ...row };
        setDataSource(newData);
        // Thông báo lại sự thay đổi dữ liệu cho chi tiết sản phẩm
        onDataChange(newData);
        setEditingKey(null);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setDataSource(data);
    }
  }, [data]);

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: ChiTietSanPhamRequest) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Table
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      bordered
      dataSource={dataSource}
      columns={mergedColumns}
      rowClassName="editable-row"
      pagination={false}
    />
  );
};

export default EditableTable;
