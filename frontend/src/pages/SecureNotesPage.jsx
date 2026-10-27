import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { hashSecretCode, encryptNote, decryptNote } from '../utils/noteCrypto';
import { EXPIRATION_OPTIONS, DEFAULT_EXPIRATION_MINUTES, formatExpiresIn, formatCountdownBadge } from '../utils/noteExpiration';
import {
  Shield, Lock, Eye, EyeOff, ArrowLeft, Save, Trash2, Edit3,
  Clock, CheckCircle2, AlertTriangle, Sparkles, Home, Copy, Check, Info, Loader2, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const SecureNotesPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ── View States ─────────────────────────────────────────────────────────────
  // 'entry'       → Enter Secret Code screen
  // 'searching'   → Searching loading state
  // 'found'       → Note decrypted and viewing/editing
  // 'notFound'    → Empty state / code not found modal
  // 'create'      → Creation form
  const [view, setView] = useState('entry');

  // ── Form State ──────────────────────────────────────────────────────────────
  const [secretCode, setSecretCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Note Metadata (retrieved from backend)
  const [noteData, setNoteData] = useState(null);
  const [decryptedContent, setDecryptedContent] = useState('');
  
  // Creation/Editing Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formExpiry, setFormExpiry] = useState(DEFAULT_EXPIRATION_MINUTES);
  
  // Editing and Auto-Save Status
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'typing', 'saving', 'saved', ''
  
  // Modals & Banners
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [copiedReminderCode, setCopiedReminderCode] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Ref tracking to check original content for autosave
  const lastSavedContent = useRef({ title: '', content: '' });
  const autoSaveTimer = useRef(null);
  const secretInputRef = useRef(null);

  // Keep track of current time for countdown warning banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Autofocus input on entry view
  useEffect(() => {
    if (view === 'entry' && secretInputRef.current) {
      secretInputRef.current.focus();
    }
  }, [view]);

  // ── AUTO SAVE IMPLEMENTATION ───────────────────────────────────────────────
  useEffect(() => {
    // Only autosave when we are explicitly editing an existing note
    if (view === 'create' && isEditing) {
      const hasChanges =
        formTitle.trim() !== lastSavedContent.current.title ||
        formContent.trim() !== lastSavedContent.current.content;

      if (hasChanges) {
        setSaveStatus('typing');
        
        // Clear previous timer
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
        }

        // Set a new timer to auto save after 2 seconds
        autoSaveTimer.current = setTimeout(() => {
          performAutoSave();
        }, 2000);
      }
    }

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [formTitle, formContent, view, isEditing]);

  const performAutoSave = async () => {
    if (!formContent.trim()) {
      setSaveStatus('');
      return;
    }
    setSaveStatus('saving');
    try {
      const noteHash = await hashSecretCode(secretCode.trim());
      const encryptedContent = await encryptNote(formContent.trim(), secretCode.trim());

      const response = await axios.post(`${API_BASE}/api/notes`, {
        noteHash,
        encryptedContent,
        title: formTitle.trim() || null,
        expirationHours: formExpiry, // backend treats this as minutes now
      });

      // Update local storage models
      setNoteData(response.data);
      setDecryptedContent(formContent.trim());
      lastSavedContent.current = {
        title: formTitle.trim(),
        content: formContent.trim(),
      };
      setSaveStatus('saved');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setSaveStatus((current) => (current === 'saved' ? '' : current));
      }, 3000);
    } catch (err) {
      setSaveStatus('');
      toast.error('Auto-save failed. Check connection.');
    }
  };

  // ── SEARCH FLOW ────────────────────────────────────────────────────────────
  const handleContinue = async (e) => {
    e.preventDefault();
    if (!secretCode.trim()) {
      toast.error('Secret Code is required');
      return;
    }
    setView('searching');
    
    // Artificial slight delay for smooth searching transition experience
    setTimeout(async () => {
      try {
        const noteHash = await hashSecretCode(secretCode.trim());
        const response = await axios.post(`${API_BASE}/api/notes/open`, { noteHash });
        const data = response.data;

        const plaintext = await decryptNote(data.encryptedContent, secretCode.trim());
        setNoteData(data);
        setDecryptedContent(plaintext);
        setIsEditing(false);
        setView('found');
      } catch (error) {
        if (error.response?.status === 404) {
          setView('notFound');
        } else if (error.message === 'DECRYPTION_FAILED') {
          toast.error('Decryption failed — Secret Code is invalid for this note.');
          setView('entry');
        } else {
          toast.error(error.response?.data?.message || 'Server error. Please try again.');
          setView('entry');
        }
      }
    }, 800);
  };

  // ── MANUAL SAVE FLOW ───────────────────────────────────────────────────────
  const handleManualSave = async (e) => {
    if (e) e.preventDefault();
    if (!formContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }
    
    setSaveStatus('saving');
    try {
      const noteHash = await hashSecretCode(secretCode.trim());
      const encryptedContent = await encryptNote(formContent.trim(), secretCode.trim());

      const response = await axios.post(`${API_BASE}/api/notes`, {
        noteHash,
        encryptedContent,
        title: formTitle.trim() || null,
        expirationHours: formExpiry,
      });

      const savedData = response.data;
      setNoteData(savedData);
      setDecryptedContent(formContent.trim());
      
      lastSavedContent.current = {
        title: formTitle.trim(),
        content: formContent.trim(),
      };

      setSaveStatus('saved');
      setIsEditing(false);
      setView('found');

      // If it was a newly created note, trigger the reminder dialog
      if (!isEditing) {
        setShowReminderDialog(true);
      } else {
        toast.success('Note saved successfully!');
      }

      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('');
      toast.error(error.response?.data?.message || 'Failed to save note');
    }
  };

  // ── EDIT LAUNCH FLOW ───────────────────────────────────────────────────────
  const startEditing = () => {
    setFormTitle(noteData?.title || '');
    setFormContent(decryptedContent);
    // Keep current selection default or default minutes
    setFormExpiry(DEFAULT_EXPIRATION_MINUTES);
    
    // Set the initial reference content for auto-save detection
    lastSavedContent.current = {
      title: noteData?.title || '',
      content: decryptedContent,
    };
    
    setIsEditing(true);
    setView('create');
  };

  // ── DELETE FLOW ────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    setSaveStatus('saving');
    try {
      const noteHash = await hashSecretCode(secretCode.trim());
      await axios.delete(`${API_BASE}/api/notes/${noteHash}`);
      toast.success('Note deleted permanently');
      resetToEntry();
    } catch (error) {
      toast.error('Failed to delete note');
      setSaveStatus('');
    }
  };

  const resetToEntry = () => {
    setView('entry');
    setSecretCode('');
    setNoteData(null);
    setDecryptedContent('');
    setFormTitle('');
    setFormContent('');
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setShowReminderDialog(false);
    setSaveStatus('');
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretCode);
    setCopiedCode(true);
    toast.success('Secret Code copied!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyReminderSecret = () => {
    navigator.clipboard.writeText(secretCode);
    setCopiedReminderCode(true);
    toast.success('Secret Code copied to clipboard!');
    setTimeout(() => setCopiedReminderCode(false), 2000);
  };

  // ── Expiration warning calculation ─────────────────────────────────────────
  const expiryTime = noteData?.expiresAt ? new Date(noteData.expiresAt).getTime() : 0;
  const remainingMs = expiryTime - currentTime;
  const showWarning = remainingMs > 0 && remainingMs < 3600000; // < 1 hour
  const remainingMinutes = Math.max(1, Math.round(remainingMs / 60000));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col font-sans overflow-x-hidden">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-violet-500/5 to-transparent dark:from-violet-900/5 pointer-events-none blur-3xl" />
      
      {/* Top Navigation Header */}
      <header className="w-full px-3 sm:px-6 py-4 sm:py-5 flex items-center justify-between max-w-4xl mx-auto">
        <button
          onClick={(e) => {
            e.preventDefault();
            if (location.state?.from === 'dashboard') {
              navigate('/dashboard');
            } else if (location.state?.from === 'landing') {
              navigate('/');
            } else {
              if (isAuthenticated) {
                navigate('/dashboard');
              } else {
                navigate('/');
              }
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500 rounded"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {view !== 'entry' && view !== 'searching' && (
          <button
            onClick={resetToEntry}
            className="text-xs font-bold text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500 rounded py-1 px-2"
          >
            <Home className="w-4 h-4" />
            New Note
          </button>
        )}
      </header>

      {/* Main Panel Wrapper */}
      <main className="flex-1 flex items-start sm:items-center justify-center px-3 sm:px-4 py-6 sm:py-8 w-full min-w-0">
        <div className="w-full max-w-xl transition-all duration-300 min-w-0">

          {/* ── SEARCHING VIEW ────────────────────────────────────── */}
          {view === 'searching' && (
            <div className="text-center py-16 animate-fade-in flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white" aria-live="polite">
                Searching Secure Notes...
              </h2>
              <p className="text-xs text-slate-400">Verifying code and preparing cryptographic decryption key</p>
            </div>
          )}

          {/* ── ENTRY VIEW ────────────────────────────────────────── */}
          {view === 'entry' && (
            <div className="animate-slide-up">
              {/* Product branding */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 dark:from-violet-600 dark:to-indigo-800 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20 hover:scale-105 transition-transform">
                  <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
                  Secure Notes
                </h1>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 mt-1">
                  SwiftLink Notes
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Store encrypted notes securely. Only your Secret Code can decrypt your note.
                </p>
              </div>

              {/* Form Card */}
              <form
                onSubmit={handleContinue}
                className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 shadow-xl space-y-6"
              >
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    <Lock className="w-3.5 h-3.5 text-violet-500" />
                    Secret Code
                  </label>
                  <div className="relative">
                    <input
                      ref={secretInputRef}
                      type={showCode ? 'text' : 'password'}
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      placeholder="Enter secret code"
                      className="input-field pr-10 focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-500 focus-visible:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus-visible:outline-none"
                      tabIndex={-1}
                      aria-label={showCode ? "Hide secret code" : "Show secret code"}
                    >
                      {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Your code is client-processed and never uploaded. We store only the SHA-256 hash representation.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all font-semibold"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Continue
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1 flex-wrap border-t border-slate-200/40 dark:border-slate-800/40">
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-violet-500" /> AES-256</span>
                  <span>·</span>
                  <span>Zero-Knowledge</span>
                  <span>·</span>
                  <span>No Login</span>
                  <span>·</span>
                  <span>Anonymous</span>
                </div>
              </form>
            </div>
          )}

          {/* ── NOT FOUND (EMPTY STATE) VIEW ────────────────────────── */}
          {view === 'notFound' && (
            <div className="animate-scale-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-100/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  No Secure Note Found
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                  No encrypted note exists for this Secret Code. Would you like to create one?
                </p>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 space-y-3 shadow-xl">
                <button
                  onClick={() => {
                    setFormTitle('');
                    setFormContent('');
                    setFormExpiry(DEFAULT_EXPIRATION_MINUTES);
                    setIsEditing(false);
                    setView('create');
                  }}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 hover:shadow-[0_0_12px_rgba(124,58,237,0.3)] transition-all font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Create Secure Note
                </button>
                <button
                  onClick={resetToEntry}
                  className="btn-secondary w-full py-2.5 hover:bg-slate-100 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── FOUND VIEW ────────────────────────────────────────── */}
          {view === 'found' && (
            <div className="animate-scale-in space-y-4">
              
              {/* Expiration warning banner */}
              {showWarning && (
                <div className="p-3.5 rounded-2xl border border-amber-200/85 dark:border-amber-950/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-2 animate-pulse shadow-sm">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>⚠ This secure note expires in {remainingMinutes} {remainingMinutes === 1 ? 'minute' : 'minutes'}.</span>
                </div>
              )}

              <div className="glass-card rounded-3xl p-7 border border-emerald-250/30 dark:border-emerald-950/20 bg-emerald-50/10 dark:bg-emerald-950/5 shadow-xl relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {noteData?.title || 'Untitled Pad'}
                    </h2>
                    {noteData?.expiresAt && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatExpiresIn(noteData.expiresAt)}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 select-none">
                    {formatCountdownBadge(noteData?.expiresAt)}
                  </span>
                </div>

                {/* Content Box */}
                <div className="relative group">
                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 text-sm text-slate-700 dark:text-slate-350 whitespace-pre-wrap leading-relaxed min-h-[160px] max-h-[400px] overflow-y-auto shadow-inner select-text break-words overflow-x-hidden">
                    {decryptedContent}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(decryptedContent).then(() => {
                        setCopiedContent(true);
                        setTimeout(() => setCopiedContent(false), 2000);
                      });
                    }}
                    title="Copy note content"
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 shadow-sm backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Actions Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={startEditing}
                      className="btn-primary text-xs py-2.5 px-4 flex items-center justify-center gap-2 font-semibold hover:shadow-[0_0_12px_rgba(124,58,237,0.25)] min-h-[44px] flex-1 sm:flex-none"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Note
                    </button>
                    <button
                      onClick={handleCopySecret}
                      className="btn-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] flex-1 sm:flex-none"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      Code
                    </button>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-xs py-2.5 px-3.5 flex items-center justify-center gap-1.5 rounded-xl border border-red-200/60 dark:border-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/5 transition-colors min-h-[44px] w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Confirm Delete Banner */}
              {showDeleteConfirm && (
                <div className="glass-card rounded-2xl p-6 border border-red-250/20 dark:border-red-950/20 bg-red-50/10 dark:bg-red-950/5 animate-slide-up shadow-lg">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm mb-1.5">
                    <AlertTriangle className="w-4.5 h-4.5" />
                    Delete Secure Note?
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    This action cannot be undone. Decryption keys and ciphertext will be permanently wiped.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn-secondary text-xs py-2.5 flex-1 min-h-[44px]"
                      disabled={saveStatus === 'saving'}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="text-xs py-2.5 px-4 flex-1 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 hover:shadow-[0_0_10px_rgba(220,38,38,0.3)] min-h-[44px]"
                      disabled={saveStatus === 'saving'}
                    >
                      Delete Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CREATE / EDIT VIEW ────────────────────────────────── */}
          {view === 'create' && (
            <div className="animate-scale-in">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Shield className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {isEditing ? 'Edit Secure Note' : 'Create Secure Note'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">Client-side encryption applies immediately to keystrokes</p>
              </div>

              <form onSubmit={handleManualSave} className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 shadow-xl space-y-4">
                
                {/* Secret Code (Locked) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <Lock className="w-3.5 h-3.5 text-violet-500" />
                      Secret Code
                    </label>
                    <span className="text-[9px] uppercase tracking-wider text-violet-500 font-bold select-none">
                      PAD KEY
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showCode ? 'text' : 'password'}
                      value={secretCode}
                      disabled
                      className="input-field pr-10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed select-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Title
                    <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Server Credentials or Drafts"
                    className="input-field"
                    maxLength={100}
                    disabled={saveStatus === 'saving'}
                  />
                </div>

                {/* Content Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Note Content
                    </label>
                    {/* Auto-Save status Indicator */}
                    {isEditing && (
                      <span className="text-[10px] font-semibold text-violet-500 flex items-center gap-1 min-w-[70px] justify-end" aria-live="polite">
                        {saveStatus === 'typing' && 'Typing...'}
                        {saveStatus === 'saving' && <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</span>}
                        {saveStatus === 'saved' && <span className="text-emerald-500 font-bold">Saved ✓</span>}
                      </span>
                    )}
                  </div>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Type sensitive text here..."
                    rows={6}
                    className="input-field resize-y min-h-[140px] sm:min-h-[180px] select-text focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-500"
                    required
                    disabled={saveStatus === 'saving'}
                  />
                </div>

                {/* Expiration Select */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-violet-500" />
                    Expiration Period
                  </label>
                  <select
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(Number(e.target.value))}
                    className="input-field"
                    disabled={saveStatus === 'saving'}
                  >
                    {EXPIRATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Pad content is permanently deleted from database after expiration.
                  </p>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setView('found');
                      } else {
                        setView('notFound');
                      }
                    }}
                    className="btn-secondary text-xs py-2.5 flex-1"
                    disabled={saveStatus === 'saving'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs py-2.5 flex-1 flex items-center justify-center gap-2 font-bold hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                    disabled={saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isEditing ? 'Save Changes' : 'Save Secure Note'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── REMINDER DIALOG (ON CREATION SUCCESS) ───────────────── */}
          {showReminderDialog && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
              <div className="modal-panel w-full max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 animate-scale-in" role="dialog" aria-modal="true" aria-labelledby="reminder-dialog-title">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-3 text-emerald-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 id="reminder-dialog-title" className="text-lg font-bold font-display text-slate-900 dark:text-white">
                    Secure Note Saved
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Saved to Secure Notes</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-950/30 text-xs text-amber-700 dark:text-amber-450 space-y-2 mb-6">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0" />
                    Crucial Security Alert
                  </div>
                  <p className="leading-relaxed">
                    Remember your Secret Code. It is never stored. It cannot be recovered.
                    Without it, your encrypted note is permanently inaccessible.
                  </p>
                </div>

                {/* Displaying secret code */}
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-3 text-sm font-mono text-slate-800 dark:text-slate-200 mb-6">
                  <span className="truncate">{secretCode}</span>
                  <button
                    onClick={handleCopyReminderSecret}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    title="Copy Secret Code"
                  >
                    {copiedReminderCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCopyReminderSecret}
                    className="btn-secondary text-xs py-2.5 flex-1 font-bold"
                  >
                    Copy Secret Code
                  </button>
                  <button
                    onClick={() => {
                      setShowReminderDialog(false);
                      setView('found');
                    }}
                    className="btn-primary text-xs py-2.5 flex-1 font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default SecureNotesPage;
