import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Tag, Select } from 'antd';
import axios from 'axios';
import { baseAxios } from '../api/axios';

interface VaiTro {
  id: string;
  ten: string;
  trangThai: number;
}

interface NhanVien {
  id: string;
  ten: string;
  email: string;
  passWord: string;
  sdt: string;
  diaChi: string;
  trangThai: number;
  idVaiTro: string;
  hoaDons: any | null;
  vaiTro: VaiTro;
}

const NhanVienPage: React.FC = () => {
  const [data, setData] = useState<NhanVien[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<NhanVien | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<NhanVien[]>([]);
  const [newEmployee, setNewEmployee] = useState<NhanVien>({
    id: '',
    ten: '',
    email: '',
    passWord: '',
    sdt: '',
    diaChi: '',
    trangThai: 1,
    idVaiTro: '',
    hoaDons: null,
    vaiTro: { id: '', ten: '', trangThai: 1 },
  });
  const [roles, setRoles] = useState<VaiTro[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<NhanVien[]>('https://localhost:7095/api/NhanVien/GetAll');
      setData(response.data);
      setFilteredData(response.data);
    } catch (error: any) {
      notification.error({
        message: 'Lỗi tải dữ liệu',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await baseAxios.get<VaiTro[]>('VaiTro');
      setRoles(response.data);
    } catch (error: any) {
      notification.error({
        message: 'Lỗi tải danh sách vai trò',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  const handleSearch = () => {
    const result = data.filter((item) =>
      item.ten.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(result);
  };

  const handleReset = () => {
    setSearchText('');
    setFilteredData(data);
  };

  const showAddModal = () => {
    setAddModalVisible(true);
  };

  const handleAddEmployee = async () => {
    setLoading(true);
    try {
      const response = await axios.post<NhanVien>(
        'https://localhost:7095/api/NhanVien/AddNhanVien',
        newEmployee
      );
      if (response.data) {
        notification.success({
          message: 'Thêm nhân viên thành công',
          description: 'Nhân viên mới đã được thêm vào.',
        });
        setData([response.data, ...data]);
        setFilteredData([response.data, ...filteredData]);
      }
    } catch (error: any) {
      notification.error({
        message: 'Lỗi thêm nhân viên',
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

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'sdt',
      key: 'sdt',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
    },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      render: (vaiTro: VaiTro) => <span>{vaiTro?.ten}</span>,
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
      render: (_: any, record: NhanVien) => (
        <Button onClick={() => showEditModal(record)} type="primary">
          Sửa
        </Button>
      ),
    },
  ];

  const showEditModal = (employee: NhanVien) => {
    setEditingEmployee(employee);
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <h2>Danh sách Nhân Viên</h2>
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
        Thêm nhân viên
      </Button>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal thêm nhân viên */}
      <Modal
        title="Thêm nhân viên mới"
        visible={addModalVisible}
        onOk={handleAddEmployee}
        onCancel={handleAddCancel}
      >
        <Form
          onFinish={handleAddEmployee}
          initialValues={{
            ten: newEmployee.ten,
            email: newEmployee.email,
            sdt: newEmployee.sdt,
            diaChi: newEmployee.diaChi,
            trangThai: newEmployee.trangThai,
            idVaiTro: newEmployee.idVaiTro,
          }}
        >
          <Form.Item name="ten" label="Tên" rules={[{ required: true }]}>
            <Input
              value={newEmployee.ten}
              onChange={(e) => setNewEmployee({ ...newEmployee, ten: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="sdt" label="Số điện thoại" rules={[{ required: true }]}>
            <Input
              value={newEmployee.sdt}
              onChange={(e) => setNewEmployee({ ...newEmployee, sdt: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="diaChi" label="Địa chỉ">
            <Input
              value={newEmployee.diaChi}
              onChange={(e) => setNewEmployee({ ...newEmployee, diaChi: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="idVaiTro" label="Vai trò" rules={[{ required: true }]}>
            <Select
              value={newEmployee.idVaiTro}
              onChange={(value) => setNewEmployee({ ...newEmployee, idVaiTro: value })}
            >
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái">
            <Input
              type="number"
              value={newEmployee.trangThai}
              onChange={(e) => setNewEmployee({ ...newEmployee, trangThai: +e.target.value })}
              min={0}
              max={1}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NhanVienPage;
