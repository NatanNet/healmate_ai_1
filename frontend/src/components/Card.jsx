export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6 border border-gray-100
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
