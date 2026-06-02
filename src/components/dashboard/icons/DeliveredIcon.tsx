export default function DeliveredIcon({completed}: {completed: boolean}) {
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
                fill={completed ? '#672862' : '#E4E4E7'}
            />
            <path
                d="M33.8026 17.9995C34.2593 20.2408 33.9338 22.5709 32.8804 24.6013C31.827 26.6317 30.1095 28.2396 28.0141 29.1568C25.9187 30.0741 23.5722 30.2453 21.3659 29.6419C19.1595 29.0385 17.2268 27.6969 15.8898 25.8409C14.5529 23.9849 13.8927 21.7267 14.0192 19.4429C14.1458 17.159 15.0514 14.9876 16.5852 13.2907C18.119 11.5938 20.1881 10.4739 22.4476 10.118C24.7071 9.76198 27.0203 10.1914 29.0016 11.3345"
                stroke={completed ? 'white' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M21 19L24 22L34 12"
                stroke={completed ? 'white' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
