import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, Link2, Plus, UserPlus, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getPatients } from '../api/patientApi';
import { getDoctors } from '../api/doctorApi';
import { getMappings } from '../api/mappingApi';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [stats, setStats] = useState({ patients: 0, doctors: 0, mappings: 0 });
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, mappingsRes] = await Promise.all([
          getPatients(),
          getDoctors(),
          getMappings(),
        ]);

        const patients = patientsRes.data || [];
        const doctors = doctorsRes.data || [];
        const mappings = mappingsRes.data || [];

        setStats({
          patients: patients.length,
          doctors: doctors.length,
          mappings: mappings.length,
        });

        setRecentPatients(patients.slice(0, 5));
      } catch (err) {
        showError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const getInitials = (name) =>
    name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : '?';

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      <p className="welcome-text">Welcome back, {user?.name || 'User'}! Here&apos;s an overview of your healthcare management system.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.patients}</h3>
            <p>My Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Stethoscope size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.doctors}</h3>
            <p>Available Doctors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <Link2 size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.mappings}</h3>
            <p>My Assignments</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="section-body">
          <div className="quick-actions">
            <Link to="/patients" state={{ openAdd: true }} className="quick-btn primary">
              <UserPlus size={16} />
              Add Patient
            </Link>
            <Link to="/doctors" state={{ openAdd: true }} className="quick-btn">
              <Plus size={16} />
              Add Doctor
            </Link>
            <Link to="/mappings" state={{ openAdd: true }} className="quick-btn">
              <Link2 size={16} />
              Create Mapping
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Patients</h3>
          {recentPatients.length > 0 && (
            <Link to="/patients" className="recent-view">View All</Link>
          )}
        </div>
        <div className="section-body">
          {recentPatients.length === 0 ? (
            <div className="empty-state">
              <Inbox size={36} />
              <p>No patients yet. Add your first patient to get started.</p>
            </div>
          ) : (
            <ul className="recent-list">
              {recentPatients.map((patient) => (
                <li key={patient.id}>
                  <div className="recent-patient-info">
                    <div className="recent-avatar">{getInitials(patient.name)}</div>
                    <div>
                      <div className="recent-name">{patient.name}</div>
                      <div className="recent-details">
                        {patient.age} yrs • {patient.gender}
                        {patient.phone ? ` • ${patient.phone}` : ''}
                      </div>
                    </div>
                  </div>
                  <Link to={`/patients/${patient.id}`} className="recent-view">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
