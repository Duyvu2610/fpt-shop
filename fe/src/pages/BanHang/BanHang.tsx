import React, { useState, useEffect } from "react";
import { Card, Button, Table, InputNumber, Modal, Typography, Row, Col, Form, Input } from "antd";
import axios from "axios";
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
  const [cart, setCart] = useState<Product[]>([]);  // Giỏ hàng
  const [isModalVisible, setIsModalVisible] = useState(false);  // Modal thanh toán
  const [totalAmount, setTotalAmount] = useState(0);  // Tổng tiền
  const [products, setProducts] = useState<Product[]>([]);  // Danh sách sản phẩm từ API
  const idUser : string = localStorage.getItem("userId") || ""; 


  const fetchProducts = () => {
    baseAxios.get("SanPham/GetAllChiTietSanPham")
      .then(response => {
        const fetchedProducts = response.data.map((product: any) => ({
          id: product.id,
          name: product.ten,
          price: product.giaBan,
          quantity: product.soLuong,
          image: product.anh || null,
          code: product.ma
        }));
        const availableProducts = fetchedProducts.filter((product: any) => product.quantity > 0);
        setProducts(availableProducts);
      })
      .catch(error => {
        console.error("Error fetching products", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleQuantityChange = (value: number, id: string) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: value } : item
    ));
  };

  const calculateTotal = () => {
    const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    setTotalAmount(total);
  };

  const handlePayment = async () => {
    await baseAxios.post("HoaDon/Offline/" + idUser, [
      ...cart.map((product) => ({ iDChiTietSanPham: product.id, soLuong: product.quantity, donGia: product.price })),
    ]);
    console.log({
      cart: cart.map((product) => ({ id: product.id, quantity: product.quantity })),
    })
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
        <InputNumber
          min={1}
          value={text}
          onChange={(value) => handleQuantityChange(value ?? 1, record.id)}
        />
      ),
    },
    {
      title: "Tổng",
      dataIndex: "total",
      key: "total",
      render: (text: any, record: Product) => (
        (record.price * record.quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      ),
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

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        {/* Danh sách sản phẩm */}
        <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "hidden" }}>
          <Row gutter={16}>
            {products.map((product) => (
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

      {/* Modal thanh toán */}
      <Modal
        title="Thanh Toán"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Tên khách hàng">
            <Input />
          </Form.Item>
          <Form.Item label="Phương thức thanh toán">
            <Input />
          </Form.Item>
          <Form.Item label="Tổng tiền">
            <Input value={totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} readOnly />
          </Form.Item>
          <Button type="primary" onClick={handlePayment}>
            Xác nhận thanh toán
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default SellingPage;
