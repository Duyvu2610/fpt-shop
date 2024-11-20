import { callApi, registerNewUser } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Login, SignUpInfo } from "../types/types";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface Errors {
  [key: string]: string;
}

function SignUpPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<SignUpInfo>({
    name: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (): boolean => {
    let tempErrors: Errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    tempErrors.name = formValues.name ? "" : "Bạn cần nhập tên.";
    tempErrors.email = formValues.email
      ? emailRegex.test(formValues.email)
        ? ""
        : "Email không hợp lệ."
      : "Bạn cần nhập email.";

    tempErrors.password = formValues.password
      ? formValues.password.length > 6
        ? ""
        : "Mật khẩu phải lớn hơn 6 ký tự."
      : "Bạn cần nhập mật khẩu.";

    tempErrors.gender = formValues.gender ? "" : "Bạn cần chọn giới tính.";
    tempErrors.address = formValues.address ? "" : "Bạn cần nhập địa chỉ.";
    tempErrors.phone = formValues.phone
      ? phoneRegex.test(formValues.phone)
        ? ""
        : "Số điện thoại không hợp lệ."
      : "Bạn cần nhập số điện thoại.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await callApi(() => registerNewUser(formValues));
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        setFormValues({
          name: "",
          email: "",
          password: "",
          gender: "",
          address: "",
          phone: "",
        });
        toast.success(
          "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập..."
        );
      } catch (error) {
        toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleChangeShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="wrapper">
      <div className="select-none w-[70%] mx-auto mb-[140px] grid gap-16 items-center relative overflow-hidden p-10 rounded-3xl bg-white text-black">
        <div>
          <h2 className="text-3xl font-extrabold">Đăng ký</h2>
          <p className="text-sm text-gray-400 mt-3">
            Đăng ký để nhận được nhiều ưu đãi từ chúng tôi.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mt-8">
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                className={`px-3 py-4 bg-white text-black w-full text-sm border rounded-lg ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:border-[#333] outline-none`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
              <input
                type="text"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                className={`px-3 py-4 bg-white text-black w-full text-sm border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:border-[#333] outline-none`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
              <div className="relative">
                <input
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu của bạn"
                  className={`pl-3 py-4 pr-12 bg-white w-full text-sm border rounded-lg ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:border-[#333] outline-none`}
                />
                <div className="absolute right-3 top-2 p-2 rounded-full hover:bg-[#0000000a] transition-all duration-300">
                  {isShowPassword ? (
                    <FaEyeSlash size={20} onClick={handleChangeShowPassword} />
                  ) : (
                    <FaEye size={20} onClick={handleChangeShowPassword} />
                  )}
                </div>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            {/* Trường giới tính */}
            <select
              name="gender"
              value={formValues.gender}
              onChange={handleChange}
              className={`px-3 py-4 bg-white text-black w-full text-sm border rounded-lg mt-4 ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } focus:border-[#333] outline-none`}
            >
              <option value="">Chọn giới tính</option>
              <option value="1">Nam</option>
              <option value="2">Nữ</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs">{errors.gender}</p>
            )}


            {/* Trường địa chỉ */}
            <input
              type="text"
              name="address"
              value={formValues.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ của bạn"
              className={`px-3 py-4 bg-white text-black w-full text-sm border rounded-lg mt-4 ${
                errors.address ? "border-red-500" : "border-gray-300"
              } focus:border-[#333] outline-none`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address}</p>
            )}

            {/* Trường số điện thoại */}
            <input
              type="tel"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại của bạn"
              className={`px-3 py-4 bg-white text-black w-full text-sm border rounded-lg mt-4 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:border-[#333] outline-none`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
            <button
              type="submit"
              className="mt-6 flex items-center justify-center text-sm w-full rounded-lg px-4 py-3 font-semibold bg-[#333] text-white hover:bg-[#222]"
            >
              Đăng ký
            </button>
            <p className="pt-4 text-center">
              Bạn đã có tài khoản?{" "}
              <Link to={"/login"} className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
