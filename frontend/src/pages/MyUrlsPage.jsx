import React, { useState, useEffect } from 'react';
import api from '../services/api';
import UrlTable from '../components/UrlTable';
import UrlCard from '../components/UrlCard';
import CreateUrlModal from '../components/CreateUrlModal';
import QRCodeModal from '../components/QRCodeModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import EmptyState from '../components/EmptyState';
import { Plus, Search, ArrowUpDown, Filter, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MyUrlsPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt'); // createdAt, clickCount, title

  // Modals state
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUrls = async () => {
    try {
      const response = await api.get('/api/urls');
      setUrls(response.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleToggleStatus = async (id, enabled) => {
    try {
      const response = await api.put(`/api/urls/${id}/toggle?enabled=${enabled}`);
      setUrls(urls.map((url) => (url.id === id ? response.data : url)));
      toast.success(enabled ? 'Link enabled successfully' : 'Link disabled successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update link status');
    }
  };

  const handleEditClick = (url) => {
    setSelectedUrl(url);
    setCreateModalOpen(true);
  };

  const handleQrCodeClick = (url) => {
    setSelectedUrl(url);
    setQrModalOpen(true);
  };

  const handleDeleteClick = (url) => {
    setSelectedUrl(url);
    setDeleteDialogOpen(true);
  };

  const handleCreateOrUpdate = async (payload) => {
    setActionLoading(true);
    try {
      if (selectedUrl) {
        // Edit Mode
        const response = await api.put(`/api/urls/${selectedUrl.id}`, payload);
        setUrls(urls.map((url) => (url.id === selectedUrl.id ? response.data : url)));
        toast.success('Link updated successfully');
      } else {
        // Create Mode
        const response = await api.post('/api/urls', payload);
        setUrls([response.data, ...urls]);
        toast.success('Link shortened successfully');
      }
      setCreateModalOpen(false);
      setSelectedUrl(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to process link');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUrl) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/urls/${selectedUrl.id}`);
      setUrls(urls.filter((url) => url.id !== selectedUrl.id));
      toast.success('Link deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedUrl(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete link');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter and sort URLs
  const filteredUrls = urls
    .filter((url) => {
      const matchSearch =
        (url.title && url.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        url.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.longUrl.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'clickCount') return b.clickCount - a.clickCount;
      if (sortBy === 'title') {
        const titleA = a.title || 'Untitled';
        const titleB = b.title || 'Untitled';
        return titleA.localeCompare(titleB);
      }
      // default: sortBy === 'createdAt'
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
            My Shortened Links
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-550 mt-1">
            Manage, copy, toggle, edit, or view detailed performance statistics.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedUrl(null);
            setCreateModalOpen(true);
          }}
          className="btn-primary flex items-center justify-center gap-2 text-sm w-full sm:w-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Create Link
        </button>
      </div>

      {/* Filter / Search panel */}
      {urls.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Search bar */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, short code or original URL..."
              className="input-field pl-10 py-2 text-sm"
            />
          </div>

          {/* Sorting key */}
          <div className="relative w-full sm:w-48 flex-shrink-0">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 cursor-pointer appearance-none"
            >
              <option value="createdAt">Date Created</option>
              <option value="clickCount">Total Clicks</option>
              <option value="title">Link Title</option>
            </select>
          </div>
        </div>
      )}

      {/* List content */}
      {loading ? (
        <div className="space-y-4">
          {/* Skeletons */}
          <div className="md:block hidden">
            <UrlTable loading={true} />
          </div>
          <div className="grid grid-cols-1 md:hidden gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <UrlCard key={i} loading={true} />
            ))}
          </div>
        </div>
      ) : urls.length === 0 ? (
        <EmptyState onAction={() => setCreateModalOpen(true)} />
      ) : filteredUrls.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/20 dark:bg-slate-900/10 backdrop-blur-sm text-slate-450 dark:text-slate-550 text-sm">
          No matches found for search string "{searchTerm}".
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <UrlTable
              urls={filteredUrls}
              onEdit={handleEditClick}
              onQrCode={handleQrCodeClick}
              onDelete={handleDeleteClick}
              onToggleStatus={handleToggleStatus}
            />
          </div>

          {/* Mobile Grid Cards View */}
          <div className="grid grid-cols-1 md:hidden gap-4">
            {filteredUrls.map((url) => (
              <UrlCard
                key={url.id}
                url={url}
                onEdit={handleEditClick}
                onQrCode={handleQrCodeClick}
                onDelete={handleDeleteClick}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </>
      )}

      {/* Modals and Dialogs */}
      <CreateUrlModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setSelectedUrl(null);
        }}
        onSubmit={handleCreateOrUpdate}
        loading={actionLoading}
        editData={selectedUrl}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setSelectedUrl(null);
        }}
        urlId={selectedUrl?.id}
        shortCode={selectedUrl?.shortCode}
        longUrl={selectedUrl?.longUrl}
      />

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedUrl(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete Short URL Link?"
      />
    </div>
  );
};

export default MyUrlsPage;
