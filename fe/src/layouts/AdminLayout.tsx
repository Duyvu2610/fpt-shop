import { ReactNode, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BsBarChart,
  BsFillPersonVcardFill,
  BsJournalText,
  BsMenuButtonWide,
  BsReverseLayoutTextWindowReverse,
} from "react-icons/bs";
import { CiShop } from "react-icons/ci";
import Swal from "sweetalert2";

interface DefaultLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: DefaultLayoutProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const roleNhanVien : boolean= localStorage.getItem("role") === "NhanVien";

  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
        Swal.fire("Đã đăng xuất!", "Bạn đã đăng xuất thành công.", "success");
      }
    });
  };

  useEffect(() => {
    switch (location.pathname) {
      case "/admin/ban-hang":
        setActiveTab("Bán hàng");
        break;
      case "/admin/hoa-don":
        setActiveTab("Quản lý hóa đơn");
        break;
      case "/admin/san-pham":
        setActiveTab("Quản lý sản phẩm");
        break;
      case "/admin/mau-sac":
        setActiveTab("Quản lý màu sắc");
        break;
      case "/admin/kich-co":
        setActiveTab("Quản lý kích cỡ");
        break;
      case "/admin/chat-lieu":
        setActiveTab("Quản lý chất liệu");
        break;
      case "/admin/loai-san-pham":
        setActiveTab("Quản lý loại sản phẩm");
        break;
      case "/admin/nhan-vien":
        setActiveTab("Quản lý nhân viên");
        break;
      case "/admin/khach-hang":
        setActiveTab("Quản lý khách hàng");
        break;
      default:
        setActiveTab("");
    }
  }, [location.pathname]);

  const active = "bg-[#f6f9ff] text-[#4154f1]";

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">FPT Telecom Shop</a>
          </div>
          <div className="flex-none">
            <button className="btn btn-square btn-ghost" onClick={handleLogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-12 h-screen ">
        <div className="shadow-lg p-4 fixed py-16 w-[20%] left-0 top-0 bottom-0">
          <ul className="menu rounded-box text-md gap-4 my-4">
            <li>
              <a
                href="/admin/ban-hang"
                className={`py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1] ${
                  activeTab === "Bán hàng" ? active : ""
                }`}
              >
                <CiShop size={18} />
                Bán hàng
              </a>
            </li>
            <li>
              <a
                href="/admin/hoa-don"
                className={`py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1] ${
                  activeTab === "Quản lý hóa đơn" ? active : ""
                }`}
              >
                <BsMenuButtonWide size={16} />
                Quản lý hóa đơn
              </a>
            </li>
            {!roleNhanVien && (<li>
              <a
                href="/admin/san-pham"
                className={`py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1] ${
                  activeTab === "Quản lý sản phẩm" ? active : ""
                }`}
              >
                <BsJournalText size={16} />
                Quản lý sản phẩm
              </a>
            </li>)}
            {!roleNhanVien && (<li>
              <details open>
                <summary className="py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1]">
                  <BsReverseLayoutTextWindowReverse size={16} />
                  Quản lý thuộc tính
                </summary>
                <ul>
                  <li>
                    <a
                      href="/admin/mau-sac"
                      className={`py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1] ${
                        activeTab === "Quản lý màu sắc" ? active : ""
                      }`}
                    >
                      Quản lý màu sắc
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin/kich-co"
                      className={`py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1] ${
                        activeTab === "Quản lý kích cỡ" ? active : ""
                      }`}
                    >
                      Quản lý kích cỡ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin/chat-lieu"
                      className={`py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1] ${
                        activeTab === "Quản lý chất liệu" ? active : ""
                      }`}
                    >
                      Quản lý chất liệu
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin/loai-san-pham"
                      className={`py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1] ${
                        activeTab === "Quản lý loại sản phẩm" ? active : ""
                      }`}
                    >
                      Quản lý loại sản phẩm
                    </a>
                  </li>
                </ul>
              </details>
            </li>)}
            <li>
              <details open>
                <summary className="py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1]">
                  <BsFillPersonVcardFill size={18} />
                  Quản lý người dùng
                </summary>
                <ul>
                  {!roleNhanVien && (<li>
                    <a
                      href="/admin/nhan-vien"
                      className={`py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1] ${
                        activeTab === "Quản lý nhân viên" ? active : ""
                      }`}
                    >
                      Quản lý nhân viên
                    </a>
                  </li>)}
                  <li>
                    <a
                      href="/admin/khach-hang"
                      className={`py-3 hover:bg-[#f6f9ff] hover:text-[#4154f1] ${
                        activeTab === "Quản lý khách hàng" ? active : ""
                      }`}
                    >
                      Quản lý khách hàng
                    </a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        <div className="p-4 flex-1 pl-[22%] py-20">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;