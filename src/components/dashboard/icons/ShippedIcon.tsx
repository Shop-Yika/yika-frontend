export default function ShippedIcon({completed}: {completed: boolean}) {
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
                fill={completed ? '#8C2D8B' : '#E4E4E7'}
            />
            <path
                d="M26 26V14C26 13.4696 25.7893 12.9609 25.4142 12.5858C25.0391 12.2107 24.5304 12 24 12H16C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V25C14 25.2652 14.1054 25.5196 14.2929 25.7071C14.4804 25.8946 14.7348 26 15 26H17"
                stroke={completed ? '#F5DBEA' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M27 26H21"
                stroke={completed ? '#F5DBEA' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M31 26H33C33.2652 26 33.5196 25.8946 33.7071 25.7071C33.8946 25.5196 34 25.2652 34 25V21.35C33.9996 21.1231 33.922 20.903 33.78 20.726L30.3 16.376C30.2065 16.2589 30.0878 16.1643 29.9528 16.0992C29.8178 16.0341 29.6699 16.0002 29.52 16H26"
                stroke={completed ? '#F5DBEA' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M29 28C30.1046 28 31 27.1046 31 26C31 24.8954 30.1046 24 29 24C27.8954 24 27 24.8954 27 26C27 27.1046 27.8954 28 29 28Z"
                stroke={completed ? '#F5DBEA' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19 28C20.1046 28 21 27.1046 21 26C21 24.8954 20.1046 24 19 24C17.8954 24 17 24.8954 17 26C17 27.1046 17.8954 28 19 28Z"
                stroke={completed ? '#F5DBEA' : '#99A1AF'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
