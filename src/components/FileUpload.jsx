import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFileAlt, FaImage } from 'react-icons/fa';

const FileUpload = ({ onFileSelect }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg'],
            'text/plain': ['.txt'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    });

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            {...getRootProps()}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group bg-gray-50/50
        ${isDragActive ? 'border-veriscan-teal bg-teal-50/50' : 'border-gray-300 hover:border-veriscan-purple hover:bg-white'}`}
        >
            <input {...getInputProps()} />

            <div className={`p-5 rounded-full mb-6 transition-colors shadow-sm ${isDragActive ? 'bg-teal-100' : 'bg-white group-hover:bg-purple-50'}`}>
                <FaCloudUploadAlt className={`text-4xl ${isDragActive ? 'text-veriscan-teal' : 'text-gray-400 group-hover:text-veriscan-purple'}`} />
            </div>

            {isDragActive ? (
                <p className="text-veriscan-teal font-semibold text-lg">Drop to analyze!</p>
            ) : (
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-800">Drag & Drop to Scan</p>
                    <p className="text-sm text-gray-500 mt-2">Supports Text (.txt, .pdf) & Images (.jpg, .png)</p>
                </div>
            )}

            {/* Badges */}
            <div className="flex gap-3 mt-8">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500 shadow-sm">
                    <FaFileAlt className="text-veriscan-teal" /> AI Text
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500 shadow-sm">
                    <FaImage className="text-veriscan-purple" /> Deepfakes
                </span>
            </div>
        </motion.div>
    );
};

export default FileUpload;