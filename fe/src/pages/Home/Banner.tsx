import { Swiper, SwiperSlide } from "swiper/react";
import BannerImg1 from "../../assets/images/banner-1.png";
import BannerImg2 from "../../assets/images/banner-2.png";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function Banner() {
  return (
    <div className="bg-slate-100 h-[393px] w-[80%] mx-auto">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
        onSlideChange={() => console.log("slide change")}
      >
        <SwiperSlide>
        <img src={BannerImg1} alt="" className="h-[393px] w-full bg-cover" />
        </SwiperSlide>
        <SwiperSlide>
        <img src={BannerImg2} alt="" className=" h-[393px] w-full bg-cover" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Banner;
