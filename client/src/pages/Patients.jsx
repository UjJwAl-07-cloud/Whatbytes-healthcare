import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, X, Inbox } from 'lucide-react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../api/patientApi';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import './Patients.css';

const emptyForm = { name: '', age: '', gender: 'Male', address: '', phone: '' };

export default function Patients() {
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data || []);
    } catch {
      showError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (location.state?.openAdd) {
      openAddModal();
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (patient) => {
    setEditing(patient);
    setForm({
      name: patient.name || '',
      age: patient.age?.toString() || '',
      gender: patient.gender || 'Male',
      address: patient.address || '',
      phone: patient.phone || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.age) {
      errs.age = 'Age is required';
    } else if (isNaN(form.age) || Number(form.age) < 0 || Number(form.age) > 150) {
      errs.age = 'Enter a valid age (0-150)';
    }
    if (!form.gender) errs.gender = 'Gender is required';
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
        age: Number(form.age),
        gender: form.gender,
        address: form.address.trim() || undefined,
        phone: form.phone.trim() || undefined,
      };

      if (editing) {
        await updatePatient(editing.id, payload);
        showSuccess('Patient updated successfully');
      } else {
        await createPatient(payload);
        showSuccess('Patient added successfully');
      }
      setShowModal(false);
      setLoading(true);
      fetchPatients();
    } catch (err) {
      showError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePatient(deleteTarget.id);
      showSuccess('Patient deleted successfully');
      setDeleteTarget(null);
      setLoading(true);
      fetchPatients();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete patient');
      setDeleteTarget(null);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (formErrors[field]) setFormErrors({ ...formErrors, [field]: '' });
  };

  if (loading) return <LoadingSpinner message="Loading patients..." />;

  return (
    <div className="patients-page">
      <div className="page-header">
        <h2>Patients</h2>
        <div className="page-header-actions">
          <SearchBar value={search} onChange={setSearch} placeholder="Search patients..." />
          <button className="btn btn-primary-action" onClick={openAddModal}>
            <Plus size={16} />
            Add Patient
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="data-table-wrapper">
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <Inbox size={40} />
            <p>{search ? 'No patients match your search.' : 'No patients yet. Click "Add Patient" to get started.'}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr key={patient.id}>
                    <td style={{ fontWeight: 500 }}>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.phone || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/patients/${patient.id}`} className="btn-icon" title="View" aria-label={`View details for ${patient.name}`}>
                          <Eye size={16} />
                        </Link>
                        <button className="btn-icon" title="Edit" onClick={() => openEditModal(patient)} aria-label={`Edit ${patient.name}`}>
                          <Pencil size={16} />
                        </button>
                        <button className="btn-icon danger" title="Delete" onClick={() => setDeleteTarget(patient)} aria-label={`Delete ${patient.name}`}>
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
            {filtered.map((patient) => (
              <div className="patient-card-mobile" key={patient.id}>
                <div className="card-header">
                  <div>
                    <div className="card-name">{patient.name}</div>
                    <div className="card-detail">{patient.age} yrs • {patient.gender}</div>
                    {patient.phone && <div className="card-detail">{patient.phone}</div>}
                  </div>
                  <div className="table-actions">
                    <Link to={`/patients/${patient.id}`} className="btn-icon" title="View" aria-label={`View details for ${patient.name}`}>
                      <Eye size={16} />
                    </Link>
                    <button className="btn-icon" title="Edit" onClick={() => openEditModal(patient)} aria-label={`Edit ${patient.name}`}>
                      <Pencil size={16} />
                    </button>
                    <button className="btn-icon danger" title="Delete" onClick={() => setDeleteTarget(patient)} aria-label={`Delete ${patient.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="patient-modal-title" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="patient-modal-title">{editing ? 'Edit Patient' : 'Add Patient'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close dialog">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="patient-name">Name *</label>
                  <input
                    id="patient-name"
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Patient name"
                    className={formErrors.name ? 'input-error' : ''}
                  />
                  {formErrors.name && <div className="error-text">{formErrors.name}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="patient-age">Age *</label>
                  <input
                    id="patient-age"
                    type="number"
                    value={form.age}
                    onChange={handleChange('age')}
                    placeholder="Age"
                    min="0"
                    max="150"
                    className={formErrors.age ? 'input-error' : ''}
                  />
                  {formErrors.age && <div className="error-text">{formErrors.age}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="patient-gender">Gender *</label>
                  <select id="patient-gender" value={form.gender} onChange={handleChange('gender')}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="patient-address">Address</label>
                  <input
                    id="patient-address"
                    type="text"
                    value={form.address}
                    onChange={handleChange('address')}
                    placeholder="Address (optional)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="patient-phone">Phone</label>
                  <input
                    id="patient-phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder="Phone number (optional)"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary-action" disabled={submitting}>
                  {submitting ? <LoadingSpinner small /> : editing ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Patient"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
