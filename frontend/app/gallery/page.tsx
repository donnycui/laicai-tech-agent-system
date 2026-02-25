'use client'

import { useState } from 'react';

// 定义图片数据类型
interface ImageData {
  id: number;
  src: string;
  alt: string;
  description: string;
}

// 示例图片数据
const imageData: ImageData[] = [
  {
    id: 1,
    src: 'https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/logo/getrich-logo.png',
    alt: '来财主Logo',
    description: '来财品牌的主Logo，代表我们的核心形象和理念。'
  },
  {
    id: 2,
    src: 'https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/logo/laicai-logo.png',
    alt: '来财辅助Logo',
    description: '来财品牌的辅助Logo，用于不同场景的应用。'
  }
];

export default function LogoGallery() {
  const [selectedImage, setSelectedImage] = useState<ImageData>(imageData[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">来财Logo图库</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 图片展示区 */}
          <div className="lg:w-1/2 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg p-4 max-w-2xl w-full">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto object-contain max-h-96 mx-auto"
              />
            </div>
          </div>

          {/* 描述信息区 */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedImage.alt}</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{selectedImage.description}</p>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">选择其他图片:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imageData.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`rounded-lg p-2 border-2 transition-all ${
                      selectedImage.id === image.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-20 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}