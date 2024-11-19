import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Login } from "../types/types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { baseAxios, callApi, loginUser } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import routes from "../config/routes";


interface Errors {
  [key: string]: string;
}

function LoginPage() {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(true);
  const [role, setRole] = useState<string>("1");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState<Login>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (): boolean => {
    let tempErrors: Errors = {};
    tempErrors.email = formValues.email ? "" : "Bạn cần nhập email.";
    tempErrors.password = formValues.password ? "" : "Bạn cần nhập mật khẩu.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (role === "1") {
      try {
        const res = await baseAxios.get("/QuanLyNguoiDung/DangNhap", {
          params: {
            lg: formValues.email,
            password: formValues.password,
          },
        });
        localStorage.setItem("role", "admin");
        localStorage.setItem("userId", res.data.id);
        toast.success("Đăng nhập thành công");
        setTimeout(() => {
          window.location.href = "/admin/ban-hang";
        }, 1000);
        
      } catch (err) {
        toast.error("Đăng nhập thất bại");
      }
    } else {
      if (validate()) {
        setFormValues({
          email: "",
          password: "",
        });
        try {
          const data = await callApi(() => loginUser(formValues));
          dispatch(loginSuccess(data));
          navigate(routes.home);
        } catch (error) {
          toast.error("Đăng nhập thất bại");
        }
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
      <div className="select-none mb-[140px] grid md:grid-cols-2 gap-16 items-center relative overflow-hidden p-10 rounded-3xl bg-white text-black">
        <div>
          <h2 className="text-3xl font-extrabold">Đăng nhập</h2>
          <p className="text-sm text-gray-400 mt-3">
          Đăng nhập để tiếp tục sử dụng dịch vụ của chúng tôi
          </p>
          <form onSubmit={handleSubmit}>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="1">Admin</option>
              <option value="2">User</option>
            </select>
            <div className="space-y-4 mt-8">
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
                  type={!isShowPassword ? "text" : "password"}
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
            <div className="text-end mt-2">
              <button onClick={() => navigate(routes["forgot-pass"])} className="hover:text-primary">Quên mật khẩu ?</button>
            </div>
            <button
              type="submit"
              className="mt-6 flex items-center justify-center text-sm w-full rounded-lg px-4 py-3 font-semibold bg-[#333] text-white hover:bg-[#222]"
            >
              Đăng nhập
            </button>
            <p className="pt-4 text-center">
            Bạn chưa có tài khoản?{" "}
              <Link to={"/signup"} className="text-primary hover:underline">
              Đăng ký
              </Link>
            </p>
          </form>
        </div>
        <img
          src="https://biznis.slovanet.net/wp-content/uploads/2019/10/Fpt-logo_transparent.png"
          alt=""
        />
      </div>
    </div>
  );
}

export default LoginPage;
