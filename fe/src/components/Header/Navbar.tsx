import { FC, useEffect, useRef, useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logoutUser } from "../../api/axios"
import Logo from "../../assets/images/logo-fpt.png";
import routes from "../../config/routes";
import { Emitter } from "../../eventEmitter/EventEmitter";
import { RootState } from "../../redux/store";
import { GetUserInfoDto } from "../../types/types";

const Navbar: FC = () => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isLogin = localStorage.getItem("userId");

  const user: GetUserInfoDto | null = useSelector(
    (state: RootState) => state.auth.currentUser
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const activeNavLink = ({ isActive }: { isActive: boolean }) => {
    return isActive ? "text-base  underline" : "text-base ";
  };

  useEffect(() => {
    const fetchCart = async () => {
      // const listCartPay = await getCartByUser(user?.id);
      // setCartCount(listCartPay.length);
    };
    if (user) {
      fetchCart();
    }
    const handleEvent = () => {
      fetchCart();
    };

    Emitter.on("updateCartNumber", handleEvent);

    return () => {
      Emitter.off("updateCartNumber", handleEvent);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className=" bg-white">
      <div className="wrapper px-6 xl:px-0">
        <div className="flex justify-between items-center gap-8">
          <Link to="/" className="font-[IntegralCf] text-[24px]">
            <img src={Logo} alt="" className="w-40" />
          </Link>

          <ul className="hidden lg:flex space-x-12">
            <NavLink
              to={routes.home}
              className={activeNavLink}
              key={routes.home}
            >
              Trang chủ
            </NavLink>

            <NavLink
              to={routes.product}
              className={activeNavLink}
              key={routes.product}
            >
              Sản phẩm
            </NavLink>

            <NavLink
              to={routes.contact}
              className={activeNavLink}
              key={routes.contact}
            >
              Liên hệ
            </NavLink>
          </ul>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-[20px]">
              <div className="relative">
                <Link to="/cart" className="relative">
                  <IoCartOutline className="w-7 h-7 mt-1" />
                  {cartCount > 0 && (<div className="transition-all duration-300 w-5 h-5 rounded-full bg-red-600 text-white absolute top-0 text-sm right-[-10px] border border-white text-center">{cartCount}</div>)}
                </Link>
              </div>
              {isLogin ? (
                <button className="hidden lg:block" onClick={logoutUser}>
                  Đăng xuất
                  <AiOutlineLogin className="w-6 h-6 inline-block" />
                </button>
              ) : (
                <Link to={"/login"} className="hidden lg:block">
                  Đăng nhập
                  <AiOutlineLogin className="w-6 h-6 inline-block" />
                </Link>
              )}
            </div>

            {/* Mobile menu */}
            <div className="lg:hidden">
              <button onClick={toggleMenu}>
                {isMenuOpen ? (
                  <FaXmark className="w-6 h-6 mt-2" />
                ) : (
                  <FaBars className="w-6 h-6 mt-2" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
