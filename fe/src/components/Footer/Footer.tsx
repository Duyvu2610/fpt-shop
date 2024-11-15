import FooterContent from './FooterContent';
import FooterTop from './FooterTop';

function Footer() {
    return (
        <div className="bg-[#F0F0F0]">
            <div className="wrapper -translate-y-[90px]">
                <FooterTop />

                <FooterContent />

            </div>
        </div>
    );
}

export default Footer;
