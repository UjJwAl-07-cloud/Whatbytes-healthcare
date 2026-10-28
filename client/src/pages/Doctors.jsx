import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Inbox, Stethoscope, Mail, Phone, Eye } from 'lucide-react';
import { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } from '../api/doctorApi';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import './Doctors.css';

const emptyForm = { name: '', specialization: '', email: '', phone: '' };

export default function Doctors() {
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Doctor profile view modal
  const [viewDoctor, setViewDoctor] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data || []);
    } catch {
      showError('Failed to load doctors list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (location.state?.openAdd) {
      openAddModal();
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const filtered = doctors.filter((doc) => {
    const q = search.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.specialization.toLowerCase().includes(q) ||
      (doc.email && doc.email.toLowerCase().includes(q))
    );
  });

  const openAddModal = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setEditing(doctor);
    setForm({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleViewDoctor = async (doctorId) => {
    try {
      const res = await getDoctor(doctorId);
      setViewDoctor(res.data || res);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load doctor profile');
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Doctor name is required';
    if (!form.specialization.trim()) errs.specialization = 'Specialization is required';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        specialization: form.specialization.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
      };

      if (editing) {
        await updateDoctor(editing.id, payload);
        showSuccess('Doctor updated successfully');
      } else {
        await createDoctor(payload);
        showSuccess('Doctor added successfully');
      }
      setShowModal(false);
      setLoading(true);
      fetchDoctors();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed';
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoctor(deleteTarget.id);
      showSuccess('Doctor deleted successfully');
      setDeleteTarget(null);
      setLoading(true);
      fetchDoctors();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete doctor');
      setDeleteTarget(null);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (formErrors[field]) setFormErrors({ ...formErrors, [field]: '' });
  };

  if (loading) return <LoadingSpinner message="Loading doctors..." />;

  return (
    <div className="doctors-page">
      <div className="page-header">
        <div>
          <h2>Doctors Directory</h2>
          <p className="page-subtitle">Manage medical practitioners and specialists</p>
        </div>
        <div className="page-header-actions">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, specialization..."
          />
          <button className="btn btn-primary-action" onClick={openAddModal}>
            <Plus size={16} />
            Add Doctor
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="data-table-wrapper">
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <Inbox size={40} />
            <p>
              {search
                ? 'No doctors match your search query.'
                : 'No doctors registered yet. Click "Add Doctor" to add one.'}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-cell" onClick={() => handleViewDoctor(doc.id)} style={{ cursor: 'pointer' }}>
                        <div className="doc-avatar-sm">
                          <Stethoscope size={16} />
                        </div>
                        <span className="doc-cell-name">{doc.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="specialization-tag">{doc.specialization}</span>
                    </td>
                    <td>
                      {doc.email ? (
                        <span className="contact-link">
                          <Mail size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                          {doc.email}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {doc.phone ? (
                        <span>
                          <Phone size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                          {doc.phone}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-icon"
                          title="View Doctor Profile"
                          aria-label={`View profile of ${doc.name}`}
                          onClick={() => handleViewDoctor(doc.id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Edit Doctor"
                          aria-label={`Edit ${doc.name}`}
                          onClick={() => openEditModal(doc)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn-icon danger"
                          title="Delete Doctor"
                          aria-label={`Delete ${doc.name}`}
                          onClick={() => setDeleteTarget(doc)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-cards">
            {filtered.map((doc) => (
              <div className="doctor-card-mobile" key={doc.id}>
                <div className="card-header">
                  <div>
                    <div className="card-name" onClick={() => handleViewDoctor(doc.id)} style={{ cursor: 'pointer' }}>
                      {doc.name}
                    </div>
                    <span className="specialization-tag">{doc.specialization}</span>
                    {doc.email && (
                      <div className="card-detail">
                        <Mail size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {doc.email}
                      </div>
                    )}
                    {doc.phone && (
                      <div className="card-detail">
                        <Phone size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {doc.phone}
                      </div>
                    )}
                  </div>
                  <div className="table-actions">
                    <button
                      className="btn-icon"
                      title="View Doctor Profile"
                      aria-label={`View profile of ${doc.name}`}
                      onClick={() => handleViewDoctor(doc.id)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      title="Edit Doctor"
                      aria-label={`Edit ${doc.name}`}
                      onClick={() => openEditModal(doc)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon danger"
                      title="Delete Doctor"
                      aria-label={`Delete ${doc.name}`}
                      onClick={() => setDeleteTarget(doc)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* View Doctor Profile Modal */}
      {viewDoctor && (
        <div className="modal-overlay" onClick={() => setViewDoctor(null)}>
          <div className="modal doc-profile-modal" role="dialog" aria-modal="true" aria-labelledby="view-doctor-title" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="view-doctor-title">Doctor Profile</h3>
              <button className="modal-close" onClick={() => setViewDoctor(null)} aria-label="Close profile">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="doc-profile-header">
                <div className="doc-avatar-lg">
                  <Stethoscope size={26} />
                </div>
                <div className="doc-profile-main">
                  <h4>{viewDoctor.name}</h4>
                  <span className="specialization-tag">{viewDoctor.specialization}</span>
                </div>
              </div>

              <div className="doc-details-list">
                <div className="doc-detail-row">
                  <span className="doc-detail-label">Email:</span>
                  <span className="doc-detail-value">{viewDoctor.email || 'Not provided'}</span>
                </div>
                <div className="doc-detail-row">
                  <span className="doc-detail-label">Phone:</span>
                  <span className="doc-detail-value">{viewDoctor.phone || 'Not provided'}</span>
                </div>
                {viewDoctor.createdAt && (
                  <div className="doc-detail-row">
                    <span className="doc-detail-label">Registered:</span>
                    <span className="doc-detail-value">{new Date(viewDoctor.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const target = viewDoctor;
                  setViewDoctor(null);
                  openEditModal(target);
                }}
              >
                <Pencil size={14} /> Edit Doctor
              </button>
              <button
                type="button"
                className="btn btn-primary-action"
                onClick={() => setViewDoctor(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Doctor Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-doctor-title" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="edit-doctor-title">{editing ? 'Edit Doctor' : 'Add New Doctor'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close dialog">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="doctor-name">Full Name *</label>
                  <input
                    id="doctor-name"
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="e.g. Dr. Sarah Johnson"
                    className={formErrors.name ? 'input-error' : ''}
                  />
                  {formErrors.name && <div className="error-text">{formErrors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="doctor-spec">Specialization *</label>
                  <input
                    id="doctor-spec"
                    type="text"
                    value={form.specialization}
                    onChange={handleChange('specialization')}
                    placeholder="e.g. Cardiology, Neurology, General Medicine"
                    className={formErrors.specialization ? 'input-error' : ''}
                  />
                  {formErrors.specialization && (
                    <div className="error-text">{formErrors.specialization}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="doctor-email">Email Address</label>
                  <input
                    id="doctor-email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="doctor@hospital.com (optional)"
                    className={formErrors.email ? 'input-error' : ''}
                  />
                  {formErrors.email && <div className="error-text">{formErrors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="doctor-phone">Phone Number</label>
                  <input
                    id="doctor-phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder="+1 (555) 012-3456 (optional)"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-action"
                  disabled={submitting}
                >
                  {submitting ? (
                    <LoadingSpinner small />
                  ) : editing ? (
                    'Update Doctor'
                  ) : (
                    'Add Doctor'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Doctor"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Any active mappings involving this doctor will be removed.`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
