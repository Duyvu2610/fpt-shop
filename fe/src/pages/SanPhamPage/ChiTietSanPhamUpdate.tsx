import React, { useEffect, useState } from "react";
import { Modal, Table, Input, InputNumber, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { baseAxios } from "../../api/axios";
import { ChiTietSanPham, ProductDetail } from "../../types/types";

interface ChiTietSanPhamRequest {
  idChiTietSanPham: string;
  tenMauSac: string;
  maMau: string;
  tenKichCo: string;
  soLuong: number;
  giaBan: number;
}

interface ChiTietSanPhamModelProps {
  visible: boolean;
  onClose: () => void;
  data: string;
  onSave: () => void;
}

const ChiTietSanPhamModelUpdate: React.FC<ChiTietSanPhamModelProps> = ({
  visible,
  onClose,
  data,
  onSave,
}) => {
  const [dataSource, setDataSource] = useState<ChiTietSanPham[]>([]);

  useEffect(() => {
    baseAxios
      .get<ProductDetail>(`/SanPham/GetAllChiTietSanPhamHome?idSanPham=${data}`)
      .then((response) => {
        setDataSource(response.data.chiTietSanPhams);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [data]);

  const handleSave = () => {
    try {
      onSave();
      message.success("Dữ liệu đã được lưu thành công!");
      onClose();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu dữ liệu.");
      console.error("Save error:", error);
    }
  };

  const handleCellChange =
    (key: string, dataIndex: keyof ChiTietSanPham) => (value: any) => {
      const updatedData = dataSource.map((item) =>
        item.id === key ? { ...item, [dataIndex]: value } : item
      );
      setDataSource(updatedData);
    };

  const columns: ColumnsType<ChiTietSanPham> = [
    {
      title: "Tên Sản Phẩm",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Mã Màu",
      dataIndex: "maMau",
      key: "maMau",
      render: (text) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
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
      title: "Tên Kích Cỡ",
      dataIndex: "maKichCo",
      key: "maKichCo",
    },
    {
      title: "Số Lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          onChange={(value) =>
            handleCellChange(record.id, "soLuong")(value)
          }
        />
      ),
    },
    {
      title: "Giá Bán",
      dataIndex: "giaBan",
      key: "giaBan",
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => parseFloat(value!.replace(/,/g, ""))}
          onChange={(value) =>
            handleCellChange(record.id, "giaBan")(value)
          }
        />
      ),
    },
  ];

  return (
    <Modal
      title="Chi Tiết Sản Phẩm"
      visible={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="idChiTietSanPham"
        pagination={false}
      />
    </Modal>
  );
};

export default ChiTietSanPhamModelUpdate;
