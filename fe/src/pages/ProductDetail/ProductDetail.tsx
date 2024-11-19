import { FormEvent, useEffect, useRef, useState } from "react";
import { AiTwotoneLike } from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import { CiShoppingCart, CiViewList } from "react-icons/ci";
import { FaAngleDown, FaEdit, FaShippingFast, FaUser } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  addToCart,
  baseAxios,
  callApi,
  getAllProduct,
  getProduct,
  registerReview,
} from "../../api/axios";
import ActiveQuantity from "../../components/ActiveQuantity";
import Button from "../../components/Button";
import ProductItem from "../../components/ProductItem";
import StarRating from "../../components/StarRating";
import Title from "../../components/Title";
import routes from "../../config/routes";
import {
  Product,
  ProductDetail as MyProduct,
  Review,
  ReviewRequestDto,
} from "../../types/types";
import { Emitter } from "../../eventEmitter/EventEmitter";
import Markdown from "react-markdown";
import SkeletonLoader from "./SkeletonLoader";
import { SwiperSlide, Swiper } from "swiper/react";
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

interface Props {}

function ProductDetail(_props: Props) {
  const { id } = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const detailH = useRef<HTMLDivElement | null>(null);
  const expandIconRef = useRef<HTMLDivElement | null>(null);
  // page use for review
  const user: string = localStorage.getItem("userId") || "";


  const [chiTietSanPham, setChiTietSanPham] = useState<MyProduct>();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedIDCTSP, setselectedIDCTSP] = useState<string | null>(null);
  const [quantityProduct, setQuantityProduct] = useState<number | null>(null);

  const handleChangeDetailHeight = () => {
    if (detailH.current) {
      if (detailH.current.style.maxHeight) {
        detailH.current.style.maxHeight = "";
        expandIconRef.current?.style.setProperty("rotate", "0deg");
      } else {
        detailH.current.style.maxHeight = `${detailH.current.scrollHeight}px`;
        expandIconRef.current?.style.setProperty("rotate", "180deg");
      }
    }
  };

  const fetchChiTietSanPham = async () => {
    const result = await baseAxios.get(
      "SanPham/GetAllChiTietSanPhamHome?idSanPham=" + id
    );
    console.log(result.data);
    setChiTietSanPham(result.data);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };
  const [data, setData] = useState<Product>();
  const [topSelling, setTopSelling] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result: Product[] = await callApi(() =>
        getAllProduct("00000000-0000-0000-0000-000000000000")
      );
      result.sort((a, b) => {
        return new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime();
      });
      setTopSelling(result.slice(0, 5));
    };

    fetchData();
  }, [id]);

  const showSwal = () => {
    return Swal.fire({
      title: "Bạn chưa đăng nhập?",
      text: "Hãy đăng nhập để tiếp tục nhé",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng nhập",
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      window.scrollTo(0, 0);
      if (id) {
        const product = await getProduct(id);
        setData(product);
      }
    };

    fetchProduct();
    fetchChiTietSanPham();
  }, [id]);

  useEffect(() => {
    if (selectedColor && selectedSize && data && chiTietSanPham) {
      const chiTiet = chiTietSanPham.chiTietSanPhams.find(
        (item) => item.mauSac === selectedColor && item.kichCo === selectedSize
      );
      setQuantityProduct(chiTiet ? chiTiet.soLuong : 0);
      setselectedIDCTSP(chiTiet ? chiTiet.id : null);
    }
  }, [selectedColor, selectedSize, data]);

  function handleAddToCart() {
    const addCart = async () => {
      addToCart({
        soLuong: quantity,
        idctsp: selectedIDCTSP || undefined,
        idNguoiDung: user
      })
        .then(() => {
          Emitter.emit("updateCartNumber");
          toast.success("Bạn đã thêm sản phẩm thành công!");
        })
        .catch((error: any) => {
          toast.error("Thêm sản phẩm thất bại!");
        });
    };
    addCart();
  }

  return (
    <div className="mb-[124px]">
      <div className="wrapper">
        <div className="flex flex-col lg:flex-row gap-14 mt-9 pb-8">
          {data ? (
            <>
              <div className="w-[300px] mx-auto grid place-items-center">
                      <img
                        src={chiTietSanPham?.anhs[0].duongDan}
                        alt=""
                        className="bg-cover"
                      />
              </div>

              <div className="flex-1">
                {/* Details */}
                <Title className="text-[40px] mb-3 line-clamp-2">
                  {data?.ten}
                </Title>
                <div className="flex gap-x-2 items-center mt-2">
                  <StarRating rating={data?.soSao} />
                  <span>{data?.soSao} / 5</span>
                </div>
                <span className="my-3 block  text-[32px]">
                  {data?.giaGoc} VND
                </span>
                <p className="text-[#003b31] font-semibold pb-4 flex gap-2">
                  Màu sắc
                  <ul className="flex gap-4">
                    {chiTietSanPham?.mauSacs.map((mauSac) => (
                      <li
                        key={mauSac.id}
                        style={{ display: "flex", alignItems: "center" }}
                        onClick={() => setSelectedColor(mauSac.id)}
                      >
                        <span
                          className={`hover:scale-110 transition-all duration-300 ${
                            selectedColor === mauSac.id ? "scale-125" : ""
                          }`}
                          style={{
                            display: "inline-block",
                            width: "30px",
                            height: "30px",
                            backgroundColor: mauSac.giaTri,
                            border: "1px solid #000",
                            borderRadius: "8px",
                            marginRight: "8px",
                          }}
                        ></span>
                      </li>
                    ))}
                  </ul>
                </p>

                <p className="text-[#003b31] font-semibold pb-4 flex gap-2 items-center">
                  Kích thước
                  <ul className="flex gap-2">
                    {chiTietSanPham?.kichCos.map((kichCo) => (
                      <li
                        key={kichCo.id}
                        onClick={() => setSelectedSize(kichCo.id)}
                        className={`border py-2 px-4 rounded-lg hover:scale-110 transition-all duration-300 cursor-pointer ${
                          selectedSize === kichCo.id
                            ? "bg-[#003b31] text-white"
                            : "border-[#003b31]"
                        }`}
                      >
                        {kichCo.giaTri}
                      </li>
                    ))}
                  </ul>
                </p>

                <p className="text-[#003b31] font-semibold pb-4">
                  Số lượng còn lại:{" "}
                  <span className="font-normal">
                    {quantityProduct !== null
                      ? quantityProduct
                      : "Vui lòng chọn màu sắc và kích thước"}
                  </span>
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <ActiveQuantity
                    className=""
                    onQuantityChange={handleQuantityChange}
                    quantity={quantity}
                  ></ActiveQuantity>
                  <Button onClick={handleAddToCart} className="">
                    <strong className="">Thêm vào giỏ hàng</strong>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <SkeletonLoader />
          )}
          <div className="border w-64 rounded-md flex flex-col gap-3 p-2 text-sm">
            <div className="uppercase text-[#003b31] text-lg text-center">
              Chăm sóc khách hàng
            </div>
            <div className="flex border-t py-1 justify-center items-center gap-2">
              <CiViewList size={60} color="#003b31" />
              <p>Đảm bảo hàng chính hãng 100%</p>
            </div>
            <div className="flex border-t py-1 justify-center items-center gap-2">
              <AiTwotoneLike size={60} color="#003b31" />
              <p>Hỗ trợ đổi trả mọi lúc mọi nơi</p>
            </div>
            <div className="flex border-t py-1 justify-center items-center gap-2">
              <FaShippingFast size={60} color="#003b31" />
              <p>Miễn phí vận chuyển cho đơn hàng từ 350.000đ</p>
            </div>
            <div className="flex border-t py-1 justify-center items-center gap-2">
              <BsClockHistory size={40} color="#003b31" />
              <p>Giao hàng nhanh gọn trong 3h</p>
            </div>
          </div>
        </div>
        <p className="text-center font-normal mt-4 text-xl uppercase text-[#003b31] border-b mb-4">
          <span className="relative after:content-[''] after:ml-0.5 after:w-full after:h-[2px] after:bg-[#003b31] after:bottom-0 after:block inline-block">
            Mô tả
          </span>
        </p>
        <div
          ref={detailH}
          className="transition-all max-w-[400px] mx-auto duration-500 overflow-hidden max-h-[100px]"
        >
          {data ? (
            <Markdown className={`py-4 border-b`}>{data.mota}</Markdown>
          ) : (
            <div className="animate-gradient w-full h-40 bg-[#d2d2d2] rounded-lg"></div>
          )}
        </div>

        <div ref={expandIconRef}>
          <FaAngleDown
            size={40}
            className="mx-auto animate-bounce mt-2 cursor-pointer transition-all duration-500"
            onClick={handleChangeDetailHeight}
          />
        </div>
      </div>

      {/* Top selling */}
      <Title className="text-center text-[24px] lg:text-[40px] my-[64px] uppercase">
        Sản phẩm khác
      </Title>
      <div className="mt-[60px] wrapper">
        <ul className="flex-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid gap-10 auto-rows-max">
          {topSelling.slice(0, 12).map((product, index) => (
            <ProductItem product={product} key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProductDetail;
