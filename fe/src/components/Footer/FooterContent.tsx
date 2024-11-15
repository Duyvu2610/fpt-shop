import { useTranslation } from 'react-i18next';
import { FaTwitter } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import VnPay from '../../assets/images/paymentvnpay.png';

function FooterContent() {
    const {t} = useTranslation();
    return (
        <div className="py-[50px] mt-0 border-b border-gray-300 flex lg:flex-row flex-col lg:gap-[110px] gap-6">
            <div className="w-[248px]">
                <h2 className="font-[IntegralCf] text-[24px]">
                Tư vấn thanh toán (Miễn phí).</h2>
                <p className="my-[30px]">
                Phương thức thanh toán:
                </p>
                <div className="flex gap-3">
                    <img src={VnPay} alt="" />
                </div>
            </div>

            <div className="flex-1 grid lg:grid-cols-2 grid-cols-2 text-left gap-6">
                <div className="space-y-4">
                    <h2 className="tracking-widest uppercase "> Thông tin liên hệ</h2>
                    <p><span className='font-bold mr-2'>By: </span>Nguyễn Bá Toàn.</p>
                    <p><span className='font-bold mr-2'>Địa chỉ:</span> 791 Đ.Đồng Khởi, Khu phố 8, Biên Hòa, Đồng Nai.</p>
                    
                    <p><span className='font-bold mr-2'>Điện thoại:</span> 0914493045</p>
                    <p><span className='font-bold mr-2'>Email: </span>phuongnam.ToanNB2@fpt.net</p>
                </div>

                <div className="space-y-4">
                    <h2 className="tracking-widest uppercase ">Mua hàng</h2>
                    <p>Đa dạng sản phẩm</p>
                    <p>Thanh toán online</p>
                </div>
            </div>
        </div>
    );
}

export default FooterContent;
