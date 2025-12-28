"use client";

import React, { useState } from 'react';
import { Loader2, UploadCloud, XCircle } from 'lucide-react';

const DiseasePredictor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/predict-disease', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data = await response.json();
      if (data.prediction) {
        setPrediction(data.prediction);
      } else {
        setError(data.message || 'Unexpected response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-2xl rounded-xl my-8 border border-gray-200">
      <h1 className="text-4xl font-extrabold text-center text-green-900 mb-6">Plant Disease Prediction</h1>
      <p className="text-center text-black font-medium text-lg mb-8">Upload an image of a plant leaf to predict potential diseases.</p>

      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-md border-4 border-dashed border-green-200 rounded-xl p-8 text-center relative bg-green-50/30 hover:bg-green-50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {previewUrl ? (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="max-w-full h-64 object-contain rounded-lg mx-auto shadow-md" />
              <button
                onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-transform hover:scale-110 shadow-lg z-20"
                aria-label="Clear image"
              >
                <XCircle size={24} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48">
              <UploadCloud className="text-green-700 mb-4" size={64} />
              <p className="text-black font-bold text-xl">Drag & drop an image</p>
              <p className="text-green-800 font-semibold">or click to upload</p>
              <p className="text-sm text-gray-700 mt-2">(JPG, JPEG, PNG)</p>
            </div>
          )}
        </div>

        <button
          onClick={handlePredict}
          disabled={!selectedFile || loading}
          className={`flex items-center justify-center px-10 py-4 rounded-full text-white font-bold text-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
            !selectedFile || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading && <Loader2 className="animate-spin mr-3" size={24} />}
          {loading ? 'Analyzing...' : 'Predict Disease'}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start max-w-md mx-auto">
          <XCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="text-red-800 font-bold">Error:</p>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {prediction && (
        <div className="mt-6 p-8 bg-green-50 border-2 border-green-500 rounded-2xl text-center shadow-inner max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-green-900 mb-2">Prediction Result:</h2>
          <p className="text-4xl font-black text-green-700 animate-bounce">{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default DiseasePredictor;
