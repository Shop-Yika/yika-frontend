import Image from "next/image";

export default function ShoppingExperience() {
    return (
        <section className="relative w-full bg-[#FFFDF7] overflow-hidden px-6 py-20 lg:min-h-[800px] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 max-w-full mx-auto">
            {/* Left Text Block */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-auto max-w-[600px] gap-5 lg:pl-12 xl:pl-24 2xl:pl-48">
                <h1 className="text-[38px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-tight font-normal tracking-[-0.02em] font-['Averia_Serif_Libre'] text-black">
                    Earn from Your Wardrobe
                </h1>
                <p className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] leading-snug font-light tracking-[-0.02em] font-['Averia_Serif_Libre'] text-black max-w-[489.4px]">
                    Turn your personal style into income by lending out pieces you no longer wear
                </p>
            </div>

            {/* Right Highlight Box */}
            <div className="w-full max-w-[572px] lg:max-w-none lg:w-[572px] xl:w-[672px] bg-[rgba(174,187,55,0.04)] rounded-lg flex justify-center items-center py-10 px-4 lg:mr-12 xl:mr-24 2xl:mr-48">
                {/* Icon + Card Wrapper */}
                <div className="relative w-full max-w-[346px] flex justify-center items-center">
                    {/* White Card */}
                    <div className="w-full bg-white rounded-[10px] p-5 z-0">
                        <div className="mx-auto relative w-full">
                            {/* Product Image */}
                            <div className="relative w-full aspect-[3/4] bg-[#CBD9FF]">
                                <Image
                                    src="/assets/images/Dress-Image.svg"
                                    alt="Product"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Product Name & Price */}
                            <p className="mt-4 mb-2 font-['Satoshi'] text-[16px] md:text-[16.65px] font-medium text-black">
                                Sunset Ombre Maxi Dress
                            </p>
                            <p className="font-['Inter'] text-[16px] md:text-[16.65px] text-black">
                                From CAD$ 40
                            </p>
                        </div>
                    </div>

                    {/* Shopping Cart Icon */}
                    <div className="absolute -top-10 -left-12 hidden sm:block">
                        <div className="relative w-[50px] h-[50px]">
                            <Image
                                src="/assets/icons/Shopping-Cart-Icon.svg"
                                alt="Shopping Cart"
                                width={55}
                                height={55}
                            />
                            <div className="absolute -top-5 -right-8 w-[54.33px] h-[41.27px] bg-black rounded-full flex justify-center items-center px-[13px]">
                <span className="text-[#FFFDF7] font-['Satoshi'] font-bold text-[18px] leading-[30px] uppercase tracking-[0.12em]">
                  +1
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Heart Icon */}
                    <div className="absolute -bottom-8 -right-12 hidden sm:block">
                        <Image
                            src="/assets/icons/Heart-Icon-Fill.svg"
                            alt="Heart Icon"
                            width={50}
                            height={50}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}