import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Tag, Select } from 'antd';
import axios from 'axios';
import { baseAxios } from '../api/axios';
import { KichCo } from '../types/types';


const KichCoPage: React.FC = () => {
  const [data, setData] = useState<KichCo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editingSize, setEditingSize] = useState<KichCo | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<KichCo[]>([]);
  const [newSize, setNewSize] = useState<KichCo>({ id: '', ten: '', trangThai: 1, chiTietSanPhams: null });

  const [form] = Form.useForm();


  // Hàm gọi API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<KichCo[]>('KichCo/GetAllKichCo');
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

  // Hàm hiển thị modal thêm kích cỡ mới
  const showAddModal = () => {
    setAddModalVisible(true);
  };

  const handleAddSize = async () => {
    setLoading(true);
    try {
      // Gửi yêu cầu POST để thêm kích cỡ mới
      const response = await baseAxios.post<KichCo>('KichCo/ThemKichCo', newSize);
      if (response.status === 200) {
        notification.success({
          message: 'Thêm kích cỡ thành công',
          description: 'Kích cỡ mới đã được thêm vào.',
        });
        // Thêm kích cỡ vào danh sách hiện tại
        setData([response.data, ...data]);
        setFilteredData([response.data, ...filteredData]);
        fetchData();
      }
    } catch (error: any) {
      notification.error({
        message: 'Lỗi thêm kích cỡ',
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
      render: (_: any, record: KichCo) => (
        <>
        <Button onClick={() => showEditModal(record)} type="primary" className='mr-2'>
          Sửa
        </Button>
        <Button onClick={() => showDeleteModal(record)} danger>
        Xóa
      </Button></>
      ),
    },
  ];

  const showDeleteModal = (size: KichCo) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa kích cỡ ${size.ten}?`,
      async onOk() {
        try {
          // Gửi yêu cầu DELETE để xóa kích cỡ
          const response = await baseAxios.delete(`KichCo/${size.id}`);
          if (response.status === 200) {
            notification.success({
              message: 'Xóa kích cỡ thành công',
              description: 'Kích cỡ đã được xóa khỏi danh sách.',
            });
            // Cập nhật danh sách sau khi xóa
            const newData = data.filter((item) => item.id !== size.id);
            setData(newData);
            setFilteredData(newData);
          }
        } catch (error: any) {
          notification.error({
            message: 'Lỗi xóa kích cỡ',
            description: error.message,
          });
        }
      },
    });
  };

  const showEditModal = (size: KichCo) => {
    setEditingSize(size);
    setModalVisible(true);
    form.setFieldsValue({
      ...size
    });
  };

  const handleOk = () => {
    if (!editingSize) return;
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        try {
          // Gửi yêu cầu PUT để cập nhật thông tin kích cỡ
          const response = await baseAxios.put<KichCo>(
            `KichCo/${editingSize.id}`,
            values
          );
          if (response.data) {
            notification.success({
              message: 'Cập nhật kích cỡ thành công',
              description: 'Thông tin kích cỡ đã được cập nhật.',
            });
            // Cập nhật thông tin kích cỡ trong danh sách
            const index = data.findIndex((item) => item.id === editingSize.id);
            const newData = [...data];
            newData[index] = response.data;
            setData(newData);
            setFilteredData(newData);
          }
        } catch (error: any) {
          notification.error({
            message: 'Lỗi cập nhật kích cỡ',
            description: error.message,
          });
        } finally {
          setLoading(false);
          setModalVisible(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <h2>Danh sách Kích Cỡ</h2>
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
        Thêm kích cỡ
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
        title="Chỉnh sửa kích cỡ"
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
              value={editingSize?.trangThai}
              onChange={(value) => setEditingSize({ ...editingSize!, trangThai: value })}
            >
              <Select.Option value={1}>Hoạt động</Select.Option>
              <Select.Option value={0}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm kích cỡ mới */}
      <Modal
        title="Thêm kích cỡ mới"
        visible={addModalVisible}
        onOk={handleAddSize}
        onCancel={handleAddCancel}
      >
        <Form
          onFinish={handleAddSize}
          initialValues={{
            ten: newSize.ten,
            trangThai: newSize.trangThai,
          }}
        >
          <Form.Item name="ten" label="Tên" rules={[{ required: true }]}>
            <Input
              value={newSize.ten}
              onChange={(e) => setNewSize({ ...newSize!, ten: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
            <Select
              value={newSize.trangThai}
              onChange={(value) => setNewSize({ ...newSize!, trangThai: value })}
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

export default KichCoPage;
