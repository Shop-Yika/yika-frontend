export default function OrderPlacedIcon({completed}: {completed: boolean}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 40"
            aria-hidden="true"
            fill="none"
            width="48"
            height="40"
        >
            <path
                d="M0 20C0 8.95431 8.9543 0 20 0H28C39.0457 0 48 8.95431 48 20C48 31.0457 39.0457 40 28 40H20C8.95431 40 0 31.0457 0 20Z"
                fill={completed ? '#AEBB37' : '#E4E4E7'}
            />
            <path
                d="M24 14V20L28 22"
                stroke={completed ? 'white' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M24 30C29.5228 30 34 25.5228 34 20C34 14.4772 29.5228 10 24 10C18.4772 10 14 14.4772 14 20C14 25.5228 18.4772 30 24 30Z"
                stroke={completed ? 'white' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
