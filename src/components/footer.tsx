"use client";

import Image from "next/image";
import Link from "next/link";
import { IoLogoInstagram } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#672862] text-[#F8FAE8]">
      {/* Full-width background extension */}
      <div className="absolute inset-0 bg-[#672862] -z-10" />
      
      {/* Content container */}
      <div className="relative w-full max-w-full mx-auto">
        {/* Desktop layout (lg and up) */}
        <div className="hidden lg:flex w-full min-h-[384px]">
          {/* Left content section */}
          <div className="flex-1 relative min-h-[384px] pl-[69px] pt-[56px] pr-[320px]">
            {/* Logo */}
            <Image
              src="/assets/logos/Primary-Logo-White.svg"
              alt="logo"
              width={54}
              height={33}
              className="absolute top-[56px] left-[69px]"
            />

            {/* Headline */}
            <p className="absolute top-[115px] left-[69px] text-[38px] font-['Satoshi'] font-medium leading-[120%] tracking-[-0.02em]">
              Start renting <span className="italic">today</span>
            </p>

            {/* Button */}
            <button className="absolute top-[184px] left-[69px] bg-[#B361A6] text-[#FCF2F8] text-[18px] leading-[24px] font-['Satoshi'] font-bold uppercase w-[197px] h-[46px]">
              Request a brand
            </button>

            {/* Divider */}
            <hr className="absolute top-[274px] left-[69px] right-[389px] border-t border-[#F8FAE8]" />

            {/* Contact Section */}
            <div className="absolute top-[56px] right-[69px] flex flex-col items-end gap-3 w-[124px]">
              <p className="text-[18px] font-medium leading-[120%] text-right">Contact Us</p>
              <p className="text-[18px] font-medium leading-[120%] text-right">Support</p>
              <div className="flex items-center gap-3">
                <IoLogoInstagram className="text-[25px]" />
                <p className="text-[18px] font-medium">yika.inc</p>
              </div>
              <Image
                src="/assets/icons/Grey-Icon.svg"
                alt="Grey Icon"
                width={60}
                height={76}
                className="pt-4 opacity-20"
              />
            </div>

            {/* Footer Links */}
            <div className="absolute bottom-[58px] left-[69px] flex gap-10 text-[14px] font-medium tracking-[-0.02em]">
              <Link href="/privacy-policy"><p>Privacy Policy</p></Link>
              <Link href="/data-privacy"><p>Data Privacy</p></Link>
              <Link href="/terms"><p>Terms of Service</p></Link>
            </div>

            {/* Copyright */}
            <p className="absolute bottom-[58px] right-[69px] text-[18px] font-medium leading-[120%]">
              © 2025 Yika
            </p>
          </div>

          {/* Right image section - fixed width */}
          <div className="w-[320px] flex-shrink-0 h-[384px] bg-[#2C371D] relative">
            <Image
              src="/assets/images/Footer-Img.svg"
              alt="Right footer art"
              fill
              className="object-cover object-left"
              priority
            />
          </div>
        </div>

        {/* Mobile/Tablet layout (< lg) */}
        <div className="flex flex-col lg:hidden px-6 pt-10 pb-6 gap-6">
          {/* Logo */}
          <Image
            src="/assets/logos/Primary-Logo-White.svg"
            alt="logo"
            width={54}
            height={33}
          />

          {/* Headline */}
          <p className="text-[24px] font-['Satoshi'] font-medium">
            Start renting <span className="italic">today</span>
          </p>

          {/* CTA Button */}
          <button className="w-full bg-[#B361A6] text-[#FCF2F8] text-[17px] font-['Satoshi'] font-bold uppercase py-3">
            Request a brand
          </button>

          {/* Contact Section */}
          <div className="flex flex-col gap-2">
            <p className="text-[16px] font-medium">Contact Us</p>
            <div className="flex items-center gap-2">
              <IoLogoInstagram className="text-[20px]" />
              <span className="text-[16px] font-medium">yika.inc</span>
            </div>
          </div>

          {/* Divider */}
          <hr className="w-full border-t border-[#F8FAE8]/50" />

          {/* Links */}
          <div className="flex flex-col gap-2 text-[15px] font-medium">
            <Link href="/privacy-policy"><p>Privacy Policy</p></Link>
            <Link href="/data-privacy"><p>Data Privacy</p></Link>
            <Link href="/terms"><p>Terms of Service</p></Link>
          </div>

          {/* Copyright */}
          <p className="text-[16px] font-medium mt-4">
            © 2025 Yika
          </p>
        </div>

        {/* Footer Image (mobile) */}
        <div className="relative lg:hidden w-full aspect-[3/1]">
          <Image
            src="/assets/images/Footer-Img.svg"
            alt="Footer Image"
            fill
            className="object-cover object-bottom"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;