import { Link } from 'react-router-dom';
import Products from '../../components/Products';
import Title from '../../components/Title';
import { Product } from '../../types/types';
import config from '../../config';
import { callApi, getAllProduct } from '../../api/axios';
import { getNewProduct } from '../../api/homeApi';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Arrivals: React.FC = () => {
    const sampleData: Product[] = [];
    const [data, setData] = useState<Product[]>(sampleData);

    useEffect(() => {
        const fetchData = async () => {
            const result: Product[] = await callApi(() => getAllProduct("00000000-0000-0000-0000-000000000000"));
            result.sort((a, b) => {
                return new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime();
            });
            setData(result.slice(0, 5));
        };

        fetchData();
    }, []);

    return (
        <div className="wrapper">
            <div className="py-[64px]">
                <Title className="text-center text-[32px] lg:text-[40px] mb-[64px] uppercase">Sản phẩm mới</Title>
                <Products data={data} />
                <div className="text-center mt-[36px] pb-[64px] border-b">
                    <Link to = {config.routes.product} className="px-[54px] py-4 border rounded-[62px] w-full lg:w-auto  transition-all duration-300 hover:border-blue-400 ">
                        Xem thêm
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Arrivals;