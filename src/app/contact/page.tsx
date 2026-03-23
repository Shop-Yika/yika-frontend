"use client";

import { useState } from "react";


export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }
        if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
        if (!formData.message.trim()) newErrors.message = "Message is required.";
        return newErrors;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20">
            {/* Background grain texture */}
            <div className="flex flex-col md:flex-row">
                {/* Left panel */}
                <div className="lg:col-span-2  p-10 flex flex-col justify-between">
                    <div>
                        <p className="text-lg text-[#8c2d8b] uppercase tracking-[0.25em] mb-4">
                            Get in touch
                        </p>
                        <h1
                            className="text-7xl mb-6 font-newsreader"
                        >
                            We'd love to
                            <br />
                            hear from
                            <br />
                            <span className="">you.</span>
                        </h1>
                        <p className=" text-md leading-relaxed">
                            Whether you have a question,or just want to
                            say hello — our team is here and happy to help.
                        </p>
                    </div>


                </div>

                {/* Right panel — Form */}
                <div className="lg:col-span-3 border-t md:border-l md:border-t-0 border-[#2a2a2a] p-10">
                    {submitted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20">
                            <div className="w-16 h-16 rounded-full border border-[#8C2D8B] bg-[#f5c842]/10 flex items-center justify-center mb-6">
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 12l5 5L19 7"
                                        stroke="#8C2D8B"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h2
                                className="text-2xlfont-bold mb-3"
                            >
                                Message sent!
                            </h2>
                            <p className=" text-sm max-w-xs">
                                Thanks for reaching out, {formData.name}. We'll get back to you
                                at{" "}
                                <span className="text-[#8C2D8B]">{formData.email}</span> as
                                soon as possible.
                            </p>
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setFormData({ name: "", email: "", subject: "", message: "" });
                                }}
                                className="mt-8 text-xs text-[#555] underline underline-offset-4 hover:text-[#8C2D8B] transition-colors"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2
                                    className=" text-xl font-semibold mb-1"
                                >
                                    Send us a message
                                </h2>
                                <p className="text-[#555] text-xs">
                                    All fields are required.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                                {/* Name + Email row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Field
                                        label="Name"
                                        name="name"
                                        type="text"
                                        placeholder="First and last"
                                        value={formData.name}
                                        error={errors.name}
                                        onChange={handleChange}

                                    />
                                    <Field
                                        label="Email"
                                        name="email"
                                        type="email"
                                        placeholder="jane@example.com"
                                        value={formData.email}
                                        error={errors.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <Field
                                    label="Subject"
                                    name="subject"
                                    type="text"
                                    placeholder="What's this about?"
                                    value={formData.subject}
                                    error={errors.subject}
                                    onChange={handleChange}
                                />

                                {/* Message */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-[11px] uppercase tracking-widest  mb-2"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        placeholder="Tell us everything..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full  border ${
                                            errors.message ? "border-red-500/60" : "border-[#2a2a2a]"
                                        }  px-4 py-3 text-sm placeholder-[#3a3a3a] focus:outline-none focus:border-[#f5c842]/60 focus:ring-1 focus:ring-[#f5c842]/20 transition-colors resize-none`}
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-xs text-red-400">{errors.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-2 bg-[#8C2D8B] hover:bg-[#8C2D8B]/10 text-white hover:text-[#0e0e0e] hover:border hover:border-[#8c2d8b] text-sm font-semibold py-3.5 transition-all duration-200 hover:shadow-[#8c2d8b] active:scale-[0.98]"
                                >
                                    Send Message →
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

// ── Reusable field component ──────────────────────────────────────────────────
interface FieldProps {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Field({
                   label,
                   name,
                   type,
                   placeholder,
                   value,
                   error,
                   onChange,
               }: FieldProps) {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-[11px] uppercase tracking-widest text-[#555] mb-2"
            >
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full  border ${
                    error ? "border-red-500/60" : "border-[#2a2a2a]"
                } px-4 py-3 text-sm  placeholder-[#3a3a3a] focus:outline-none focus:border-[#f5c842]/60 focus:ring-1 focus:ring-[#f5c842]/20 transition-colors`}
            />
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}