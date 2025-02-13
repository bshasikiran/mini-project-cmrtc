import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Complaint {
    _id: string;
    title: string;
    description: string;
    department: string;
    isResolved: boolean;
    status: 'pending' | 'resolved';
    createdAt: string;
    userId: {
        username: string;
    };
}

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
            return;
        }

        const fetchComplaints = async () => {
            try {
                const response = await axios.get('http://localhost:7000/users/admin/complaints', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Fetched complaints:', response.data);
                setComplaints(response.data.complaints);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching complaints:', err);
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        console.log('Unauthorized access, redirecting to login');
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    setError(err.response?.data?.message || 'Failed to fetch complaints');
                } else {
                    setError('An unexpected error occurred');
                }
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [navigate]);

    const handleResolve = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to login');
                navigate('/login');
                return;
            }

            await axios.post(`http://localhost:7000/users/admin/complaints/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setComplaints(complaints.map(complaint =>
                complaint._id === id ? { ...complaint, status: 'resolved' } : complaint
            ));
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Error resolving complaint:', err);
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    console.log('Unauthorized access, redirecting to login');
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                setError(err.response?.data?.message || 'Failed to resolve complaint');
            } else {
                setError('An unexpected error occurred while resolving the complaint');
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this complaint?');
            if (!confirm) {
                return;
            }
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to login');
                navigate('/login');
                return;
            }

            await axios.delete(`http://localhost:7000/users/admin/complaints/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setComplaints(complaints.filter(complaint => complaint._id !== id));
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Error deleting complaint:', err);
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    console.log('Unauthorized access, redirecting to login');
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                setError(err.response?.data?.message || 'Failed to delete complaint');
            } else {
                setError('An unexpected error occurred while deleting the complaint');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="grid gap-6">
                    {complaints.map((complaint) => (
                        <div
                            key={complaint._id}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">{complaint.title}</h2>
                                    <p className="text-gray-600 text-sm">

                                        Department: {complaint.department} |
                                        Date: {new Date(complaint.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${!complaint.isResolved
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {complaint.isResolved ? 'Resolved' : 'Pending'}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-4">{complaint.description}</p>

                            <div className="flex justify-end space-x-4">
                                {!complaint.isResolved && (
                                    <button
                                        onClick={() => handleResolve(complaint._id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(complaint._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
