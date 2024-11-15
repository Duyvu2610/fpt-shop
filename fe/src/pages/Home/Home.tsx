import { useEffect } from 'react';

import Arrivals from './Arrivals';
import Banner from './Banner';
import Reviews from './Reviews';
import TopSelling from './TopSelling';

const Home: React.FC = () => {

    // dùng để scroll về đầu trang khi chuyển qua trang khác
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="mb-[160px]">
            <Banner />
            <Arrivals />
            <TopSelling/>
            {/* <Reviews /> */}
        </div>
    );
}

export default Home;