export default function Button({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  disabled = false,
  onClick,
  className = '',
  ...props 
}) {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-colors duration-200';
  
  const variants = {
    primary: 'bg-primary-light text-white hover:bg-primary-dark disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-400',
    ghost: 'bg-transparent text-primary-light hover:bg-primary-light hover:text-white disabled:text-gray-400'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
