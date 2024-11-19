import React, { useEffect, useState } from 'react'; 
import { Table, Button, Modal, Form, Input, notification, Tag, Select } from 'antd';
import axios from 'axios';
import { baseAxios } from '../api/axios';

// Define interface for the category data
interface LoaiSP {
  id: string;
  ten: string;
  trangThai: number;
  idLoaiSPCha: string | null;
  sanPhams: any | null;
  loaiSPCha: LoaiSP | null;
}

const LoaiSPPage: React.FC = () => {
  const [data, setData] = useState<LoaiSP[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<LoaiSP | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<LoaiSP[]>([]);
  const [newCategory, setNewCategory] = useState<LoaiSP>({ id: '', ten: '', trangThai: 1, idLoaiSPCha: null, sanPhams: null, loaiSPCha: null });

  // Function to fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<LoaiSP[]>('/LoaiSP/getAll');
      const data = response.data.filter((item) => item.idLoaiSPCha === null);
      setData(data);
      setFilteredData(data); // Save data to state
    } catch (error: any) {
      notification.error({
        message: 'Error loading data',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  // Handle search functionality
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

  // Show the modal for adding new category
  const showAddModal = () => {
    setAddModalVisible(true);
  };

  const handleAddCategory = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.post<LoaiSP>('LoaiSP/save', {
        ten: newCategory.ten,
        idLoaiSPCha: newCategory.idLoaiSPCha,
        trangThai: 1,
      });
      if (response.data) {
        notification.success({
          message: 'Add category successful',
          description: 'New category has been added.',
        });
        setData([response.data, ...data]);
        setFilteredData([response.data, ...filteredData]);
      }
    } catch (error: any) {
      notification.error({
        message: 'Error adding category',
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

  // Table column configuration
  const columns = [
    {
      title: 'Name',
      dataIndex: 'ten',
      key: 'ten',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text: number) =>
        text === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: LoaiSP) => (
        <>
          <Button onClick={() => showEditModal(record)} type="primary" style={{ marginRight: 10 }}>
            Edit
          </Button>
          <Button danger onClick={() => showDeleteModal(record)} style={{ marginRight: 10 }}>Delete</Button>
          <Button >Chi Tiết</Button>
        </>
      ),
    },
  ];

  const showDeleteModal = (chatLieu: LoaiSP) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa loại sản phẩm ${chatLieu.ten}?`,
      async onOk() {
        try {
          // Gửi yêu cầu DELETE để xóa kích cỡ
          const response = await baseAxios.delete(`LoaiSP/delete/${chatLieu.id}`);
          if (response.status === 200) {
            notification.success({
              message: 'Xóa loại sản phẩm thành công',
              description: 'loại sản phẩm đã được xóa khỏi danh sách.',
            });
            // Cập nhật danh sách sau khi xóa
            const newData = data.filter((item) => item.id !== chatLieu.id);
            setData(newData);
            setFilteredData(newData);
          }
        } catch (error: any) {
          notification.error({
            message: 'Lỗi xóa loại sản phẩm',
            description: 'Loại sản phẩm đang được sử dụng trong sản phẩm.',
          });
        }
      },
    });
  };

  const showEditModal = (category: LoaiSP) => {
    setEditingCategory(category);
    setModalVisible(true);
    form.setFieldsValue({
      ...category,
    });
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        const response = await baseAxios.put<LoaiSP>(`LoaiSP/save`, {
          ...editingCategory,
          ...values,
        });
        if (response.status === 200) {
          notification.success({
            message: 'Edit category successful',
            description: 'Category has been updated.',
          });
          const newData = data.map((item) =>
            item.id === editingCategory?.id ? { ...item, ...values } : item
          );
          setData(newData);
          setFilteredData(newData);
        }
      } catch (error: any) {
        notification.error({
          message: 'Error editing category',
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
      <h2>Product Categories</h2>
      <Input
        placeholder="Search by name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Button onClick={handleSearch} type="primary" style={{ marginRight: 10 }}>
        Search
      </Button>
      <Button onClick={handleReset} type="default">
        Reset
      </Button>
      <Button onClick={showAddModal} type="primary" style={{ marginLeft: 10 }}>
        Add New Category
      </Button>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Category"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
        >
          <Form.Item name="ten" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
            <Select
              value={editingCategory?.trangThai}
              onChange={(value) => setNewCategory({ ...editingCategory!, trangThai: value })}
            >
              <Select.Option value={1}>Hoạt động</Select.Option>
              <Select.Option value={0}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        visible={addModalVisible}
        onOk={handleAddCategory}
        onCancel={handleAddCancel}
      >
        <Form
          onFinish={handleAddCategory}
          initialValues={{
            ten: newCategory.ten,
            trangThai: newCategory.trangThai,
          }}
        >
          <Form.Item name="ten" label="Name" rules={[{ required: true }]}>
            <Input
              value={newCategory.ten}
              onChange={(e) => setNewCategory({ ...newCategory, ten: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="idLoaiSPCha" label="Ten Loai SP Cha" rules={[{ required: true }]}>
            <Select
              value={newCategory?.idLoaiSPCha}
              onChange={(value) => setNewCategory({ ...newCategory!, idLoaiSPCha: value })}
            >
              {data.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoaiSPPage;
