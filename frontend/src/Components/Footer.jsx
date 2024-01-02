import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitterX,
} from "react-icons/bs";

function Footer() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  return (
    <footer className="flex  flex-col sm:flex-row gap-10 items-center justify-center py-5 mb-2 ">
      <section className="text-lg sm:text-xl text-red font-bold ">
        Copyright {year} | All rights reserved
      </section>
      <section className="flex items-center justify-center gap-5 text-2xl text-white">
        <a className="hover:text-red-600 transition-all ease-in-out duration-300">
          <BsFacebook />
        </a>
        <a className="hover:text-red-600 transition-all ease-in-out duration-300">
          <BsInstagram />
        </a>
        <a className="hover:text-red-600 transition-all ease-in-out duration-300">
          <BsLinkedin />
        </a>
        <a className="hover:text-red-600 transition-all ease-in-out duration-300">
          <BsTwitterX />
        </a>
      </section>
    </footer>
  );
}

export default Footer;
