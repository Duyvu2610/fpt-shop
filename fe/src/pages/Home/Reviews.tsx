import Title from "../../components/Title";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Review } from "../../types/types";
import {Swiper,  SwiperSlide } from "swiper/react";
import Card from "../../components/Card";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { getTopReview } from "../../api/axios";

function Reviews() {
  const sampleReviews: Review[] = [
    {
      id: 1,
      userId: 101,
      userName: 'User 1',
      content: 'This is a review from user 1.',
      rating: 4.5,
      updated: [2023, 1, 1, 12, 0, 0, 0]
    },
    {
      id: 2,
      userId: 102,
      userName: 'User 2',
      content: 'This is a review from user 2.',
      rating: 4.0,
      updated: [2023, 2, 1, 13, 0, 0, 0]
    },
    {
      id: 3,
      userId: 103,
      userName: 'User 3',
      content: 'This is a review from user 3.',
      rating: 3.5,
      updated: [2023, 3, 1, 14, 0, 0, 0]
    },
    {
      id: 4,
      userId: 104,
      userName: 'User 4',
      content: 'This is a review from user 4.',
      rating: 5.0,
      updated: [2023, 4, 1, 15, 0, 0, 0]
    },
    {
      id: 5,
      userId: 105,
      userName: 'User 5',
      content: 'This is a review from user 5.',
      rating: 4.8,
      updated: [2023, 5, 1, 16, 0, 0, 0]
    }
  ];
  const [reviews, setReviews] = useState<Review[]|null>(sampleReviews);
  const { t } = useTranslation();
  // useEffect(() => {
  //   const fetchReviews = async () => {
  //       const res = await getTopReview(5);
  //       setReviews(res);
  //       };
  //   fetchReviews();
  // }, [t]);
  return (
    <div className="wrapper">
      <div className="mt-[64px]">
        <Title className=" text-[32px] lg:text-[40px] text-center lg:text-left">
          Đánh giá từ khách hàng
        </Title>
        <div>
          <Swiper
            spaceBetween={20}
            slidesPerView={3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="py-3"
          >
            {reviews?.map((review) => (
              <SwiperSlide key={review?.id} className="min-w-[310px]" >
                <Card {...review}  />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
