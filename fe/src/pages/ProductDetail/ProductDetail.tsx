import { FormEvent, useEffect, useRef, useState } from "react";
import { AiTwotoneLike } from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import { CiShoppingCart, CiViewList } from "react-icons/ci";
import { FaAngleDown, FaEdit, FaShippingFast, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  addToCart,
  callApi,
  editReview,
  getAllProduct,
  getProduct,
  registerReview,
} from "../../api/axios";
import ActiveQuantity from "../../components/ActiveQuantity";
import Button from "../../components/Button";
import Pagianate from "../../components/PagianateNavBar/Paginate";
import ProductItem from "../../components/ProductItem";
import StarRating from "../../components/StarRating";
import ActiveStarRating from "../../components/StarRatingActive";
import Title from "../../components/Title";
import routes from "../../config/routes";
import { Product, Review, ReviewRequestDto } from "../../types/types";
import { convertLocalDateTimeToDate } from "../../utils/helper";
import { Emitter } from "../../eventEmitter/EventEmitter";
import Markdown from "react-markdown";
import SkeletonLoader from "./SkeletonLoader";

interface Props {}

function ProductDetail(_props: Props) {
  const { id } = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<Array<Review>>([]);
  const formReview = useRef<HTMLFormElement>(null);
  const detailH = useRef<HTMLDivElement | null>(null);
  const expandIconRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  // page use for review
  const [page, setPage] = useState<number>(0);
  const textReview = useRef<HTMLTextAreaElement>(null);
  const submitReview = useRef<HTMLButtonElement>(null);
  const numberOfPage = 5;
  const user: string = localStorage.getItem("userId") || "";

  const [rating, setRating] = useState(5);
  const navigate = useNavigate();

  const MySwal = withReactContent(Swal);

  const showEditReview = (
    originReview: string | null,
    originalRating: number | null
  ) => {
    function handleEditRating(rating: number): void {
      if (document.getElementById("swal-input2")) {
        const input = document.getElementById(
          "swal-input2"
        ) as HTMLInputElement;
        input.value = rating.toString();
      }
    }

    return MySwal.fire({
      title: (
        <>
          <p>Edit review</p>
          <ActiveStarRating
            rating={originalRating || 1}
            setRating={handleEditRating}
            className=""
          />
        </>
      ),
      html: '<input id="swal-input2" hidden class="swal2-input"></input>',
      input: "textarea",
      inputValue: originReview,
      inputAttributes: {
        required: "true",
      },
      showCancelButton: true,
      confirmButtonText: "Edit review",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      preConfirm: () => {
        const content = Swal.getInput()?.value;
        const editRating = Swal.getPopup()!.querySelector(
          "#swal-input2"
        ) as HTMLInputElement;

        return { content, editRating: editRating.value };
      },
    });
  };

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

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };
  const [data, setData] = useState<Product>();
  const [topSelling, setTopSelling] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const result: Product[] = await callApi(() => getAllProduct("00000000-0000-0000-0000-000000000000"));
        result.sort((a, b) => {
            return new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime();
        });
        setTopSelling(result.slice(0, 5));
    };

    fetchData();
}, []);

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
      // const topSellingProduct = await getBestSeller();
      // setTopSelling(topSellingProduct);
    };

    fetchProduct();
  }, [id]);

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     const result: Review[] = await getReviewsByProductId(Number(id));
  //     setReviews(result);
  //   };
  //   fetchReviews();
  // }, []);

  function handleAddToCart() {
    const addCart = async () => {
      addToCart({
        productId: data?.idChiTietSanPham,
        userId: user,
        quantity: quantity,
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
  async function handleSubmitReviews(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!textReview.current?.value.trim()) {
      textReview.current?.setCustomValidity(
        "Content must be at least 1 character diff space"
      );
      return;
    }

    if (!user) {
      showSwal().then((value) => {
        if (value.isConfirmed) {
          navigate(routes.login);
        }
      });
      return;
    }

    const data: ReviewRequestDto = {
      productId:
        formReview.current && Number(formReview.current.productId.value),
      userId: formReview.current && Number(formReview.current.userId.value),
      rating: rating,
      content: textReview.current.value,
    };

    await registerReview(data).then((data) => {
      if (data) {
        toast.success("Review successfully!");
        if (textReview.current) {
          textReview.current.value = "";
        }
        setReviews((prev) => [data, ...prev]);
      }
    });
  }

  console.log(data);

  return (
    <div className="mb-[124px]">
      <div className="wrapper">
        <div className="flex flex-col lg:flex-row gap-14 mt-9 pb-8">
          {data ? (
            <>
              <div className=" w-[300px] mx-auto grid place-items-center">
                <img
                  src={data?.image}
                  alt=""
                  onLoad={() => setLoaded(true)}
                  className={`w-full rounded-[20px] ${
                    loaded ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-500`}
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
                <p className="text-[#003b31] font-semibold pb-4">
                  Số lượng còn lại:{" "}
                  <span className="font-normal">{data.soLuong}</span>
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

        {/* Review */}
        
      </div>

      {/* Top selling */}
      <Title className="text-center text-[24px] lg:text-[40px] my-[64px] uppercase">Sản phẩm khác</Title>
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
