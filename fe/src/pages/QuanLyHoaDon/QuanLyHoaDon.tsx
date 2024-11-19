import React, { useState, useEffect } from "react";
import { Table, Pagination } from "antd";
import axios from "axios"; // Sử dụng axios để gọi API
import { HoaDon } from "../../types/types";

const HoaDonTable: React.FC = () => {
  const [hoaDons, setHoaDons] = useState<HoaDon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://localhost:7095/api/HoaDon/GetAllHDQly`, {
        }
      );
      const data = response.data;  // Giả sử API trả về dữ liệu dạng này
      setHoaDons(data);  // Lấy danh sách hóa đơn
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Lấy dữ liệu khi component render lần đầu
  }, []);

  const columns = [
    {
      title: "Mã Hóa Đơn",
      dataIndex: "maHD",
      key: "maHD",
    },
    {
      title: "Thời Gian",
      dataIndex: "thoiGian",
      key: "thoiGian",
    },
    {
      title: "Khách Hàng",
      dataIndex: "khachHang",
      key: "khachHang",
    },
    {
      title: "SĐT Khách Hàng",
      dataIndex: "sdtkh",
      key: "sdtkh",
      render: (text: string | null) => text || "N/A",
    },
    {
      title: "SĐT Nhận Hàng",
      dataIndex: "sdTnhanhang",
      key: "sdTnhanhang",
    },
    {
      title: "Tổng Tiền Hàng",
      dataIndex: "tongTienHang",
      key: "tongTienHang",
      render: (text: number) => text.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Khách Đã Trả",
      dataIndex: "khachDaTra",
      key: "khachDaTra",
      render: (text: number) => text.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "pttt",
      key: "pttt",
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text: number) => (text === 1 ? "Đã Thanh Toán" : "Chưa Thanh Toán"),
    },
    {
      title: "Loại Hóa Đơn",
      dataIndex: "loaiHD",
      key: "loaiHD",
      render: (text: number) => (text === 1 ? "Hóa Đơn Bán" : "Hóa Đơn Mua"),
    },
  ];

  return (
    <div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={hoaDons}
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default HoaDonTable;
