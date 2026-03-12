import { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { UploadCloud, FileText, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onSuccess?: () => void;
}

export default function DataImport({ onSuccess }: Props) {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        // Handle CSV Database Import
        const res = await axios.post('http://127.0.0.1:8000/upload-csv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth?.token}`
          }
        });
        setSuccessMsg(`Successfully imported ${res.data.imported} transactions from CSV.`);
        onSuccess?.();
      } else if (file.type.startsWith('image/')) {
        // Send receipt to Gemini Vision API backend
        const res = await axios.post('http://127.0.0.1:8000/scan-receipt', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth?.token}`
          }
        });
        setSuccessMsg(res.data.message || 'Receipt scanned successfully and transaction added.');
        onSuccess?.();
      } else {
        setErrorMsg("Unsupported file type. Please upload a CSV or an Image receipt.");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      if (!file.type.startsWith('image/')) setLoading(false);
    }
  }, [auth]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 glass-card relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[--color-accent-green] opacity-[0.15] blur-3xl rounded-full"></div>

        <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[--color-accent-green]" />
            Smart Import
        </h3>
        <p className="text-[--color-text-secondary] text-sm mb-6">
            Drag & Drop a bank CSV to import history, or drop a receipt photo for Gemini AI scanning.
        </p>

        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive ? 'border-[--color-accent-green] bg-[--color-accent-green-glow]' : 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]'}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center pointer-events-none">
            {isDragActive ? (
              <UploadCloud className="w-12 h-12 text-[--color-accent-green] animate-bounce mb-4" />
            ) : (
              <FileText className="w-12 h-12 text-[--color-text-muted] mb-4" />
            )}
            
            <p className="text-lg font-medium">
              {isDragActive ? "Drop to upload instantly" : "Click or drag files here"}
            </p>
            <p className="text-sm text-[--color-text-secondary] mt-2">
              Supports CSV, JPG, PNG up to 10MB
            </p>
          </div>
        </div>

        <AnimatePresence>
            {loading && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"
                >
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[--color-accent-green] mr-3"></div>
                    <span className="text-sm text-[--color-text-secondary]">Processing with FinMate Engine...</span>
                </motion.div>
            )}

            {successMsg && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 rounded-lg bg-[--color-accent-green-glow] border border-[--color-accent-green]/30 flex items-start gap-3"
                >
                    <CheckCircle className="w-5 h-5 text-[--color-accent-green] mt-0.5" />
                    <p className="text-sm text-[--color-accent-green]">{successMsg}</p>
                </motion.div>
            )}
            
            {errorMsg && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 rounded-lg bg-[--color-accent-red-glow] border border-[--color-accent-red]/30 flex items-start gap-3"
                >
                    <p className="text-sm text-[--color-accent-red]">{errorMsg}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
