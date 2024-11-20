import { FormEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { baseAxios, callApi, forgotPass } from "../../api/axios";
import Logo from "../../assets/images/logo-fpt.png";
import { MailData } from "../../types/types";
import ConfirmResetPasswordModal from "./ConfirmCode";
import ChangePasswordForm from "./ChangePassword";

function ForgotPassword() {
  const input = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<number>(1);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await baseAxios.get("KhachHang/GetKhachHangByEmail?email=" + input.current?.value)
    if (!user.data.email) {
      toast.error("Email không tồn tại!");
      return;
    }
    const Ran = Math.floor(Math.random() * 1000000) + 100000;
    localStorage.setItem("Ran", Ran.toString());
    await callApi(() => forgotPass({
      emailToId: input.current?.value,
      emailToName: user.data.name,
      emailSubject: "Mã xác nhận",
      emailBody: "Mã xác nhận: " + Ran,
    } as MailData))
      .then((data) => {
        toast.success("Link thay đổi mật khẩu đã gửi đến email của bạn!", {autoClose: 3000});
        localStorage.setItem("idChangePass", user.data.id);
        setStep(2);
      })
      .catch(() => {
        toast.error("Email không tồn tại!");
      });
  };
  if (step === 2) {
    return (<ConfirmResetPasswordModal onSuccess={() => setStep(3)} />)
  } else if (step === 3) {
    return (<ChangePasswordForm />)
  }
  return (
    <div className=" flex py-10 max-w-xl m-auto  flex-col gap-y-3 items-center shadow-custom mt-20 mb-44">
      <img className="w-40" src={Logo} alt="" />
      <h1 className="text-3xl">Quên mật khẩu</h1>
      <p>Vui lòng nhập email để lấy lại mật khẩu</p>

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          ref={input}
          title="Email không hợp lệ"
          required
          pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
          placeholder="Nhập email của bạn"
          className="outline outline-1 outline-gray-300 focus:outline-primary rounded-lg  p-4"
          type="email"
        />
        <button
          type="submit"
          className="py-4 px-2 bg-gray-300 min-w-32 rounded-lg transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
        >
         Đổi mật khẩu
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
