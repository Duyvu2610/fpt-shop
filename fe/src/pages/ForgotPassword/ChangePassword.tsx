import React from "react";
import { Form, Input, Button, notification } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { baseAxios } from "../../api/axios";

const ChangePasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const id = localStorage.getItem("idChangePass");

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      baseAxios.get(`KhachHang/ChangeForgotPassword`, {
        params: { id, password: values.password },
      }).then(() => {
        notification.success({
            message: "Đổi mật khẩu thành công",
            description: "Mật khẩu đã được thay đổi!",
            });
        localStorage.removeItem("idChangePass");
        window.location.href = "/login";
      });
      // Xử lý logic đổi mật khẩu ở đây
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        padding: "2rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      className="my-20 mx-auto mb-64"
    >
      <h2 style={{ textAlign: "center" }}>Đổi mật khẩu</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Mật khẩu mới"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu mới"
          />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập lại mật khẩu"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
