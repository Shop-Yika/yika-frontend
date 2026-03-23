import Image from "next/image";


export default function ShopHeroBanner() {
  return (
    <section className="relative w-full bg-[#2C371D] z-10 mb-4 flex flex-col items-center justify-center px-4 lg:px-0 h-[550px] md:h-[343.72px] py-10 lg:py-0">
      {/* Background Image */}

      <div className="absolute top-0 left-0 w-full h-[550px] md:h-[343.72px] z-0">
        <Image
          src="/assets/logos/Logo-Mark.svg"
          alt="Background"
          width={1920}
          height={343}
          className="w-full h-full object-cover"
        />
      </div>



      {/* Text Block */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-[90%] lg:max-w-[707.62px]">
        <h1 className="font-['Averia_Serif_Libre'] font-bold text-white tracking-[-0.02em] leading-tight text-[40px] sm:text-[48px] md:text-[64px] lg:text-[89.6667px]">
          The Summer Edit
        </h1>
        <p className="font-['Averia_Serif_Libre'] font-light text-white tracking-[-0.02em] mt-2 text-[22px] sm:text-[28px] md:text-[28px] lg:text-[34.9746px] max-w-[90%] md:max-w-[500px] lg:max-w-[614px] leading-snug">
          Dive in warmer months with a new style
        </p>
      </div>
    </section>
  );
}
