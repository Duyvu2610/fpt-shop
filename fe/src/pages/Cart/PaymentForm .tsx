import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { baseAxios } from "../../api/axios";

interface PaymentFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: "COD" | "VNPay";
  idCardDetail: string;
}

interface PaymentFormProps {
  total: number;
  idCardDetail: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ total, idCardDetail }) => {
  const [initialValues, setInitialValues] = useState<PaymentFormValues>({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
    idCardDetail
  });

  useEffect(() => {
    async function fetchUser() {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const res = await baseAxios.get(`/auth/me/${userId}`);
          setInitialValues({
            name: res.data.ten || "",
            email: res.data.email || "",
            phone: res.data.sdt || "",
            address: res.data.diaChi || "",
            paymentMethod: "COD",
            idCardDetail
          });
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
    }
    fetchUser();
  }, [idCardDetail]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Vui lòng nhập họ tên"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    phone: Yup.string()
      .matches(/^\d+$/, "Số điện thoại chỉ chứa số")
      .required("Vui lòng nhập số điện thoại"),
    address: Yup.string().required("Vui lòng nhập địa chỉ"),
  });

  const formik = useFormik<PaymentFormValues>({
    initialValues,
    enableReinitialize: true, // Cho phép reinitialize
    validationSchema,
    onSubmit: (values) => {
      console.log("Thông tin thanh toán:", values);
      baseAxios
        .post("/vnPay", {
          OrderType: "billpayment", 
          Amount: total, // Số tiền thanh toán (VNĐ)
          OrderDescription: "Thanh toán hóa đơn mua hàng", // Mô tả đơn hàng
          Name: values.name, // Tên khách hàng
          idCardDetail
        })
        .then((res) => {
          console.log(res.data);
          window.location.href = res.data; // Chuyển hướng đến VNPay
        })
        .catch((err) => {
          console.error("Lỗi khi thanh toán:", err);
        })
    },
  });

  return (
    <div className="">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white w-full max-w-md"
      >
        {/* Họ và tên */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Họ và tên
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.name && formik.errors.name
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md`}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>

        {/* Số điện thoại */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md`}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm">{formik.errors.phone}</p>
          )}
        </div>

        {/* Địa chỉ */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Địa chỉ
          </label>
          <textarea
            id="address"
            name="address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.address && formik.errors.address
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md`}
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-red-500 text-sm">{formik.errors.address}</p>
          )}
        </div>

        {/* Phương thức thanh toán */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Phương thức thanh toán
          </label>
          <div className="flex items-center mt-2">
            <input
              id="COD"
              name="paymentMethod"
              type="radio"
              value="COD"
              checked={formik.values.paymentMethod === "COD"}
              onChange={formik.handleChange}
              className="mr-2"
            />
            <label htmlFor="COD" className="mr-4">
              Thanh toán khi nhận hàng (COD)
            </label>
            <input
              id="VNPay"
              name="paymentMethod"
              type="radio"
              value="VNPay"
              checked={formik.values.paymentMethod === "VNPay"}
              onChange={formik.handleChange}
              className="mr-2"
            />
            <label htmlFor="VNPay">VNPay</label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Thanh toán
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
