export default function ProcessingIcon({completed}: {completed: boolean}) {
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
                fill={completed ? '#B361A6' : '#E4E4E7'}
            />
            <path
                d="M23 29.7299C23.304 29.9054 23.6489 29.9979 24 29.9979C24.3511 29.9979 24.696 29.9054 25 29.7299L32 25.7299C32.3037 25.5545 32.556 25.3024 32.7315 24.9987C32.9071 24.6951 32.9996 24.3506 33 23.9999V15.9999C32.9996 15.6492 32.9071 15.3047 32.7315 15.0011C32.556 14.6974 32.3037 14.4453 32 14.2699L25 10.2699C24.696 10.0944 24.3511 10.002 24 10.002C23.6489 10.002 23.304 10.0944 23 10.2699L16 14.2699C15.6963 14.4453 15.444 14.6974 15.2685 15.0011C15.0929 15.3047 15.0004 15.6492 15 15.9999V23.9999C15.0004 24.3506 15.0929 24.6951 15.2685 24.9987C15.444 25.3024 15.6963 25.5545 16 25.7299L23 29.7299Z"
                stroke={completed ? '#FCF2F8' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M24 30V20"
                stroke={completed ? '#FCF2F8' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.2891 15L23.9991 20L32.7091 15"
                stroke={completed ? '#FCF2F8' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.5 12.2695L28.5 17.4195"
                stroke={completed ? '#FCF2F8' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
