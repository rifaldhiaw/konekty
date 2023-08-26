// million-ignore
const More = (props: { size?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ? props.size : "1.5em"}
      height={props.size ? props.size : "1.5em"}
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="5" r="2" fill="currentColor" />
      <circle cx="12" cy="19" r="2" fill="currentColor" />
    </svg>
  );
};

export default More;
