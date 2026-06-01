import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropzone from '../components/Dropzone';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [linkedinPdf, setLinkedinPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a PDF CV first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste a Job Description for the AI to analyze against.");
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);
    if (linkedinPdf) {
      formData.append('linkedin_pdf', linkedinPdf);
    }
    
    try {
      const response = await axios.post(
  `${API_URL}/api/cv/upload`,
  formData,
  {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
);
      
      if (response.data.status === 'success') {
        navigate('/results', { state: { analysisData: response.data.data } });
      } else {
        setError(response.data.error || "Analysis failed.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error connecting to the server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow pt-32 pb-24 px-6 bg-surface-container-low min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl text-on-surface mb-3 tracking-tight">New Analysis</h1>
          <p className="font-body text-lg text-on-surface-variant">Upload a candidate's CV and define the target benchmark.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 md:p-12 shadow-sm">
          <form onSubmit={handleAnalyze} className="flex flex-col gap-8">
            
            <div className="flex flex-col gap-3">
              <label className="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                1. Upload CV (PDF)
              </label>
              <Dropzone onFileSelected={setFile} selectedFile={file} />
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                2. Job Description
              </label>
              <textarea 
                className="w-full min-h-[150px] p-4 bg-surface-container rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary-container transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50 font-body resize-y"
                value={jobDescription} 
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the raw job description here. The AI will dynamically extract the exact requirements and evaluate the CV against them."
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                3. Upload LinkedIn Profile (PDF) <span className="text-outline-variant font-normal normal-case tracking-normal ml-2">(Optional)</span>
              </label>
              <div className="text-sm text-on-surface-variant mb-2">
                Go to your LinkedIn Profile → Click "More" → "Save to PDF".
              </div>
              <Dropzone onFileSelected={setLinkedinPdf} selectedFile={linkedinPdf} />
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 w-full py-4 bg-primary text-on-primary rounded-full font-label font-semibold text-lg hover:bg-surface-tint hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" size={24} /> Processing Intelligence...</>
              ) : "Run AI Analysis"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
