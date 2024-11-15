import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPhone } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";

interface FormValues {
  fullName: string;
  street: string;
  phoneNo: string;
  email: string;
  message: string;
}

interface Errors {
  [key: string]: string;
}

function Contact() {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<FormValues>({
    fullName: "",
    street: "",
    phoneNo: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (): boolean => {
    let tempErrors: Errors = {};
    tempErrors.fullName = formValues.fullName ? "" : "Full Name is required.";
    tempErrors.street = formValues.street ? "" : "Street is required.";
    tempErrors.phoneNo = formValues.phoneNo ? "" : "Phone No. is required.";
    tempErrors.email = formValues.email ? "" : "Email is required.";
    tempErrors.message = formValues.message ? "" : "Message is required.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setFormValues({
        fullName: "",
        street: "",
        phoneNo: "",
        email: "",
        message: "",
      });
      toast.success("Send Message successfully!");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="wrapper">
      <div className="mb-[140px] grid md:grid-cols-2 gap-16 items-center relative overflow-hidden p-10 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-3xl bg-white text-black before:absolute before:right-0 before:w-[300px] before:bg-blue-400 before:h-full max-md:before:hidden">
        <div>
          <h2 className="text-3xl font-semibold">Liên hệ với chúng tôi</h2>
          <p className="text-sm text-gray-400 mt-3">
          Liên hệ với chúng tôi khi bạn có thắc mắc
          </p>
          <p className="mt-4 font-bold text-lg">Số điện thoại</p>
          <p className="text-sm mb-4 mt-2">
          <li className="flex items-center text-current hover:text-blue-500">
              <FaPhone className="w-4 h-4 text-gray-500" />
              <a href="tel:0981972202" className="text-current text-sm ml-3">
                <strong>0914493045</strong>
              </a>
            </li>
          </p>
          <p className="mt-4 font-bold text-lg">Email</p>
          <p className="text-sm mb-4 mt-2"><li className="flex items-center hover:text-blue-500">
              <MdOutlineEmail className="w-6 h-6 text-gray-500" />
              <a
                href="mailto:phuongnam.ToanNB2@fpt.net"
                className="text-current text-sm ml-3"
              >
                <strong>phuongnam.ToanNB2@fpt.net</strong>
              </a>
            </li></p>
          <p className="mt-4 font-bold text-lg">Địa chỉ</p>
          <p className="text-sm mb-4">FPT Telecom 791 Đ.Đồng Khởi, Khu phố 8, Biên Hòa, Đồng Nai.</p>
        </div>
        <div className="z-10 relative h-full max-md:min-h-[350px]">
          <iframe
          title="map"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d57365.5224985555!2d106.850955!3d10.974743!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb18a806781%3A0x4c1fdbe4bc7e4a9!2sFPT%20Telecom%20-%20CN%20%C4%90%E1%BB%93ng%20Nai!5e1!3m2!1svi!2sus!4v1730958060051!5m2!1svi!2sus"
            width="600"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;
