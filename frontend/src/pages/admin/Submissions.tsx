import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import AdminLayout from '../../components/AdminLayout';

export default function AdminSubmissions() {
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['submissions', statusFilter],
    queryFn: () => apiClient.submissions.list({ status: statusFilter }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.submissions.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setSelectedSubmission(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiClient.submissions.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setSelectedSubmission(null);
    },
  });

  const handleDownloadAll = () => {
    const submissions = data?.submissions || [];
    submissions.forEach((submission: any, index: number) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = `http://localhost:3000/uploads/${submission.video.storagePath}`;
        link.download = `${submission.personName}-testimonial.${submission.video.storagePath.split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 300); // Stagger downloads by 300ms to avoid browser blocking
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Submissions</h1>
          <button
            onClick={handleDownloadAll}
            disabled={!data?.submissions?.length}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Download all videos in current filter"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download All ({data?.submissions?.length || 0})
          </button>
        </div>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Rating</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.submissions?.map((submission: any) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{submission.personName}</td>
                  <td className="px-6 py-4">{submission.personRole}</td>
                  <td className="px-6 py-4">
                    <span className="text-yellow-400">
                      {'★'.repeat(submission.rating)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View
                      </button>
                      <a
                        href={`http://localhost:3000/uploads/${submission.video.storagePath}`}
                        download={`${submission.personName}-testimonial.${submission.video.storagePath.split('.').pop()}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                        title="Download video"
                      >
                        Download
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Review Submission</h2>
              <div className="flex gap-2">
                <a
                  href={`http://localhost:3000/uploads/${selectedSubmission.video.storagePath}`}
                  download={`${selectedSubmission.personName}-testimonial.${selectedSubmission.video.storagePath.split('.').pop()}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  title="Download video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-gray-700 px-2"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-lg">{selectedSubmission.personName}</h3>
                <p className="text-gray-600">{selectedSubmission.personRole}</p>
                {selectedSubmission.companyName && (
                  <p className="text-gray-500 text-sm">{selectedSubmission.companyName}</p>
                )}
                <div className="text-yellow-400 mt-2">
                  {'★'.repeat(selectedSubmission.rating)}
                  {'☆'.repeat(5 - selectedSubmission.rating)}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Testimonial:</h4>
                <p className="text-gray-700">{selectedSubmission.text}</p>
              </div>

              {selectedSubmission.video?.storagePath && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Video:</h4>
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={`http://localhost:3000/uploads/${selectedSubmission.video.storagePath}`}
                  />
                </div>
              )}

              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => approveMutation.mutate(selectedSubmission._id)}
                    disabled={approveMutation.isPending}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(selectedSubmission._id)}
                    disabled={rejectMutation.isPending}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
