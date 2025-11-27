
import React, { useEffect, useState } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title: string;
  fields: { name: string; label: string; type: 'text' | 'textarea' | 'date' | 'select'; options?: string[]; value?: any }[];
  initialData?: any;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, title, fields, initialData }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Initialize empty form
      const empty: any = {};
      fields.forEach(f => empty[f.name] = f.value || '');
      setFormData(empty);
    }
  }, [initialData, fields, isOpen]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  rows={3}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : field.type === 'select' ? (
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-teal-700 shadow-md"
            >
              儲存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
