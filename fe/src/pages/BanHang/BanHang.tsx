import React, { useState, useEffect } from "react";
import { Card, Button, Table, InputNumber, Modal, Typography, Row, Col, Form, Input } from "antd";
import { baseAxios } from "../../api/axios";

const { Title } = Typography;

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  code: string;
}

const SellingPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]); // Giỏ hàng
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal thanh toán
  const [totalAmount, setTotalAmount] = useState(0); // Tổng tiền
  const [products, setProducts] = useState<Product[]>([]); // Danh sách sản phẩm từ API
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
  const idUser: string = localStorage.getItem("userId") || "";

  const fetchProducts = () => {
    baseAxios
      .get("SanPham/GetAllChiTietSanPham")
      .then((response) => {
        const fetchedProducts = response.data.map((product: any) => ({
          id: product.id,
          name: product.ten,
          price: product.giaBan,
          quantity: product.soLuong,
          image: product.anh || null,
          code: product.ma,
        }));
        const availableProducts = fetchedProducts.filter((product: any) => product.quantity > 0);
        setProducts(availableProducts);
      })
      .catch((error) => {
        console.error("Error fetching products", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (value: number, id: string) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: value } : item)));
  };

  const calculateTotal = () => {
    const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    setTotalAmount(total);
  };

  const handlePayment = async () => {
    await baseAxios.post("HoaDon/Offline/" + idUser, [
      ...cart.map((product) => ({ iDChiTietSanPham: product.id, soLuong: product.quantity, donGia: product.price })),
    ]);
    Modal.success({
      title: "Thanh toán thành công",
      content: `Tổng cộng: ${totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`,
    });
    setCart([]); // Xóa giỏ hàng sau khi thanh toán
    setTotalAmount(0);
    fetchProducts();
  };

  const columns = [
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text: number) => text.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: number, record: Product) => (
        <InputNumber min={1} value={text} onChange={(value) => handleQuantityChange(value ?? 1, record.id)} />
      ),
    },
    {
      title: "Tổng",
      dataIndex: "total",
      key: "total",
      render: (_: any, record: Product) =>
        (record.price * record.quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Product) => (
        <Button danger onClick={() => removeFromCart(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  // Lọc sản phẩm dựa trên từ khóa tìm kiếm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Ô tìm kiếm */}
      <Input
        placeholder="Tìm kiếm sản phẩm theo tên..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      {/* Danh sách sản phẩm */}
      <Row gutter={16}>
        <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "hidden" }}>
          <Row gutter={16}>
            {filteredProducts.map((product) => (
              <Col span={8} key={product.id}>
                <Card
                  title={product.name + " - " + product.code}
                  extra={<Button onClick={() => addToCart(product)}>Thêm vào giỏ</Button>}
                  style={{ marginBottom: "20px" }}
                >
                  {product.image && <img src={product.image} alt={product.name} style={{ width: "100%" }} />}
                  <p>Giá: {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                  <p>Số lượng còn lại: {product.quantity}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Row>

      {/* Giỏ hàng */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={cart}
        pagination={false}
        footer={() => (
          <div style={{ textAlign: "right" }}>
            <Title level={4}>
              Tổng Tiền: {totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </Title>
            <Button type="primary" onClick={handlePayment}>
              Thanh Toán
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default SellingPage;
