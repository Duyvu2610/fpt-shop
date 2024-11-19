import path from "path";
import config from "../config";
import DefaultLayout from "../layouts/DefaultLayout";
import SimpleHeaderLayout from "../layouts/SimpleHeaderLayout";
import CartPage from "../pages/Cart/CartPage";
import Contact from "../pages/Contact";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Home from "../pages/Home/Home";
import Live from "../pages/Live/Live";
import Watch from "../pages/Live/Watch";
import LoginPage from "../pages/LoginPage";
import PageNotFound from "../pages/PageNotFound";
import Product from "../pages/Product/Product";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import SignUpPage from "../pages/SignUpPage";
import ThankYou from "../pages/ThankYou/ThankYou";
import KhachHangPage from "../pages/KhachHang/KhachHangPage";
import AdminLayout from "../layouts/AdminLayout";
import NhanVienPage from "../pages/NhanVienPage";
import MauSacPage from "../pages/MauSacPage";
import KichCoPage from "../pages/KichCoPage";
import ChatLieuPage from "../pages/ChatLieuPage";
import LoaiSPPage from "../pages/LoaiSPPage";
import SanPhamPage from "../pages/SanPhamPage/SanPhamPage";
import QuanLyHoaDon from "../pages/QuanLyHoaDon/QuanLyHoaDon";
import SellingPage from "../pages/BanHang/BanHang";

const publicRoutes = [
  { path: config.routes.home, component: Home, layout: DefaultLayout },
  { path: config.routes.login, component: LoginPage, layout: DefaultLayout },
  {
    path: config.routes.signup,
    component: SignUpPage,
    layout: SimpleHeaderLayout,
  },
  { path: config.routes.product, component: Product, layout: DefaultLayout },
  { path: config.routes.contact, component: Contact, layout: DefaultLayout },
  { path: config.routes.cart, component: CartPage, layout: DefaultLayout },
  { path: config.routes.live, component: Watch, layout: DefaultLayout },
  { path: config.routes.stream, component: Live, layout: DefaultLayout },
  { path: config.routes.thank, component: ThankYou, layout: DefaultLayout },
  {
    path: config.routes["forgot-pass"],
    component: ForgotPassword,
    layout: DefaultLayout,
  },
  {
    path: config.routes["reset-pass"],
    component: ResetPassword,
    layout: DefaultLayout,
  },
  {
    path: config.routes["produc-detail"],
    component: ProductDetail,
    layout: DefaultLayout,
  },
  { path: config.routes["page-not-found"], component: PageNotFound },
  
];

const privateRoutes: any[] = [
  {path: config.routes.adminKhachHang , component: KhachHangPage, layout: AdminLayout},
  {path: config.routes.adminNhanVien , component: NhanVienPage, layout: AdminLayout},
  {path: config.routes.adminMauSac , component: MauSacPage, layout: AdminLayout},
  {path: config.routes.adminKichCo , component: KichCoPage, layout: AdminLayout},
  {path: config.routes.adminChatLieu , component: ChatLieuPage, layout: AdminLayout},
  {path: config.routes.adminLoaiSanPham , component: LoaiSPPage, layout: AdminLayout},
  {path: config.routes.adminSanPham , component: SanPhamPage, layout: AdminLayout},
  {path: config.routes.adminHoaDon , component: QuanLyHoaDon, layout: AdminLayout},
  {path: config.routes.adminBanHang , component: SellingPage, layout: AdminLayout},

  
];

export { publicRoutes, privateRoutes };
