import React from 'react';

const CustomArrow = ({
  className,
  style,
  onClick,
  direction,
}: {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  direction: 'left' | 'right';
}) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        backgroundColor: 'transparent', // Remove background color
        color: '##9FC37B', // Match the green color from your design
        fontSize: '24px', // Adjust size if needed
        height: 'auto',
        width: 'auto',
        zIndex: 10,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        ...(direction === 'left' ? { left: '30px' } : { right: '30px' }),
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {direction === 'left' ? (
        <span style={{ fontSize: '50px' }}>‹</span>
      ) : (
        <span style={{ fontSize: '50px' }}>›</span>
      )}
    </div>
  );
};

export default CustomArrow;
