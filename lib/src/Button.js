import React from 'react'

const Button = ({
  children,
  disabled = false,
  style = {},
  ...nativeAttributes
}) => {
  const buttonStyles = {
    padding: '0.5rem',
    margin: '0.5rem',
    borderRadius: 4,
    ...(disabled && {
      pointerEvents: 'none',
      opacity: 0.5,
    }),
    border: 'none',
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    ...style,
  }

  return (
    <button style={buttonStyles} {...nativeAttributes}>
      {children}
    </button>
  )
}

export default Button
