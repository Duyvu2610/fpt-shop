import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { baseAxios, callApi, getAllProduct } from "../../api/axios";
import ProductItem from "../../components/ProductItem";
import { Product } from "../../types/types";
import { Link } from "react-router-dom";

function ProductPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loaiSp, setLoaiSp] = useState<any[]>([]);
  const [selectedLoai, setSelectedLoai] = useState<string | null>(null);


  useEffect(() => {
    getAllProduct(selectedLoai).then((res) => {
      setAllProducts(res);
    });
    baseAxios.get("LoaiSP/getAll").then((res) => {
      setLoaiSp(res.data);
    });
  }, [ selectedLoai]);



  return (
    <div className="px-[10%] mb-20 pb-20">
      <div className="flex items-center gap-x-4 py-10">
        <Link to = {"/"} className="text-gray-400">Trang chủ</Link>{" "}
        <FaChevronRight size={12} /> Sản phẩm
      </div>
      <div className="flex gap-x-10 flex-col xl:flex-row gap-y-5">
        <div className="w-[300px] border-gray-300 border border-solid rounded-[20px] h-fit ">
          <h3 className="px-4 py-3 pt-6 text-xl cursor-default ">Lọc giá</h3>

          <div className="px-4 pb-4 flex flex-col gap-2 max-h-[300px] overflow-auto">
          <div className=" flex gap-2 items-center"> 
                <input
                  type="radio"
                  name="radio-1"
                  className="radio"
                  value= "00000000-0000-0000-0000-000000000000"
                  onChange={() => setSelectedLoai("00000000-0000-0000-0000-000000000000")}
                  id="00000000-0000-0000-0000-000000000000"
                />
                <label className="label" htmlFor="00000000-0000-0000-0000-000000000000">
                  Tất cả
                </label>
              </div>
            {loaiSp.map((loai, index) => (
              <div className=" flex gap-2 items-center" key={index}> 
                <input
                  type="radio"
                  name="radio-1"
                  className="radio"
                  value={loai.id}
                  id={loai.id}
                  onChange={() => setSelectedLoai(loai.id)}
                />
                <label htmlFor={loai.id} className="label">
                  {loai.ten}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
            <ul className=" grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-10 auto-rows-max">
              {allProducts.map((prod, index) => (
                <ProductItem product={prod} key={index} />
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
