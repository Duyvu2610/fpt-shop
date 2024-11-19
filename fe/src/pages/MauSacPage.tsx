import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Tag, Select } from 'antd';
import axios from 'axios';
import { baseAxios } from '../api/axios';
import { MauSac } from '../types/types';

const MauSacPage: React.FC = () => {
  const [data, setData] = useState<MauSac[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editingColor, setEditingColor] = useState<MauSac | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<MauSac[]>([]);
  const [newColor, setNewColor] = useState<MauSac>({ id: '', ten: '', ma: '#000000', trangThai: 1, chiTietSanPhams: null, anhs: null });

  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();

  // Hàm gọi API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<MauSac[]>('MauSac/GetAllMauSac');
      setData(response.data);
      setFilteredData(response.data);
    } catch (error : any) {
      notification.error({
        message: 'Lỗi tải dữ liệu',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm tìm kiếm trong bảng
  const handleSearch = () => {
    const result = data.filter(
      (item) =>
        item.ten.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ma.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(result);
  };

  const handleReset = () => {
    setSearchText('');
    setFilteredData(data);
  };

  // Hàm hiển thị modal thêm màu sắc mới
  const showAddModal = () => {
    setAddModalVisible(true);
  };

  const handleAddColor = async () => {
    setLoading(true);
    try {
      // Gửi yêu cầu POST để thêm màu sắc mới
      const response = await baseAxios.post<MauSac>('/MauSac/ThemMauSac', newColor);
      if (response.data) {
        notification.success({
          message: 'Thêm màu sắc thành công',
          description: 'Màu sắc mới đã được thêm vào.',
        });
        // Thêm màu sắc vào danh sách màu sắc hiện tại
        setData([response.data, ...data]);
        setFilteredData([response.data, ...filteredData]);
      }
    } catch (error:any) {
      notification.error({
        message: 'Lỗi thêm màu sắc',
        description: error.message,
      });
    } finally {
      setLoading(false);
      setAddModalVisible(false);
    }
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
  };

  // Cấu hình bảng
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Mã màu',
      dataIndex: 'ma',
      key: 'ma',
      render: (text: string) => <div style={{ backgroundColor: text, width: '50px', height: '25px' }}></div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text: number) =>
        text === 1 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: MauSac) => (
        <>
          <Button type="primary" onClick={() => showEditModal(record)} style={{ marginRight: 10 }}>
            Chỉnh sửa
          </Button>
          <Button type="default" danger onClick={() => showDeleteModal(record)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const showDeleteModal = (size: MauSac) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa màu ${size.ten}?`,
      async onOk() {
        try {
          // Gửi yêu cầu DELETE để xóa kích cỡ
          const response = await baseAxios.delete(`MauSac/${size.id}`);
          if (response.status === 200) {
            notification.success({
              message: 'Xóa màu thành công',
              description: 'Màu đã được xóa khỏi danh sách.',
            });
            // Cập nhật danh sách sau khi xóa
            const newData = data.filter((item) => item.id !== size.id);
            setData(newData);
            setFilteredData(newData);
          }
        } catch (error: any) {
          notification.error({
            message: 'Lỗi xóa màu',
            description: 'Màu đang được dùng ở 1 sản phẩm nào đó nên không thể xóa.',
          });
        }
      },
    });
  };

  const showEditModal = (color: MauSac) => {
    setEditingColor(color);
    setModalVisible(true);
    form.setFieldsValue({
      ...color,
    });
  };

  const handleOk = async () => {
    if (editingColor) {
      setLoading(true);
      try {
        // Gửi yêu cầu cập nhật màu sắc
        const response = await baseAxios.put<MauSac>(`MauSac/${editingColor.id}`, editingColor);
        if (response.data) {
          notification.success({
            message: 'Cập nhật màu sắc thành công',
            description: 'Màu sắc đã được cập nhật.',
          });
          fetchData(); // Lấy lại dữ liệu mới
        }
      } catch (error : any) {
        notification.error({
          message: 'Lỗi cập nhật màu sắc',
          description: error.message,
        });
      } finally {
        setLoading(false);
        setModalVisible(false);
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <h2>Danh sách Màu sắc</h2>
      <Input
        placeholder="Tìm kiếm theo tên hoặc mã màu"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Button onClick={handleSearch} type="primary" style={{ marginRight: 10 }}>
        Tìm kiếm
      </Button>
      <Button onClick={handleReset} type="default">
        Làm mới
      </Button>
      <Button onClick={showAddModal} type="primary" style={{ marginLeft: 10 }}>
        Thêm màu sắc
      </Button>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa màu sắc"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
        >
          <Form.Item name="ten" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ma" label="Mã màu" rules={[{ required: true }]}>
            <Input
              type="color"
              value={editingColor?.ma}
              onChange={(e) => setEditingColor({ ...editingColor!, ma: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
            <Select
              value={editingColor?.trangThai}
              onChange={(value) => setEditingColor({ ...editingColor!, trangThai: value })}
            >
              <Select.Option value={1}>Hoạt động</Select.Option>
              <Select.Option value={0}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm màu sắc mới */}
      <Modal
        title="Thêm màu sắc mới"
        visible={addModalVisible}
        onOk={handleAddColor}
        onCancel={handleAddCancel}
      >
        <Form
          onFinish={handleAddColor}
          form={formAdd}
        >
          <Form.Item name="ten" label="Tên" rules={[{ required: true }]}>
            <Input
              value={newColor.ten}
              onChange={(e) => setNewColor({ ...newColor!, ten: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="ma" label="Mã màu" rules={[{ required: true }]}>
            <Input
              type="color"
              value={newColor.ma}
              onChange={(e) => setNewColor({ ...newColor!, ma: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MauSacPage;
