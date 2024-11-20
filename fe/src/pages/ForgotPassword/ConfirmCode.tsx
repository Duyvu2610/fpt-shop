import React from "react";
import { Form, Input, Button, notification } from "antd";

interface ConfirmResetPasswordFormProps {
  onSuccess: () => void;
}

const ConfirmResetPasswordForm: React.FC<ConfirmResetPasswordFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const Ran = localStorage.getItem("Ran");

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.code === Ran) {
        notification.success({
            message: "Xác nhận thành công",
            description: "Mã xác nhận chính xác!",
            });
        onSuccess();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 400, padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}
      className="my-20 mx-auto mb-64"
    >
      <Form.Item
        label="Nhập mã xác nhận"
        name="code"
        rules={[
          { required: true, message: "Vui lòng nhập mã xác nhận!" },
        ]}
      >
        <Input placeholder="Nhập mã xác nhận" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ConfirmResetPasswordForm;
