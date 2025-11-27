
import React, { useState, useEffect } from 'react';

interface EditableTextProps {
  initialValue: string;
  isEditing: boolean;
  onSave?: (newValue: string) => void;
  className?: string;
  tagName?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  multiline?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  initialValue, 
  isEditing, 
  onSave,
  className = '', 
  tagName = 'div',
  multiline = false
}) => {
  const [text, setText] = useState(initialValue);
  const Tag = tagName as any;

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.currentTarget.innerText;
    if (newValue !== initialValue && onSave) {
      onSave(newValue);
    }
  };

  return (
    <Tag
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      className={`${className} transition-all duration-200 ${
        isEditing 
          ? 'outline-dashed outline-2 outline-orange-400 bg-orange-50/50 p-1 rounded min-w-[50px] cursor-text' 
          : ''
      }`}
    >
      {text}
    </Tag>
  );
};

export default EditableText;
