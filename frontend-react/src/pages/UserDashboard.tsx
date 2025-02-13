import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Complaint {
  _id: string;
  title: string;
  description: string;
  department: "Exams" | "Admission" | "Results" | "Library" | "Hostel" | "Transport" | "Other";
  response?: string;
  createdAt: string;
  updatedAt: string;
  isResolved: boolean;
}

const UserDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await fetch('http://localhost:7000/users/user/complaints', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }

        const data = await response.json();
        console.log(data);
        setComplaints(data.complaints);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
          <button
            onClick={() => navigate('/new-complaint')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create New Complaint
          </button>
        </div>

        <div className="grid gap-6">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{complaint.title}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    complaint.isResolved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {complaint.isResolved ? 'Resolved' : 'Pending'}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600">{complaint.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Department:</span> {complaint.department}
                </div>
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </div>
              </div>

              {complaint.response && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">Response:</p>
                  <p className="text-gray-600">{complaint.response}</p>
                </div>
              )}
            </div>
          ))}

          {complaints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No complaints filed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

