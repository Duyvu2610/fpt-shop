import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Tag, Select } from 'antd';
import axios from 'axios';
import { baseAxios } from '../api/axios';
import { ChatLieu } from '../types/types';

// Định nghĩa interface cho dữ liệu chất liệu


const ChatLieuPage: React.FC = () => {
  const [data, setData] = useState<ChatLieu[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editingMaterial, setEditingMaterial] = useState<ChatLieu | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<ChatLieu[]>([]);
  const [newMaterial, setNewMaterial] = useState<ChatLieu>({ id: '', ten: '', trangThai: 1, sanPhams: null });

  const [form] = Form.useForm();

  // Hàm gọi API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<ChatLieu[]>('ChatLieu/GetAllChatLieu');
      setData(response.data);
      setFilteredData(response.data); // Lưu dữ liệu vào state
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
      (item) => item.ten.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(result);
  };

  const handleReset = () => {
    setSearchText('');
    setFilteredData(data);
  };

  // Hàm hiển thị modal thêm chất liệu mới
  const showAddModal = () => {
    setAddModalVisible(true);
  };

  const handleAddMaterial = async () => {
    setLoading(true);
    try {
      // Gửi yêu cầu POST để thêm chất liệu mới
      const response = await baseAxios.post<ChatLieu>('/ChatLieu/ThemChatLieu', newMaterial);
      if (response.data) {
        notification.success({
          message: 'Thêm chất liệu thành công',
          description: 'Chất liệu mới đã được thêm vào.',
        });
        // Thêm chất liệu vào danh sách hiện tại
        setData([response.data, ...data]);
        setFilteredData([response.data, ...filteredData]);
      }
    } catch (error : any) {
      notification.error({
        message: 'Lỗi thêm chất liệu',
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
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text: number) =>
        text === 1 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: ChatLieu) => (
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

  const showDeleteModal = (chatLieu: ChatLieu) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa chất liệu ${chatLieu.ten}?`,
      async onOk() {
        try {
          // Gửi yêu cầu DELETE để xóa kích cỡ
          const response = await baseAxios.delete(`ChatLieu/${chatLieu.id}`);
          if (response.status === 200) {
            notification.success({
              message: 'Xóa chất liệu thành công',
              description: 'chất liệu đã được xóa khỏi danh sách.',
            });
            // Cập nhật danh sách sau khi xóa
            const newData = data.filter((item) => item.id !== chatLieu.id);
            setData(newData);
            setFilteredData(newData);
          }
        } catch (error: any) {
          notification.error({
            message: 'Lỗi xóa chất liệu',
            description: 'Chất liệu đang được sử dụng trong sản phẩm.',
          });
        }
      },
    });
  };

  const showEditModal = (material: ChatLieu) => {
    setEditingMaterial(material);
    setModalVisible(true);
    form.setFieldsValue({
      ...material,
    });
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        // Gửi yêu cầu PUT để cập nhật thông tin chất liệu
        const response = await baseAxios.put(`ChatLieu/${editingMaterial?.id}`, values);
        if (response.status === 200) {
          notification.success({
            message: 'Cập nhật chất liệu thành công',
            description: 'Thông tin chất liệu đã được cập nhật.',
          });
          // Cập nhật danh sách sau khi cập nhật
          const newData = data.map((item) =>
            item.id === editingMaterial?.id ? { ...item, ...values } : item
          );
          setData(newData);
          setFilteredData(newData);
        }
      } catch (error: any) {
        notification.error({
          message: 'Lỗi cập nhật chất liệu',
          description: error.message,
        });
      } finally {
        setLoading(false);
        setModalVisible(false);
      }
    });
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <h2>Danh sách Chất Liệu</h2>
      <Input
        placeholder="Tìm kiếm theo tên"
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
        Thêm chất liệu
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
        title="Chỉnh sửa chất liệu"
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
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
            <Select
              value={editingMaterial?.trangThai}
              onChange={(value) => setEditingMaterial({ ...editingMaterial!, trangThai: value })}
            >
              <Select.Option value={1}>Hoạt động</Select.Option>
              <Select.Option value={0}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm chất liệu mới */}
      <Modal
        title="Thêm chất liệu mới"
        visible={addModalVisible}
        onOk={handleAddMaterial}
        onCancel={handleAddCancel}
      >
        <Form
          onFinish={handleAddMaterial}
          initialValues={{
            ten: newMaterial.ten,
            trangThai: newMaterial.trangThai,
          }}
        >
          <Form.Item name="ten" label="Tên" rules={[{ required: true }]}>
            <Input
              value={newMaterial.ten}
              onChange={(e) => setNewMaterial({ ...newMaterial, ten: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
            <Select
              value={newMaterial?.trangThai}
              onChange={(value) => setNewMaterial({ ...newMaterial!, trangThai: value })}
            >
              <Select.Option value={1}>Hoạt động</Select.Option>
              <Select.Option value={0}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChatLieuPage;
