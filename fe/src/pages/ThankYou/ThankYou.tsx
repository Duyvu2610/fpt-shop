import { Link } from "react-router-dom";
import routes from "../../config/routes";
import { CardInfo, GetUserInfoDto } from "../../types/types";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import logoImg from "../../assets/images/logo.jpg";
import CouponCard from "../../components/CouponCard/CouponCard";
import Button from "../../components/Button";
import { FaPrint } from "react-icons/fa";
import { robotoBase64} from "../../utils/constance";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { baseAxios } from "../../api/axios";

function ThankYou() {
  const listCartPay: CardInfo[] = useSelector(
    (state: any) => state.app.listCartPay
  );

  const user: GetUserInfoDto = useSelector(
    (state: any) => state.auth.currentUser
  );

  const {t} = useTranslation();

  const iframeRef = useRef<HTMLIFrameElement>(null);  

  const printPDF = async () => {  
    try {  
      const pdfBlob = await generatePDFBlob(listCartPay);  
  
      if (pdfBlob && iframeRef.current) {  
        const pdfUrl = URL.createObjectURL(pdfBlob);  
        iframeRef.current.src = pdfUrl;  
        iframeRef.current.onload = () => {  
          iframeRef.current?.contentWindow?.print();  
        };  
      }  
    } catch (error) {  
      console.error("Error printing PDF:", error);  
    }  
  };

  const generatePDFBlob = (products: CardInfo[]): Blob => {
    const doc = new jsPDF();
    doc.addFileToVFS('Roboto.ttf', robotoBase64);  
    doc.addFont('Roboto.ttf', 'Roboto', 'normal');  
    doc.setFont('Roboto');
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const logoWidth = 30;
    const logoHeight = 10;
    const x = 10;
    const y = 10;
    doc.addImage(logoImg, "PNG", x, y, logoWidth, logoHeight);
    doc.setFontSize(18);
    doc.text(t("pdf.title"), 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("SEEDLING MARKET", 10, 30);
    doc.text(`${t("pdf.hotline")}: (+84) 999-439611`, 10, 35);
    doc.text("Email: seedlingmarket@company.com", 10, 40);

    doc.text(`${t("pdf.customer")}: ${user.name}`, 150, 30);
    doc.text(`${t("pdf.date")}: ${formattedDate}`, 150, 35);

    const tableColumn = [t("pdf.productId"), t("pdf.productName"), t("pdf.quantity"), t("pdf.price"), t("pdf.total")];
    const tableRows: any[] = [];

    let startY = 50;
    let totalAmount: number = 0;

    products.forEach((product) => {
      const total = product.quantity * product.price;
      totalAmount += total;

      const productData = [
        product.productId,
        product.productName,
        product.quantity,
        product.price + " VND",
        total + " VND",
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: startY,
      didDrawPage: (data: { doc: jsPDF; pageNumber: number }) => {
        startY = data.doc.internal.pageSize.height - 10;
        doc.setFontSize(14);  
        doc.text(`${t("pdf.totalPrice")}: ${totalAmount} VND`, 130, startY);  
      },
      styles: {
        font: 'Roboto',  
        fontStyle: 'normal'  
      }, 
    });

    return doc.output("blob");
  };

  useEffect(() => {
    const query = window.location.href.replace(window.location.origin + "/thank", '');
    baseAxios.get('/vnPay'+ query)
  }
  , []);

  return (
    <div className="w-full max-w-[1024px] md:mx-auto  py-20 gap-y-3 mt-6 mb-40 flex gap-4 justify-between items-center relative">
      <div className="flex flex-col gap-2 flex-1">
        <h1 className="text-4xl">Chúc mừng đơn đặt hàng của bạn đã thanh toán thành công 🎉</h1>

        <Link
          to={routes.home}
          className="rounded-xl bg-rgb(0, 136, 84)-300 font-semibold transition-all duration-300 ease-in-out text-black p-4 w-content underline"
        >
          Quay về trang chủ ➡
        </Link>
      </div>
    </div>
  );
}

export default ThankYou;
