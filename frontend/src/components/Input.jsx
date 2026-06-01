import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        className={`
          flex items-center w-full rounded-lg border bg-white
          transition-all duration-200
          focus-within:ring-2 focus-within:ring-[#22B2B0]
          focus-within:border-[#22B2B0]
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {/* Input */}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="
            flex-1
            px-4
            py-3
            bg-transparent
            outline-none
            border-none
            text-gray-900
            placeholder:text-gray-400
            disabled:cursor-not-allowed
          "
          {...props}
        />

        {/* Tombol Mata */}
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="
              flex
              items-center
              justify-center
              w-12
              h-12
              border-l
              border-gray-200
              text-gray-500
              hover:text-[#22B2B0]
              transition-colors
              disabled:text-gray-400
              disabled:cursor-not-allowed
            "
            aria-label={
              showPassword
                ? 'Sembunyikan password'
                : 'Tampilkan password'
            }
          >
            {showPassword ? (
              <FiEye size={20} />
            ) : (
              <FiEyeOff size={20} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}