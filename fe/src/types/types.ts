import { ReactNode } from "react";

export interface Product {
  id: string;
  ten: string;
  trangThai: number;
  trangThaiCTSP: number;
  loaiSP: string;
  idMauSac: string;
  idKichCo: string;
  idChatLieu: string;
  ngayTao: string;
  idChiTietSanPham: string;
  soLuong: number;
  image: string;
  giaBan: number;
  giaGoc: number;
  idKhuyenMai: string | null;
  trangThaiKM: number | null;
  giaTriKM: number | null;
  soSao: number | undefined;
  mota: string;
}

export interface Review {
  id: number;
  userId: number,
  userName: string,
  content: string,
  rating: number;
  updated: [number, number, number, number, number, number, number]
}

export interface RoomData {
  data: Room[];
}

export interface MeetingData {
  code: number;
  data: {
    sessionId: string;
    start: string;
    end: string | null;
    meetingId: string;
    duration: number;
    links: {
      get_room: string;
      get_session: string;
    };
    playbackHlsUrl: string;
    id: string;
  };
}

export interface Room {
  roomId: string;
  customRoomId: string;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    name: string;
    discontinuedReason: string | null;
    id: string;
  };
  id: string;
  links: {
    get_room: string;
    get_session: string;
  };
}

export interface Meta {
  createdAt: string;
  width: number;
  height: number;
  format: string;
}

export interface ThumbnailResponse {
  message: string;
  roomId: string;
  meta: Meta;
  filePath: string;
  fileSize: number;
  fileName: string;
}

export interface ChatHistory {
  role: string;
  content: string;
}

export interface CardInfo {
  price: number;
  quantity: number;
  productName: string
  id: string;
  productId: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface CartItem {
  id?: number;
  productId: number;
  quantity: number;
}

export interface CartRequestDto {
  id?: string;
  idctsp?: string;
  soLuong: number;
  idNguoiDung: string;
}

export interface ReviewRequestDto {
  userId: number|null;
  productId: number|null;
  content: string;
  rating: number;
}

export interface GetCartReponseDto {
  cartId: string;
  productImage: string;
  price: number;
  productName: string;
  quantity: number;
  productId: string;
  remainingQuantity: number;
  idCartDeatail: string;
  idChiTietSP: string;
}

export interface Cart {
  id: string;
  listCartItem: Array<CartItem>;
}


export interface SignUpInfo {
  name: string;
  email: string; 
  password: string; 
}

export interface InputFieldProps {
  type: string;
  label: string;
  name: string;
  children: ReactNode;
}

export interface GetUserInfoDto {
  id: number;
  name: string;
  email: string;
}

export interface KichCo {
  id: string;
  ten: string;
  trangThai: number;
  chiTietSanPhams: any | null;
}

export interface MauSac {
  id: string;
  ten: string;
  ma: string;
  trangThai: number;
  chiTietSanPhams: any | null;
  anhs: any | null;
}


export interface KhachHang {
  idKhachHang: string;
  ten: string;
  password: string;
  gioiTinh: number | null;
  ngaySinh: string | null;
  email: string;
  diaChi: string | null;
  sdt: string | null;
  diemTich: number | null;
  trangThai: string | null;
  gioHang: any | null;
  lichSuTichDiems: any | null;
}

export interface LoaiSP {
  id: string;
  ten: string;
  trangThai: number;
  idLoaiSPCha: string | null;
  sanPhams: any | null;
  loaiSPCha: LoaiSP | null;
}
export interface SanPham {
  id: string;
  ten: string;
  ma: string;
  anh: string;
  giaBan: number;
  giaGoc: number;
  soLuong: number;
  chatLieu: string;
  loaiSPCha: string;
  loaiSPCon: string;
  trangThai: number;
  idKhuyenMai: string | null;
  mota: string | null;
}

export interface ChatLieu {
  id: string;
  ten: string;
  trangThai: number;
  sanPhams: any | null;
}

export interface SanPhamRequest {
  id: string;
  ten: string;
  moTa?: string;
  tenChatLieu: string;
  mauSacs: MauSac[];
  kichCos: string[];
  tenLoaiSPCha: string;
  tenLoaiSPCon: string;
}

export interface ChiTietSanPhamRequest {
  idChiTietSanPham: string;
  idMauSac?: string;
  idKichCo?: string;
  tenKichCo?: string;
  tenMauSac?: string;
  maMau?: string;
  soLuong?: number;
  giaBan?: number;
  urlAnh?: string;
}

export interface ChiTietSanPhamUpdateRequest {
  idSanPham: string;
  ma?: string;
  chiTietSanPhams: ChiTietSanPhamRequest[];
  trangThai?: string;
  location?: number;
  mauSacs?: MauSac[];
}

export interface HoaDon {
  id: string;
  maHD: string;
  thoiGian: string;
  khachHang: string;
  sdtkh: string | null;
  sdTnhanhang: string;
  tongTienHang: number;
  khachDaTra: number;
  pttt: string;
  trangThai: number;
  loaiHD: number;
}

export interface ProductAdmin {
  id: string;
  maSP: string;
  anh: string | null;
  ten: string;
  giaBan: number;
  idLsp: string;
  giaGoc: number;
}

export interface ProductDetail {
  idSanPham: string;
  ten: string;
  soSao: string;
  soDanhGia: number;
  sosaoPercent: number;
  mauSacs: MauSac1[];
  anhs: Anh[];
  kichCos: KichCo1[];
  chiTietSanPhams: ChiTietSanPham[];
  moTa: string;
  lstDanhGia: any | null;
  lstspTuongTu: SanPhamTuongTu[];
}

export interface KichCo1 {
  id: string;
  giaTri: string;
}

export interface MauSac1 {
  id: string;
  giaTri: string;
}

interface Anh {
  duongDan: string;
  maMau: string;
  idSanPham: string;
}

export interface ChiTietSanPham {
  id: string;
  ten: string;
  soLuong: number;
  giaBan: number;
  giaGoc: number;
  trangThai: number;
  anh: string | null;
  mauSac: string;
  kichCo: string;
  maCTSP: string;
  giaTriKM: number | null;
  trangThaiKM: number | null;
  ma: string | null;
  maMau: string | null;
  maKichCo: string | null;
}

interface SanPhamTuongTu {
  idsp: string;
  tenSP: string;
  duongDanSPTT: string;
  giaSPTT: number;
}