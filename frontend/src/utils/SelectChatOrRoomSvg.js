const SelectChatOrRoomSvg = () => {
  return (
    <svg
      viewBox="0 0 400 200"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin meet"
    >
      {/* <!-- Background rectangle to fill the parent container --> */}
      <rect width="100%" height="100%" fill="#f5f5f5" />

      {/* <!-- Panda face --> */}
      <g transform="translate(150, 20) scale(0.4)">
        {/* <!-- Panda head --> */}
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="5"
        />

        {/* <!-- Panda ears --> */}
        <circle
          cx="70"
          cy="70"
          r="30"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="5"
        />
        <circle
          cx="230"
          cy="70"
          r="30"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="5"
        />

        {/* <!-- Panda eyes --> */}
        <circle cx="100" cy="120" r="25" fill="#000000" />
        <circle cx="200" cy="120" r="25" fill="#000000" />

        {/* <!-- Panda pupils --> */}
        <circle cx="100" cy="120" r="10" fill="#ffffff" />
        <circle cx="200" cy="120" r="10" fill="#ffffff" />

        {/* <!-- Panda nose --> */}
        <ellipse cx="150" cy="180" rx="20" ry="15" fill="#000000" />

        {/* <!-- Panda mouth --> */}
        <path
          d="M120,220 Q150,260 180,220"
          fill="none"
          stroke="#000000"
          strokeWidth="10"
        />

        {/* <!-- Panda cheeks --> */}
        <circle cx="80" cy="180" r="25" fill="#ff9999" />
        <circle cx="220" cy="180" r="25" fill="#ff9999" />
      </g>

      {/* <!-- Text: Please select a chat from the chat list --> */}
      <text
        x="50%"
        y="75%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fill="#333333"
      >
        Please select a chat or a room
      </text>
    </svg>
  );
};

export default SelectChatOrRoomSvg;
