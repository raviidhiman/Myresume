import React, { createContext, useContext, useState, useCallback } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchResume = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/resume');
      setResume(res.data);
    } catch (err) {
      toast.error('Failed to load resume data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveResume = async (updatedResume) => {
    setSaving(true);
    try {
      const res = await API.put('/resume', updatedResume);
      setResume(res.data.resume);
      toast.success('Resume saved successfully!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save resume.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <ResumeContext.Provider value={{ resume, setResume, loading, saving, fetchResume, saveResume }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
