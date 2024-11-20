import { useEffect, useState } from "react";
import { baseAxios } from "../../api/axios";
import {
  Pagination,
  Table,
  Modal,
  Form,
  Input,
  Button,
  Tag,
  Select,
  DatePicker,
  notification,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { render } from "react-dom";
import moment from "moment";
import { KhachHang } from "../../types/types";

const KhachHangPage = () => {

  const [khachHang, setKhachHang] = useState<KhachHang[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<KhachHang | null>(
    null
  );
  const [form] = Form.useForm();
  const itemsPerPage = 5;

  const [searchText, setSearchText] = useState<string>("");

  // Hàm tìm kiếm cho mỗi cột
  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    setSearchText(selectedKeys[0] || "");
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, record: KhachHang, index: number) => {
        return (currentPage - 1) * itemsPerPage + index + 1;
      },
    },
    {
      title: "Tên",
      dataIndex: "ten",
      key: "ten",
      // Tính năng tìm kiếm cho cột "Tên"
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            autoFocus
            placeholder={`Tìm kiếm Tên`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys([e.target.value])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, "ten")}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, "ten")}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Làm mới
          </Button>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value: any, record: KhachHang) =>
        record.ten.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Số điện thoại",
      dataIndex: "sdt",
      key: "sdt",
      // Tính năng tìm kiếm cho cột "Số điện thoại"
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            autoFocus
            placeholder={`Tìm kiếm Số điện thoại`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys([e.target.value])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, "sdt")}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, "sdt")}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Làm mới
          </Button>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value: any, record: KhachHang) =>
        record.sdt?.toLowerCase().includes(value.toLowerCase()) || false,
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
      key: "gioiTinh",
      render: (value: number) => (value === 1 ? "Nam" : "Nữ"),
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngaySinh",
      key: "ngaySinh",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "diaChi",
      key: "diaChi",
    },
    {
      title: "Điểm tích",
      dataIndex: "diemTich",
      key: "diemTich",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text: number) =>
        text === 1 ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Không hoạt động</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: KhachHang) => (
        <div>
          <Button
            onClick={() => handleEdit(record)}
            className="mr-2"
            type="primary"
            size="small"
          >
            Sửa
          </Button>
          <Button onClick={() => handleDelete(record.idKhachHang)} size="small">
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    baseAxios.get("/KhachHang").then((response) => {
      setKhachHang(response.data);
    });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: KhachHang) => {
    setSelectedCustomer(record);
    setIsEditing(true);
    form.setFieldsValue({
      ...record,
      ngaySinh: record.ngaySinh ? moment(record.ngaySinh, "YYYY-MM-DD") : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xóa khách hàng",
      content: "Bạn có chắc chắn muốn xóa khách hàng này?",
      onOk: () => {
        baseAxios.delete(`/KhachHang/${id}`).then(() => {
          setKhachHang(
            khachHang.filter((customer) => customer.idKhachHang !== id)
          );
        });
      },
    });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (isEditing && selectedCustomer) {
        // Xóa mật khẩu khỏi dữ liệu gửi lên khi chỉnh sửa
        const { password, ...updateData } = values;
        baseAxios
          .put(`/KhachHang/PutKhView`, {
            iDKhachHang: selectedCustomer.idKhachHang,
            ten: updateData.ten,
            sdt: updateData.sdt,
            gioiTinh: updateData.gioiTinh,
            ngaySinh: updateData.ngaySinh,
            diaChi: updateData.diaChi,
            trangThai: updateData.trangThai,
          })
          .then(() => {
            const formatted = {
              ...selectedCustomer,
              ...updateData,
              ngaySinh: updateData.ngaySinh ? updateData.ngaySinh.format("YYYY-MM-DD") : null,
            };
            setKhachHang(
              khachHang.map((customer) =>
                customer.idKhachHang === selectedCustomer.idKhachHang
                  ? { ...customer, ...formatted }
                  : customer
              )
            );
            setIsModalVisible(false);
          });
      } else {
        // Gửi đầy đủ dữ liệu khi thêm mới
        baseAxios
          .post("/KhachHang", {
            email: values.email,
            name: values.ten,
            sdt: values.sdt,
            password: values.password,
            confirmPassword: values.password,
            trangThai: 1,
            gioiTinh: values.gioiTinh,
            ngaySinh: values.ngaySinh,
            diaChi: values.diaChi,
          })
          .then((response) => {
            setKhachHang([...khachHang, response.data]);
            setIsModalVisible(false);
          }).catch((error) => {
            notification.error({
              message: "Lỗi thêm khách hàng",
              description: error.message,
              })});

      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const paginatedData = khachHang.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h2 className="text-center font-bold text-3xl my-4">
        Quản lý khách hàng
      </h2>
      <div className="flex justify-end my-4">
        <Button type="primary" onClick={handleCreate}>
          Thêm mới
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
        />
        <div className="flex justify-center my-4">
          <Pagination
            current={currentPage}
            total={khachHang.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal for creating or editing customer */}
      <Modal
        title={isEditing ? "Sửa khách hàng" : "Thêm khách hàng"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ten" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {!isEditing && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }, { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="gioiTinh"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value={1}>Nam</Select.Option>
              <Select.Option value={0}>Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ngaySinh"
            label="Ngày sinh"
            rules={[
              {
                type: "object",
                required: true,
                message: "Vui lòng chọn ngày sinh",
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DDThh:mm:ss" />
          </Form.Item>
          {!isEditing && (
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "Vui lòng nhập email hợp lệ",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item name="diaChi" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item
            name="sdt"
            label="Số điện thoại"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại",
              },
              {
                pattern: /^[0-9]+$/,
                message: "Số điện thoại chỉ chứa số",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* Trường trạng thái */}
          <Form.Item
            name="trangThai"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={1}>Hoạt động</Select.Option>
              <Select.Option value={0}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KhachHangPage;
