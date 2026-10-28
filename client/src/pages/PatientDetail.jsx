import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Stethoscope, Plus, Trash2, Calendar, Phone, MapPin, Inbox, AlertCircle, X } from 'lucide-react';
import { getPatient } from '../api/patientApi';
import { getDoctors } from '../api/doctorApi';
import { getPatientMappings, createMapping, deleteMapping } from '../api/mappingApi';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import './PatientDetail.css';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [patient, setPatient] = useState(null);
  const [assignedDoctors, setAssignedDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assign doctor modal/state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Unassign dialog
  const [unassignTarget, setUnassignTarget] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [patientRes, mappingsRes, doctorsRes] = await Promise.all([
        getPatient(id),
        getPatientMappings(id),
        getDoctors(),
      ]);

      setPatient(patientRes.data);
      setAssignedDoctors(mappingsRes.data?.doctors || []);
      setAllDoctors(doctorsRes.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Patient not found or you do not have permission to view this record.');
      } else {
        setError('Failed to load patient details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAssignDoctor = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      showError('Please select a doctor.');
      return;
    }

    setAssigning(true);
    try {
      await createMapping({
        patientId: parseInt(id, 10),
        doctorId: parseInt(selectedDoctorId, 10),
      });
      showSuccess('Doctor assigned successfully.');
      setShowAssignModal(false);
      setSelectedDoctorId('');
      // Reload mappings
      const updated = await getPatientMappings(id);
      setAssignedDoctors(updated.data?.doctors || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to assign doctor.';
      showError(msg);
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassignDoctor = async () => {
    if (!unassignTarget) return;

    try {
      await deleteMapping(unassignTarget.mappingId);
      showSuccess('Doctor unassigned successfully.');
      setUnassignTarget(null);
      // Reload mappings
      const updated = await getPatientMappings(id);
      setAssignedDoctors(updated.data?.doctors || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to unassign doctor.';
      showError(msg);
      setUnassignTarget(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading patient details..." />;
  }

  if (error) {
    return (
      <div className="patient-detail-error">
        <div className="error-card">
          <AlertCircle size={48} className="error-icon" />
          <h3>Unable to Load Patient</h3>
          <p>{error}</p>
          <button className="btn btn-primary-action" onClick={() => navigate('/patients')}>
            <ArrowLeft size={16} /> Back to Patients
          </button>
        </div>
      </div>
    );
  }

  // Filter out doctors already assigned for the assignment dropdown
  const assignedDoctorIds = new Set(assignedDoctors.map((d) => d.id));
  const availableDoctorsToAssign = allDoctors.filter((d) => !assignedDoctorIds.has(d.id));

  return (
    <div className="patient-detail-page">
      <div className="detail-header">
        <Link to="/patients" className="back-link">
          <ArrowLeft size={18} />
          Back to Patients
        </Link>
        <button className="btn btn-primary-action" onClick={() => setShowAssignModal(true)}>
          <Plus size={16} />
          Assign Doctor
        </button>
      </div>

      <div className="patient-overview-card">
        <div className="patient-avatar-large">
          <User size={36} />
        </div>
        <div className="patient-info-main">
          <h2>{patient.name}</h2>
          <div className="patient-tags">
            <span className="badge badge-age">{patient.age} years old</span>
            <span className="badge badge-gender">{patient.gender}</span>
          </div>

          <div className="patient-meta-grid">
            {patient.phone && (
              <div className="meta-item">
                <Phone size={15} />
                <span>{patient.phone}</span>
              </div>
            )}
            {patient.address && (
              <div className="meta-item">
                <MapPin size={15} />
                <span>{patient.address}</span>
              </div>
            )}
            <div className="meta-item">
              <Calendar size={15} />
              <span>Registered on {new Date(patient.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="assigned-doctors-section">
        <div className="section-title-row">
          <div className="title-with-icon">
            <Stethoscope size={20} />
            <h3>Assigned Doctors ({assignedDoctors.length})</h3>
          </div>
        </div>

        {assignedDoctors.length === 0 ? (
          <div className="empty-doctors-card">
            <Inbox size={36} />
            <p>No doctors assigned to this patient yet.</p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAssignModal(true)}
              style={{ marginTop: '12px' }}
            >
              Assign a Doctor
            </button>
          </div>
        ) : (
          <div className="doctors-grid">
            {assignedDoctors.map((doc) => (
              <div className="assigned-doc-card" key={doc.mappingId}>
                <div className="doc-card-body">
                  <div className="doc-avatar">
                    <Stethoscope size={20} />
                  </div>
                  <div className="doc-info">
                    <h4>{doc.name}</h4>
                    <span className="doc-specialization">{doc.specialization}</span>
                    {doc.email && <div className="doc-contact">{doc.email}</div>}
                    {doc.phone && <div className="doc-contact">{doc.phone}</div>}
                  </div>
                </div>
                <div className="doc-card-footer">
                  <button
                    className="btn-icon danger"
                    title="Remove assignment"
                    onClick={() => setUnassignTarget(doc)}
                  >
                    <Trash2 size={16} />
                    <span className="btn-label-inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Doctor Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="assign-doc-title" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="assign-doc-title">Assign Doctor to {patient.name}</h3>
              <button className="modal-close" onClick={() => setShowAssignModal(false)} aria-label="Close dialog">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAssignDoctor}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="doctor-select">Select Doctor *</label>
                  {availableDoctorsToAssign.length === 0 ? (
                    <p className="no-docs-note">
                      {allDoctors.length === 0
                        ? 'No doctors exist in the system yet. Please add doctors first.'
                        : 'All available doctors are already assigned to this patient.'}
                    </p>
                  ) : (
                    <select
                      id="doctor-select"
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose a doctor --</option>
                      {availableDoctorsToAssign.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} — {d.specialization}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-action"
                  disabled={assigning || availableDoctorsToAssign.length === 0 || !selectedDoctorId}
                >
                  {assigning ? <LoadingSpinner small /> : 'Assign Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unassign Confirmation */}
      <ConfirmDialog
        isOpen={!!unassignTarget}
        title="Remove Doctor Assignment"
        message={`Are you sure you want to unassign "${unassignTarget?.name}" from ${patient.name}? The doctor and patient records will remain intact.`}
        confirmText="Remove"
        confirmVariant="danger"
        onConfirm={handleUnassignDoctor}
        onCancel={() => setUnassignTarget(null)}
      />
    </div>
  );
}
