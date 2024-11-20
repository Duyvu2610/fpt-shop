import { Link } from 'react-router-dom';
import Products from '../../components/Products';
import Title from '../../components/Title';
import { Product } from '../../types/types'; // import Product from types.ts
import config from '../../config';
import { useEffect, useState } from 'react';
import { callApi, getAllProduct } from '../../api/axios';
import { getBestSeller } from '../../api/homeApi';
import { useTranslation } from 'react-i18next';

const TopSelling: React.FC = () => {
    const sampleData: Product[] = [
        
      ];
    const [data, setData] = useState<Product[]>(sampleData);
    const {t} = useTranslation();
    useEffect(() => {
      const fetchData = async () => {
          const result: Product[] = await callApi(() => getAllProduct());
          result.sort((a, b) => {
              return b.giaGoc - a.giaGoc;
          });
          setData(result.slice(0, 5));
      };

      fetchData();
  }, []);
    return (
        <div className="wrapper">
            <Title className="text-center text-[32px] lg:text-[40px] mb-[64px] uppercase">Hàng bán chạy</Title>

            <Products data={data} />
            <div className="text-center my-[36px]">
                <Link to={config.routes.product} className="px-[54px] py-4 border rounded-[62px] w-full lg:w-auto  transition-all duration-300 hover:border-blue-400 ">
                    Xem Thêm
                </Link>
            </div>
        </div>
    );
}

export default TopSelling;