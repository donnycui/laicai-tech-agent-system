'use client'

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回首页
            </Link>
            <div className="flex items-center gap-3">
              <Image
                src="https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/misc/laicai.png"
                alt="来财"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">来财</h1>
                <p className="text-slate-600">来财品牌图库</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
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
      </main>
    </>
  );
}