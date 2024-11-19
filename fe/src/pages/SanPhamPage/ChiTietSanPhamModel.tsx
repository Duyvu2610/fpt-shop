import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { ChiTietSanPhamUpdateRequest } from "../../types/types";
import EditableTable from "./EditableTable";
import { baseAxios } from "../../api/axios";

const ChiTietSanPhamModel: React.FC<{
  visible: boolean;
  onClose: () => void;
  data: ChiTietSanPhamUpdateRequest;
}> = ({ visible, onClose, data }) => {
  const [dataSource, setDataSource] = useState<ChiTietSanPhamUpdateRequest>(data);

  useEffect(() => {
    if (!visible) {
      onClose();
    }
  }, [visible, onClose]);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  // Hàm callback để cập nhật dataSource khi EditableTable thay đổi
  const handleTableChange = (newData: any) => {
    setDataSource((prevData) => ({
      ...prevData,
      chiTietSanPhams: newData,
    }));
  };

  const handleSave = async () => {
    try {
      // Giả sử bạn sẽ gửi dữ liệu đã thay đổi
      await baseAxios.post("SanPham/AddChiTietSanPhamFromSanPham", dataSource);
      await baseAxios.post("SanPham/AddAnh", 
        dataSource.chiTietSanPhams.map((item) => ({
          duongDan: item.urlAnh,
          maMau: item.maMau,
          idSanPham: dataSource.idSanPham,
        })),
      );
      onClose(); // Đóng modal sau khi lưu thành công
      
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <Modal
      title="Chi Tiết Sản Phẩm"
      visible={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      {/* Truyền hàm handleTableChange cho EditableTable */}
      <EditableTable data={dataSource.chiTietSanPhams} onDataChange={handleTableChange} />
    </Modal>
  );
};

export default ChiTietSanPhamModel;
