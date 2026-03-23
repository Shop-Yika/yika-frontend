import Image from "next/image";

export default function About() {

    return (
        <div className="min-h-screen ">
            <div className="  bg-gray-50 px-8 py-5 pt-[76px]">
                <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl leading-15 font-newsreader font-light mb-6">The fashion industry produces too much. We wear too little of it. <span className="italic"> Yíká exists to close that gap </span> — one rental at a time.</h1>

                <p className="text-gray-700 text-3xl text-justify leading-9 mb-4">
                    Founded on the belief that great style shouldn't result in a great environmental cost, Yíká is a rental marketplace built for the way modern people actually live. We connect individual wardrobes and brand inventories with shoppers who want access to beautiful clothing, without the permanence of ownership.
                    <br/>
                    <br/>
                    Whether you're a Digital Marketer hunting for the perfect outfit for Saturday's event, a fashion-forward individual with a wardrobe full of pieces that deserve more time in the world, or a brand sitting on unsold inventory — Yíká is your platform.
                    <br/>
                    <br/>
                    We facilitate both peer-to-peer (P2P) and business-to-consumer (B2C) rentals of luxury clothing and accessories, fostering a sharing community and a more circular economy in fashion.
                </p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-5xl text-center font-newsreader font-light leading-15 mt-10">Meet The Founders</h2>
                <div className="w-full flex items-center justify-center gap-12">
                    <Image
                        src="/assets/images/Seun.png"
                        alt="Seun Founder"
                        width={500}
                        height={143}

                    />
                    <Image
                        src="/assets/images/Rumi.png"
                        alt="Rumi Founder"
                        width={500}
                        height={143}

                    />
                </div>
            </div>
        </div>
    );
}