import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Trash2, Link2, X, Inbox, User, Stethoscope, Filter } from 'lucide-react';
import { getMappings, createMapping, deleteMapping } from '../api/mappingApi';
import { getPatients } from '../api/patientApi';
import { getDoctors } from '../api/doctorApi';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import './Mappings.css';

export default function Mappings() {
  const location = useLocation();
  const { showSuccess, showError } = useNotification();

  const [mappings, setMappings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [filterPatientId, setFilterPatientId] = useState('');

  // Create Mapping Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    try {
      const [mappingsRes, patientsRes, doctorsRes] = await Promise.all([
        getMappings(),
        getPatients(),
        getDoctors(),
      ]);

      setMappings(mappingsRes.data || []);
      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
    } catch {
      showError('Failed to load mappings or reference data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.openAdd) {
      openAddModal();
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const openAddModal = () => {
    setSelectedPatientId('');
    setSelectedDoctorId('');
    setFormError('');
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedPatientId) {
      setFormError('Please select a patient.');
      return;
    }
    if (!selectedDoctorId) {
      setFormError('Please select a doctor.');
      return;
    }

    setSubmitting(true);
    try {
      await createMapping({
        patientId: parseInt(selectedPatientId, 10),
        doctorId: parseInt(selectedDoctorId, 10),
      });

      showSuccess('Doctor successfully assigned to patient.');
      setShowModal(false);
      setLoading(true);
      fetchData();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? 'This doctor is already assigned to this patient.'
          : 'Failed to assign doctor.');
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMapping(deleteTarget.id);
      showSuccess('Assignment removed successfully.');
      setDeleteTarget(null);
      setLoading(true);
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to remove assignment.');
      setDeleteTarget(null);
    }
  };

  const filteredMappings = mappings.filter((m) => {
    if (!filterPatientId) return true;
    return m.patientId === parseInt(filterPatientId, 10);
  });

  if (loading) return <LoadingSpinner message="Loading patient-doctor mappings..." />;

  return (
    <div className="mappings-page">
      <div className="page-header">
        <div>
          <h2>Patient-Doctor Mappings</h2>
          <p className="page-subtitle">Assign doctors to patients and manage active clinical relationships</p>
        </div>
        <div className="page-header-actions">
          {patients.length > 0 && (
            <div className="filter-wrapper">
              <Filter size={15} className="filter-icon" />
              <select
                className="filter-select"
                value={filterPatientId}
                onChange={(e) => setFilterPatientId(e.target.value)}
              >
                <option value="">All Patients ({patients.length})</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button className="btn btn-primary-action" onClick={openAddModal}>
            <Plus size={16} />
            Assign Doctor
          </button>
        </div>
      </div>

      {filteredMappings.length === 0 ? (
        <div className="data-table-wrapper">
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <Inbox size={40} />
            <p>
              {filterPatientId
                ? 'No doctors assigned to the selected patient.'
                : 'No patient-doctor mappings created yet. Click "Assign Doctor" to link a patient with a doctor.'}
            </p>
            {!filterPatientId && (patients.length === 0 || doctors.length === 0) && (
              <p className="empty-hint">
                Note: You need at least one patient and one doctor before creating an assignment.
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Assigned Doctor</th>
                  <th>Specialization</th>
                  <th>Assigned Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMappings.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="mapping-cell">
                        <div className="avatar-chip blue">
                          <User size={14} />
                        </div>
                        <div>
                          <span className="cell-title">{m.patient?.name || 'Unknown Patient'}</span>
                          <span className="cell-sub">
                            {m.patient?.age ? `${m.patient.age} yrs • ${m.patient.gender}` : ''}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="mapping-cell">
                        <div className="avatar-chip green">
                          <Stethoscope size={14} />
                        </div>
                        <span className="cell-title">{m.doctor?.name || 'Unknown Doctor'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="specialization-tag">
                        {m.doctor?.specialization || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className="date-text">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-icon danger"
                        title="Remove Assignment"
                        onClick={() => setDeleteTarget(m)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-cards">
            {filteredMappings.map((m) => (
              <div className="mapping-card-mobile" key={m.id}>
                <div className="card-header">
                  <div>
                    <div className="mapping-title">
                      <strong>{m.patient?.name}</strong> is assigned to{' '}
                      <strong>{m.doctor?.name}</strong>
                    </div>
                    <div className="mapping-specialization">
                      <span className="specialization-tag">{m.doctor?.specialization}</span>
                    </div>
                    <div className="mapping-date">
                      Assigned: {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className="btn-icon danger"
                    title="Remove Assignment"
                    onClick={() => setDeleteTarget(m)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Mapping Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Doctor to Patient</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                {formError && <div className="api-error" style={{ marginBottom: 16 }}>{formError}</div>}

                {patients.length === 0 ? (
                  <div className="prereq-warning">
                    You have no patients yet. Please add a patient first before creating an assignment.
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="prereq-warning">
                    No doctors available in the system. Please add a doctor first.
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="select-patient">Select Patient *</label>
                      <select
                        id="select-patient"
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        required
                      >
                        <option value="">-- Choose Patient --</option>
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.age} yrs, {p.gender})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="select-doctor">Select Doctor *</label>
                      <select
                        id="select-doctor"
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        required
                      >
                        <option value="">-- Choose Doctor --</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} — {d.specialization}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
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
                  disabled={submitting || patients.length === 0 || doctors.length === 0}
                >
                  {submitting ? <LoadingSpinner small /> : 'Assign Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove Assignment"
        message={`Are you sure you want to remove the assignment between patient "${deleteTarget?.patient?.name}" and doctor "${deleteTarget?.doctor?.name}"? Neither the patient nor doctor record will be deleted.`}
        confirmText="Remove"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
