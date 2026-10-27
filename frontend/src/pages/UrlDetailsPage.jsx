import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { TimelineChart, DistributionBarChart, DistributionPieChart } from '../components/AnalyticsChart';
import QRCodeModal from '../components/QRCodeModal';
import CreateUrlModal from '../components/CreateUrlModal';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import {
  ArrowLeft,
  Calendar,
  Copy,
  Check,
  QrCode,
  Edit,
  Trash2,
  ExternalLink,
  MousePointerClick,
  Monitor,
  Compass,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

const UrlDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Modal actions states
  const [selectedUrlData, setSelectedUrlData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/analytics/urls/${id}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching URL details:', error);
      toast.error('Failed to load link analytics');
      navigate('/urls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.shortUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditConfirm = async (payload) => {
    setActionLoading(true);
    try {
      const response = await api.put(`/api/urls/${id}`, payload);
      // Refresh details
      const detailsRes = await api.get(`/api/analytics/urls/${id}`);
      setData(detailsRes.data);
      toast.success('Link updated successfully');
      setEditModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update link');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/api/urls/${id}`);
      toast.success('Link deleted successfully');
      setDeleteDialogOpen(false);
      navigate('/urls');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete link');
    } finally {
      setActionLoading(false);
    }
  };

  const formatTimestamp = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return <Loader fullPage={true} />;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Back button and Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/urls"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Links
        </Link>
        
        {/* Actions panel */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setQrModalOpen(true)}
            className="btn-secondary flex items-center gap-1.5 py-2 px-3 text-xs min-h-[40px]"
          >
            <QrCode className="w-4 h-4" />
            QR Code
          </button>
          <button
            onClick={() => {
              setSelectedUrlData({
                longUrl: data.longUrl,
                title: data.title,
                expiresAt: data.expiresAt,
              });
              setEditModalOpen(true);
            }}
            className="btn-secondary flex items-center gap-1.5 py-2 px-3 text-xs min-h-[40px]"
          >
            <Edit className="w-4 h-4" />
            Edit Link
          </button>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-650 dark:bg-red-950/20 dark:hover:bg-red-950/35 border border-red-200/20 dark:border-red-900/10 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 min-h-[40px]"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Hero Link Panel */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5 min-w-0 flex-1 w-full">
            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white truncate">
              {data.title || 'Untitled Link'}
            </h2>
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <a
                href={data.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs sm:text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline break-all sm:truncate"
              >
                {data.shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition-colors"
                title="Copy Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <a
              href={data.longUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-450 dark:text-slate-500 hover:text-violet-500 hover:underline flex items-center gap-1 truncate"
            >
              Redirects to: {data.longUrl}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>

          {/* Click Count summary */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 px-6 py-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 w-full md:w-auto">
            <div className="p-3 bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total Click Views</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {data.clickCount.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Graphs */}
      {data.clickCount === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/20 dark:bg-slate-900/10 backdrop-blur-sm">
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-2">No clicks recorded yet.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Share your shortened link to gather browser, operating system, and geographic click analytics.</p>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Timeline */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 min-w-0">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Click History Timeline</h3>
                  <p className="text-xs text-slate-400 mt-1">Clicks recorded over the last 30 days</p>
                </div>
                <button
                  onClick={fetchAnalytics}
                  className="p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-all"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <TimelineChart data={data.clicksPerDay} />
            </div>

            {/* Devices */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between min-w-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Monitor className="w-4 h-4 text-violet-500" />
                  Devices
                </h3>
                <p className="text-[10px] text-slate-400">Visitor device classifications</p>
              </div>
              <DistributionPieChart data={data.devices} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Browsers */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                <Compass className="w-4 h-4 text-violet-500" />
                Browser Distributions
              </h3>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 mb-6">Click share split across popular browsers</p>
              <DistributionBarChart data={data.browsers} />
            </div>

            {/* Operating Systems */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between min-w-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                  <Cpu className="w-4 h-4 text-violet-500" />
                  Operating Systems
                </h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 mb-6">Audience OS distributions</p>
              </div>
              <DistributionBarChart data={data.operatingSystems} />
            </div>
          </div>

          {/* Click Logs Table */}
          <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-850">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Clicks Activity</h3>
              <p className="text-xs text-slate-400 mt-1">Detailed details logs of the latest clicks (max 30 records)</p>
            </div>
            
            <div className="w-full overflow-x-auto -mx-1 px-1">
              <table className="w-full min-w-[640px] sm:min-w-[700px] border-collapse text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50/75 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold uppercase border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4 pl-6">Timestamp</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4">Device Info</th>
                    <th className="p-4">Referrer Domain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {data.recentClicks.map((click, index) => (
                    <tr key={index} className="hover:bg-slate-50/25 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="p-4 pl-6 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {formatTimestamp(click.clickedAt)}
                      </td>
                      <td className="p-4 font-mono">{click.ipAddress || 'unknown'}</td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mr-2">
                          {click.deviceType}
                        </span>
                        {click.browser} on {click.operatingSystem}
                      </td>
                      <td className="p-4 truncate max-w-[200px]" title={click.referrer}>
                        {click.referrer}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Overlay Modals */}
      <CreateUrlModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditConfirm}
        loading={actionLoading}
        editData={selectedUrlData}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        urlId={id}
        shortCode={data.shortCode}
        longUrl={data.longUrl}
      />

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
};

export default UrlDetailsPage;
