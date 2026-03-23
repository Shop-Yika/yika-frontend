import Image from "next/image";

type Step = { label: string; description: string; align: "left" | "center" };
type Section = { title: string; image: string; steps: Step[] };

const sections: Section[] = [
    {
        title: "For Shoppers",
        image: "/assets/hiw/2.png",
        steps: [
            { label: "Discover", align: "left", description: "Browse designer pieces from brands and closets across Canada. Filter by size, occasion, price, and location to find the perfect look." },
            { label: "Rent", align: "center", description: "Choose your rental dates and book instantly. Your item arrives ready to wear before your event." },
            { label: "Style & Wear", align: "left", description: "Show up in something amazing — without the commitment of buying." },
            { label: "Return", align: "center", description: "Send it back using the prepaid return label. No laundry required." },
        ],
    },
    {
        title: "For Listers",
        image: "/assets/hiw/3.png",
        steps: [
            { label: "List Your Items", align: "left", description: "Upload photos, add relevant details, and choose when your items are available." },
            { label: "Get Booked", align: "center", description: "Shoppers discover your pieces and reserve them for their events." },
            { label: "Prepare & Send", align: "left", description: "Once your piece is rented, Yíká will send instructions on how to prepare and send it to the renter." },
            { label: "Earn", align: "center", description: "Get paid every time your item is rented while your closet works for you." },
        ],
    },
    {
        title: "For Retailers",
        image: "/assets/hiw/4.png",
        steps: [
            { label: "List Inventory", align: "left", description: "Upload current collections or slow-moving inventory and set rental pricing." },
            { label: "Reach New Customers", align: "center", description: "Rentals introduce your designs to a younger audience who may later become buyers." },
            { label: "Generate Revenue", align: "left", description: "Earn recurring income from each rental while increasing long-term brand discovery." },
            { label: "Gain Customer Insight", align: "center", description: "See what people rent, love, and return to — valuable data for merchandising and design." },
        ],
    },
];

function Step({ label, description, align }: Step) {
    const isCenter = align === "center";
    return (
        <div className={`flex flex-col gap-1 ${isCenter ? "items-center self-center" : "items-start"}`}>
            <div className={`flex items-center gap-2 ${isCenter ? "" : "ml-25"}`}>
                <Image src="/assets/hiw/Icons-03.png" alt="hanger icon" width={50} height={50} />
                <span className="text-xl text-gray-900">{label}</span>
            </div>
            <p className={`text-gray-700 text-m leading-relaxed ${isCenter ? "text-center max-w-[280px]" : "max-w-100 text-center"}`}>
                {description}
            </p>
        </div>
    );
}

function Section({ title, image, steps, reverse }: Section & { reverse: boolean }) {
    return (
        <div className={`p-8 flex ${reverse ? "flex-row-reverse" : ""} items-center justify-between`}>
            <div className={`flex-1 flex flex-col gap-10 ${reverse ? "ml-10" : ""}`}>
                <h2 className="text-4xl text-center italic font-newsreader">{title}</h2>
                {steps.map((step) => <Step key={step.label} {...step} />)}
            </div>
            <div className="w-[45%] shrink-0 self-center">
                <Image src={image} alt={title} width={400} height={400} className="object-fill w-full h-full" />
            </div>
        </div>
    );
}

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto pb-[76px]">
                <div className="w-full h-full pt-[76px] px-8">
                    <h1 className="text-6xl mb-5 font-newsreader font-light">How Yíká works</h1>
                    <p className="text-2xl mb-8">
                        Renting luxury fashion should feel as effortless as wearing it.
                        <br />
                        We&apos;ve built Yíká around three simple ideas: discover, rent, return.
                        <br />
                        With every detail handled in between.
                    </p>
                </div>

                {sections.map((section, i) => (
                    <Section key={section.title} {...section} reverse={i % 2 !== 0} />
                ))}
            </div>
        </div>
    );
}