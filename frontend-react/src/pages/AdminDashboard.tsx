import axios from 'axios';
import { useEffect, useState } from 'react';
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
    user?: {
        username: string;
    };
}

interface ComplaintStats {
    total: number;
    resolved: number;
    pending: number;
    byDepartment: {
        [key: string]: number;
    };
}

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [stats, setStats] = useState<ComplaintStats>({
        total: 0,
        resolved: 0,
        pending: 0,
        byDepartment: {},
    });
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
                const response = await axios.get('https://mini-project-cmrtc-api.onrender.com', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Fetched complaints:', response.data);
                setComplaints(response.data.complaints);
                calculateStats(response.data.complaints);
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

    const calculateStats = (complaintsData: Complaint[]) => {
        const newStats: ComplaintStats = {
            total: complaintsData.length,
            resolved: complaintsData.filter(c => c.isResolved).length,
            pending: complaintsData.filter(c => !c.isResolved).length,
            byDepartment: {}
        };

        complaintsData.forEach(complaint => {
            newStats.byDepartment[complaint.department] = 
                (newStats.byDepartment[complaint.department] || 0) + 1;
        });

        setStats(newStats);
    };

    const downloadReport = () => {
        try {
            if (!complaints || complaints.length === 0) {
                alert('No complaints data to download');
                return;
            }

            const BOM = '\uFEFF';
            
            const reportData = complaints.map(complaint => ({
                'Title': complaint.title?.replace(/,/g, ';') || '',
                'Description': complaint.description?.replace(/,/g, ';') || '',
                'Department': complaint.department || '',
                'Status': complaint.isResolved ? 'Resolved' : 'Pending',
                'Created Date': new Date(complaint.createdAt).toLocaleDateString(),
                'User': complaint.user?.username || 'Unknown User'
            }));

            const headers = Object.keys(reportData[0]);
            const csvRows = reportData.map(row => 
                headers.map(header => {
                    const value = row[header as keyof typeof row] || '';
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            );

            const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `complaints-report-${new Date().toISOString().slice(0,10)}.csv`);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Please try again.');
        }
    };

    const handleResolve = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to login');
                navigate('/login');
                return;
            }

            const response = window.prompt('Please enter your response for resolving this complaint:');
            if (!response) {
                return; // User cancelled or entered empty response
            }

            await axios.post(`https://mini-project-cmrtc-api.onrender.com/users/admin/complaints/${id}`, 
                { response }, // Send response text in request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setComplaints(complaints.map(complaint =>
                complaint._id === id ? { ...complaint, isResolved: true, response } : complaint
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

            await axios.delete(`https://mini-project-cmrtc-api.onrender.com/users/admin/complaints/${id}`, {
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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={downloadReport}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Download Report
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Total Complaints</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Resolved</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Pending</h3>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Resolution Rate</h3>
                        <p className="text-3xl font-bold text-purple-600">
                            {stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                        </p>
                    </div>
                </div>

                {/* Department Statistics */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Complaints by Department</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(stats.byDepartment).map(([dept, count]) => (
                            <div key={dept} className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-700">{dept}</h4>
                                <p className="text-2xl font-bold text-blue-600">{count}</p>
                            </div>
                        ))}
                    </div>
                </div>

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
