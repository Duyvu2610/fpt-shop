import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { baseAxios, callApi, getAllProduct } from "../../api/axios";
import ProductItem from "../../components/ProductItem";
import { Product } from "../../types/types";
import { Link } from "react-router-dom";
import { Tree, TreeProps } from "antd";

interface LoaiSP {
  id: string;
  ten: string;
  idLoaiSPCha: string | null;
  children?: LoaiSP[];
}

function ProductPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loaiSp, setLoaiSp] = useState<LoaiSP[]>([]);
  const [selectedLoai, setSelectedLoai] = useState<string | null>(
    "00000000-0000-0000-0000-000000000000"
  );
  const [allProductFixed, setallProductFixed] = useState<Product[]>([]);

  useEffect(() => {
    getAllProduct().then((res) => {
      setAllProducts(res);
      setallProductFixed(res);
    });
    baseAxios.get("LoaiSP/getAll").then((res) => {
      setLoaiSp(res.data);
    });
  }, []);

  useEffect(() => {
    baseAxios.get("LoaiSP/getAll").then((res) => {
      const categorizedLoaiSp: LoaiSP[] = res.data.reduce(
        (acc: LoaiSP[], loai: LoaiSP) => {
          if (!loai.idLoaiSPCha) {
            acc.push({ ...loai, children: [] });
          } else {
            const parent = acc.find((item) => item.id === loai.idLoaiSPCha);
            if (parent) {
              parent.children = [...(parent.children || []), loai];
            }
          }
          return acc;
        },
        []
      );
      setLoaiSp(categorizedLoaiSp);
    });
  }, []);

  useEffect(() => {
    if (selectedLoai === "00000000-0000-0000-0000-000000000000") {
      setAllProducts(allProductFixed);
    } else {
      const filteredProducts = allProductFixed.filter(
        (prod) => prod.loaiSP === selectedLoai
      );
      setAllProducts(filteredProducts);
    }
  }, [selectedLoai, allProductFixed]);

  const handleTreeSelect = (selectedKeys: any) => {
    setSelectedLoai(
      (selectedKeys[0] as string) || "00000000-0000-0000-0000-000000000000"
    );
    console.log(selectedKeys);
  };

  return (
    <div className="px-[10%] mb-20 pb-20">
      <div className="flex items-center gap-x-4 py-10">
        <Link to={"/"} className="text-gray-400">
          Trang chủ
        </Link>{" "}
        <FaChevronRight size={12} /> Sản phẩm
      </div>
      <div className="flex gap-x-10 flex-col xl:flex-row gap-y-5">
        <div className="w-[300px] border-gray-300 border border-solid rounded-[20px] h-fit p-4">
          <h3 className="px-4 py-3 pt-6 text-xl cursor-default">
            Lọc danh mục
          </h3>
          <Tree
          showLine
            treeData={loaiSp.map((item) => ({
              title: item.ten,
              key: item.ten,
              children: item.children?.map((child) => ({
                title: child.ten,
                key: child.ten,
              })),
            }))}
            onSelect={handleTreeSelect}
          />
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
