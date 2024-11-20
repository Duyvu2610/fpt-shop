import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  notification,
  Image,
  Tag,
  Select,
} from "antd";
import { baseAxios } from "../../api/axios";
import {
  ChatLieu,
  ChiTietSanPhamUpdateRequest,
  KichCo,
  LoaiSP,
  MauSac,
  SanPham,
  SanPhamRequest,
} from "../../types/types";
import ChiTietSanPhamModel from "./ChiTietSanPhamModel";
import ChiTietSanPhamModelUpdate from "./ChiTietSanPhamUpdate";

const SanPhamPage: React.FC = () => {
  const [data, setData] = useState<SanPham[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<SanPham | null>(null);
  const [newProduct, setNewProduct] = useState<SanPhamRequest>({
    id: "",
    ten: "",
    moTa: "",
    tenChatLieu: "",
    mauSacs: [],
    kichCos: [],
    tenLoaiSPCha: "",
    tenLoaiSPCon: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<SanPham[]>([]);

  const [loaiSP, setLoaiSP] = useState<LoaiSP[]>([]);
  const [loaiSPCon, setLoaiSPCon] = useState<LoaiSP[]>([]);
  const [chatLieu, setChatLieu] = useState<ChatLieu[]>([]);
  const [mauSac, setMauSac] = useState<MauSac[]>([]);
  const [kichThuoc, setKichThuoc] = useState<KichCo[]>([]);

  const [isShowAddDetailModal, setIsShowAddDetailModal] =
    useState<boolean>(false);
  const [sanPhamChiTiet, setSanPhamChiTiet] =
    useState<ChiTietSanPhamUpdateRequest>({} as ChiTietSanPhamUpdateRequest);

  const [isShowUpdateDetailModal, setIsShowUpdateDetailModal] =
    useState<boolean>(false);

    const [data1, setData1] = useState([
      {
        idChiTietSanPham: "1",
        tenMauSac: "Đỏ",
        maMau: "#ff0000",
        tenKichCo: "M",
        soLuong: 10,
        giaBan: 200000,
      },
      {
        idChiTietSanPham: "2",
        tenMauSac: "Xanh",
        maMau: "#0000ff",
        tenKichCo: "L",
        soLuong: 5,
        giaBan: 250000,
      },
    ]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<SanPham[]>(
        `SanPham/GetAllSanPhamAdmin`
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (error: any) {
      notification.error({
        message: "Lỗi tải sản phẩm",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChatLieu = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<ChatLieu[]>(
        "ChatLieu/GetAllChatLieu"
      );
      setChatLieu(response.data);
    } catch (error: any) {
      notification.error({
        message: "Error loading data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMauSac = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<MauSac[]>("MauSac/GetAllMauSac");
      setMauSac(response.data);
    } catch (error: any) {
      notification.error({
        message: "Error loading data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchKichThuoc = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<KichCo[]>("KichCo/GetAllKichCo");
      setKichThuoc(response.data);
    } catch (error: any) {
      notification.error({
        message: "Error loading data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLoaiSp = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<LoaiSP[]>("/LoaiSP/getAll");
      const data = response.data.filter((item) => item.idLoaiSPCha === null);
      setLoaiSP(data);
    } catch (error: any) {
      notification.error({
        message: "Error loading data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLoaiSpCon = async (idSpCha: string) => {
    setLoading(true);
    try {
      const response = await baseAxios.get<LoaiSP[]>("LoaiSP?id=" + idSpCha);
      setLoaiSPCon(response.data);
    } catch (error: any) {
      notification.error({
        message: "Error loading data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchLoaiSp();
    fetchChatLieu();
    fetchMauSac();
    fetchKichThuoc();
  }, []);

  const handleSearch = () => {
    const result = data.filter((item) =>
      item.ten.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(result);
  };

  const handleReset = () => {
    setSearchText("");
    setFilteredData(data);
  };

  const showEditModal = (product: SanPham) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleLoaiSPChaChange = (value: string) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, loaiSPCha: value });
    }
    fetchLoaiSpCon(value);
  };

  const handleLoaiSPConChange = (value: string) => {
    setNewProduct({ ...newProduct, tenLoaiSPCon: value });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  const handleAddModalCancel = () => {
    setAddModalVisible(false);
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    try {
      if (editingProduct) {
        await baseAxios.put(`SanPham/UpdateSanPham`, {
          id: editingProduct.id,
          ten: editingProduct.ten,
          moTa: editingProduct.mota,
          tenChatLieu: editingProduct.chatLieu,
          tenLoaiSPCha: editingProduct.loaiSPCha,
          tenLoaiSPCon: editingProduct.loaiSPCon,
          trangThai: editingProduct.trangThai,
        });
        notification.success({
          message: "Cập nhật sản phẩm thành công",
        });
        fetchProducts();
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi cập nhật sản phẩm",
        description: error.message,
      });
    } finally {
      setLoading(false);
      setModalVisible(false);
      setEditingProduct(null);
    }
  };

  const handleAddProduct = useCallback(() => {
    baseAxios
      .post("/SanPham/AddSanPham", newProduct)
      .then((response) => {
        setSanPhamChiTiet(response.data);
        setAddModalVisible(false);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });

    setIsShowAddDetailModal(true);
  }, [newProduct]);

  const columns = [
    {
      title: "Tên",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Mã",
      dataIndex: "ma",
      key: "ma",
    },
    {
      title: "Ảnh",
      dataIndex: "anh",
      key: "anh",
      render: (image: string) => <Image src={image} width={50} />,
    },
    {
      title: "Giá gốc",
      dataIndex: "giaGoc",
      key: "giaGoc",
      render: (giaGoc: number) => `${giaGoc.toLocaleString()} VND`,
    },
    {
      title: "Giá bán",
      dataIndex: "giaBan",
      key: "giaBan",
      render: (giaBan: number) => `${giaBan.toLocaleString()} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
    },
    {
      title: "Chất liệu",
      dataIndex: "chatLieu",
      key: "loaiSP",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: ["loaiSPCha", "loaiSPCon"],
      key: "loaiSP",
      render: (_: any, record: { loaiSPCha: string; loaiSPCon: string }) => (
        <span>
          {record.loaiSPCha} / {record.loaiSPCon}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai: number) =>
        trangThai === 1 ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Không hoạt động</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: SanPham) => (
        <>
          <Button
            onClick={() => showEditModal(record)}
            type="primary"
            style={{ marginRight: 10 }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record)} className="mr-2">
            Xóa
          </Button>
          {/* <Button onClick={() => handleShowUpdate(record)}>
            Chi tiết
          </Button> */}
        </>
      ),
    },
  ];

  const handleShowUpdate = (record: SanPham) => {
    setEditingProduct(record);
    setIsShowUpdateDetailModal(true);
  };

  const handleDelete = async (record: SanPham) => {
    try {
      await baseAxios.delete(
        `SanPham/UpdateTrangThaiSanPham?id=${record.id}&trangThai=0`
      );
      notification.success({
        message: "Xóa sản phẩm thành công",
      });
      fetchProducts();
    } catch (error: any) {
      notification.error({
        message: "Lỗi xóa sản phẩm",
        description: error.message,
      });
    } finally {
      setModalVisible(false);
      setEditingProduct(null);
    }
  };

  return (
    <div>
      <ChiTietSanPhamModelUpdate
        visible={isShowUpdateDetailModal}
        onClose={() => setIsShowUpdateDetailModal(false)}
        data={editingProduct?.id || ""}
        onSave={() => {}}
      />
      <h2>Danh sách Sản Phẩm</h2>
      <Input
        placeholder="Tìm kiếm theo tên sản phẩm"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Button onClick={handleSearch} type="primary" style={{ marginRight: 10 }}>
        Tìm kiếm
      </Button>
      <Button onClick={handleReset} type="default" style={{ marginRight: 10 }}>
        Làm mới
      </Button>
      <Button onClick={() => setAddModalVisible(true)} type="primary">
        Thêm sản phẩm
      </Button>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal thêm sản phẩm */}
      <Modal
        title="Thêm sản phẩm"
        open={addModalVisible}
        onCancel={handleAddModalCancel}
        onOk={handleAddProduct}
      >
        <Form layout="vertical">
          <Form.Item label="Tên sản phẩm" required>
            <Input
              value={newProduct.ten}
              onChange={(e) =>
                setNewProduct({ ...newProduct, ten: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Mô tả" required>
            <Input
              value={newProduct.moTa}
              onChange={(e) =>
                setNewProduct({ ...newProduct, moTa: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Chất liệu" required>
            <Select
              value={newProduct.tenChatLieu}
              onChange={(value) =>
                setNewProduct({ ...newProduct, tenChatLieu: value })
              }
              virtual={false}
            >
              {chatLieu.map((cl) => (
                <Select.Option key={cl.id} value={cl.ten}>
                  {cl.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Màu sắc" required>
            <Select
              mode="multiple"
              value={newProduct.mauSacs.map((ms) => ms.id)}
              onChange={(values) =>
                setNewProduct({
                  ...newProduct,
                  mauSacs: values
                    .map((id) => mauSac.find((ms) => ms.id === id))
                    .filter((ms): ms is MauSac => ms !== undefined),
                })
              }
              virtual={false}
            >
              {mauSac.map((cl) => (
                <Select.Option key={cl.id} value={cl.id}>
                  {cl.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Kích cỡ" required>
            <Select
              mode="multiple"
              value={newProduct.kichCos}
              onChange={(values) =>
                setNewProduct({ ...newProduct, kichCos: values })
              }
              virtual={false}
            >
              {kichThuoc.map((cl) => (
                <Select.Option key={cl.id} value={cl.ten}>
                  {cl.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Loại sản phẩm cha" required>
            <Select
              value={newProduct.tenLoaiSPCha}
              onChange={(value, option) => {
                const selectedOption = option as any;
                handleLoaiSPChaChange(value);
                setNewProduct({
                  ...newProduct,
                  tenLoaiSPCha: selectedOption.children,
                  tenLoaiSPCon: "",
                });
              }}
              virtual={false}
            >
              {loaiSP.map((cl) => (
                <Select.Option key={cl.id} value={cl.id}>
                  {cl.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Loại sản phẩm con" required>
            <Select
              value={newProduct.tenLoaiSPCon}
              onChange={(e) =>
                setNewProduct({ ...newProduct, tenLoaiSPCon: e })
              }
              virtual={false}
            >
              {loaiSPCon.map((cl) => (
                <Select.Option key={cl.id} value={cl.ten}>
                  {cl.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm chi tiết sản phẩm */}
      <ChiTietSanPhamModel
        visible={isShowAddDetailModal}
        onClose={() => setIsShowAddDetailModal(false)}
        data={sanPhamChiTiet}
        onSave={fetchProducts}
      />

      {/* Modal sửa sản phẩm */}
      <Modal
        title="Cập nhật sản phẩm"
        open={modalVisible}
        onCancel={handleModalCancel}
        onOk={handleSaveProduct}
      >
        {editingProduct && (
          <Form layout="vertical">
            <Form.Item label="Tên sản phẩm">
              <Input
                value={editingProduct.ten}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, ten: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Mo tả" required>
              <Input
                value={editingProduct.mota || ""}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, mota: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Chất liệu" required>
              <Select
                value={editingProduct.chatLieu}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, chatLieu: value })
                }
                virtual={false}
              >
                {chatLieu.map((cl) => (
                  <Select.Option key={cl.id} value={cl.ten}>
                    {cl.ten}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Loại sản phẩm cha" required>
              <Select
                value={editingProduct.loaiSPCha}
                onChange={(value, option) => {
                  const selectedOption = option as any;
                  handleLoaiSPChaChange(value);
                  setEditingProduct({
                    ...editingProduct,
                    loaiSPCha: selectedOption.children,
                    loaiSPCon: "",
                  });
                }}
                virtual={false}
              >
                {loaiSP.map((cl) => (
                  <Select.Option key={cl.id} value={cl.id}>
                    {cl.ten}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Loại sản phẩm con" required>
              <Select
                value={editingProduct.loaiSPCon}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, loaiSPCon: e })
                }
                virtual={false}
              >
                {loaiSPCon.map((cl) => (
                  <Select.Option key={cl.id} value={cl.ten}>
                    {cl.ten}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Trạng thái" required>
              <Select
                value={editingProduct.trangThai}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, trangThai: value })
                }
                virtual={false}
              >
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={0}>Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default SanPhamPage;
