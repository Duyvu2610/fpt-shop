import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { Product } from "../types/types";
import routes from "../config/routes";
import { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { Emitter } from "../eventEmitter/EventEmitter";
import { addToCart, callApi } from "../api/axios";
import { toast } from "react-toastify";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";
import { useTranslation } from 'react-i18next';

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const [loaded, setLoaded] = useState(false);
  const [isCallApi, setIsCallApi] = useState(false);
  const currentUser = localStorage.getItem("userId") || "";

  function handleAddToCart() {
    if (isCallApi) return;
    const addCart = async () => {

      try {
        setIsCallApi(() => true)
        await addToCart({
          soLuong: 1,
          idctsp: product.idChiTietSanPham || undefined,
          idNguoiDung: currentUser
        });
        Emitter.emit("updateCartNumber");
        toast.success("Bạn đã thêm sản phẩm thành công!");
        setIsCallApi(() => false)
      } catch (error: any) {
        if (error.response.status === 403) {
          toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
        }
        setIsCallApi(() => false)
      }
    };
    addCart();
  }

  return (
    <div className="cursor-pointer overflow-hidden shadow p-4 rounded-[20px]">
      <Link
        to={`${routes.product}/${product?.id}`}
        className="overflow-hidden rounded-[20px]"
      >
        <img
          src={product?.image}
          loading="lazy"
          alt=""
          onLoad={() => setLoaded(true)}
          className={`rounded-[20px] w-full h-[287px] object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </Link>

      <div className="mt-4 space-y-2">
        <h3 className=" capitalize line-clamp-1">{product?.ten}</h3>
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2">
            <StarRating rating={product?.soSao} />
            <span className="">
              {product?.soSao}/{" "}
              <span className="text-[rgba(0, 0, 0, 0.60)]">5</span>{" "}
            </span>
          </div>
          <div
            className="bg-white rounded-full p-2 hover:bg-slate-200 transition-all duration-300"
            onClick={handleAddToCart}
          >
            {isCallApi ? <AiOutlineLoading size={25} className="animate-spin" />: <CiShoppingCart size={25} />}

          </div>
        </div>
        <div className="flex justify-between">
          <span className=" font-semibold">{product?.giaGoc} VND</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;