// src/components/ImagePicker.jsx
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { theme } from '../theme'

const ImagePicker = ({ onImageSelect, currentImage }) => {
  const [preview, setPreview] = useState(currentImage || null)

  const handleSelectImage = async () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('select-image');
      if (result.success) {
        setPreview(result.base64);
        onImageSelect(result.base64);
      }
    } else {
      document.getElementById('file-input').click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
        onImageSelect(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <div className="relative">
      {preview ? (
        <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden border border-[#e6e3db] shadow-sm">
          <img src={preview} alt="Selected" className="w-full h-full object-cover" />
          <button
            onClick={clearImage}
            className={`absolute top-3 right-3 ${theme.button.danger} ${theme.button.sm} shadow-lg`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleSelectImage}
          className="w-full h-48 bg-[#faf9f6] border-2 border-dashed border-[#e6e3db] rounded-[1.5rem] 
                     flex flex-col items-center justify-center hover:border-[#c5a880] hover:bg-white transition-all group"
        >
          <div className={`${theme.ui.iconBox} mb-3 group-hover:border-[#c5a880] transition-colors`}>
            <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#c5a880] transition-colors" />
          </div>
          <span className={`${theme.type.label} text-gray-400 group-hover:text-[#c5a880] transition-colors`}>
            Click to select image
          </span>
        </button>
      )}
      
      <input
        type="file"
        id="file-input"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImagePicker;