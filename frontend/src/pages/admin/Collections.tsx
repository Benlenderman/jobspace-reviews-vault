import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import AdminLayout from '../../components/AdminLayout';

export default function AdminCollections() {
  const { data, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => apiClient.collections.list(),
  });

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Collections</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {data?.collections?.map((collection: any) => (
            <div key={collection._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Slug: {collection.slug}</p>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Incentive URL:</span>
                      <br />
                      <a
                        href={`http://localhost:5173/incentive/${collection.publicToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        http://localhost:5173/incentive/{collection.publicToken}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Submit URL:</span>
                      <br />
                      <a
                        href={`http://localhost:5173/submit/${collection.publicToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        http://localhost:5173/submit/{collection.publicToken}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Wall URL:</span>
                      <br />
                      <a
                        href={`http://localhost:5173/reviews/${collection.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        http://localhost:5173/reviews/{collection.slug}
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      collection.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {collection.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
