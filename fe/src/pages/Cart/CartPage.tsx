import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { baseAxios, callApi, getCartByUser, payCart } from "../../api/axios";
import { Emitter as emitter } from "../../eventEmitter/EventEmitter";
import { RootState } from "../../redux/store";
import { CardInfo, GetCartReponseDto } from "../../types/types";
import { addListCartPay } from "../../redux/appSlice";

import CartDetail from "./CartDetail";
import Button from "../../components/Button";

import routes from "../../config/routes";

import { useTranslation } from "react-i18next";
import PaymentForm from "./PaymentForm ";
function CartPage() {
  const [products, setProducts] = useState<GetCartReponseDto[]>([]);
  const [totalCard, setTotalCard] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isRerender, setIsRerender] = useState<boolean>(false);
  const [listCartPay, setListCartPay] = useState<GetCartReponseDto[]>([]);

  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    const fecth = async () => {
      userId
        ? setProducts(await callApi(() => getCartByUser(userId)))
        : setProducts([]);
    };
    fecth();
    window.scrollTo(0, 0);
  }, [isRerender]);

  useEffect(() => {
    const handleChecked = (element: GetCartReponseDto) => {
      setTotalCard((prevQuantity) => prevQuantity + element.quantity);
      setTotalPrice((prevPrice) => prevPrice + element.price);
      setListCartPay((prev) => {
        const index = prev.findIndex((item) => item.idCartDeatail === element.idCartDeatail);
        if (index === -1) {
          // Nếu element không tồn tại trong listCartPay, thêm mới
          return [...prev, element];
        } else {
          // Nếu element đã tồn tại, cập nhật quantity
          return prev.map((item, idx) =>
            idx === index
              ? { ...item, quantity: item.quantity + element.quantity }
              : item
          );
        }
      });
    };

    const handleUnchecked = (element: GetCartReponseDto) => {
      setTotalCard((prevQuantity) => prevQuantity - element.quantity);
      setTotalPrice((prevPrice) => prevPrice - element.price);
      setListCartPay((prev) => prev.filter((item) => item.idCartDeatail !== element.idCartDeatail));
      setIsChecked(false);
    };

    const handleDeletedCard = () => {
      setIsRerender((prev) => !prev);
    };

    emitter.on("elementChecked", handleChecked);
    emitter.on("elementUnchecked", handleUnchecked);
    emitter.on("deletedCard", handleDeletedCard);

    return () => {
      emitter.off("elementChecked", handleChecked);
      emitter.off("elementUnchecked", handleUnchecked);
      emitter.off("deletedCard", handleDeletedCard);
    };
  }, [products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isCheckedNew = e.target.checked;
    setIsChecked(isCheckedNew);
    emitter.emit("checkAll", isCheckedNew);
  };

  const handleBuyProduct = async () => {
    // if (products.length === 0) return;
    // if (listCartPay.length === 0) {
    //   toast.error("Vui lòng chọn sản phẩm để mua");
    //   return;
    // }
    // const fecth = async () => {
    //   try {
    //     await callApi(() => payCart(listCartPay));
    //     setIsRerender(prev => !prev);
    //     setTotalCard(0);
    //     setTotalPrice(0);
    //     setIsChecked(false);
    //     dispatch(addListCartPay(listCartPay))
    //     navigate(routes.thank);
    //     emitter.emit("updateCartNumber");
    //   } catch (error) {
    //     toast.error("Số lượng mua vượt quá số lượng trong kho");
    //   }
    // }
    // fecth();
    //   baseAxios.post("/vnPay", {
    //     "OrderType": "billpayment", // Loại đơn hàng
    //     "Amount": totalPrice, // Số tiền thanh toán (VNĐ)
    //     "OrderDescription": "Thanh toán hóa đơn mua hàng", // Mô tả đơn hàng
    //     "Name": "Nguyen Van A" // Tên khách hàng
    // }).then((res) => {
    //     console.log(res.data);
    //       window.location.href = res.data;
    //       dispatch(addListCartPay(listCartPay));
    //       // navigate(routes.thank);
    //   }).catch((err) => {
    //     console.log(err);
    // });
  };

  return (
    <div className="pb-[160px] bg-[#f5f5f5]">
      <div className="wrapper px-5 ">
        <div className="flex justify-between items-center px-8 py-4 mb-4 bg-white">
          <div className="flex-1">
            <input
              type="checkbox"
              id="checkAll"
              className="mr-4"
              onChange={handleChange}
              checked={isChecked}
            />
            <label htmlFor="checkAll" className="cursor-pointer select-none">
              Chọn tất cả
            </label>
          </div>
          <div className="flex flex-1 justify-between text-[#888888]">
            <div className="flex-1 text-center">Số tiền</div>
            <div className="flex-1 text-center">Số lượng</div>
            <div className="flex-1 text-center">Giá</div>
            <div className="flex-1 text-end">Hành động</div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mb-4">
          {products.map((product, index) => {
            return <CartDetail getCardReponseDto={product} key={index} />;
          })}
        </div>
        <div className="flex justify-between items-center px-8 py-4 mb-4 bg-white">
          <div className="flex-1"></div>
          <div className="flex flex-1 justify-between items-center">
            <div className="text-center">
              Tổng số tiền ({totalCard} Sản phẩm)
              <span className="text-[#EE4D2D]">đ{totalPrice}</span>
            </div>
            <Button
              onClick={() => {
                if (listCartPay.length === 0) {
                  toast.error("Vui lòng chọn sản phẩm để mua");
                  return;
                }
                (
                  document.getElementById("my_modal_3") as HTMLDialogElement
                )?.showModal();
              }}
              className={`${
                listCartPay.length !== 0 ? "" : "select-none cursor-not-allowed"
              }`}
            >
              <p>Thanh toán</p>
            </Button>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">Điền thông tin thanh toán</h3>
                <p className="py-4">
                  <PaymentForm total={totalPrice} idCardDetail={listCartPay.map(item => item.idCartDeatail).toString()}/>
                </p>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
