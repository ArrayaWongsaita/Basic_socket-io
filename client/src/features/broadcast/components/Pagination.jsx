import { PRIVATE_ROUTES } from '@/shared/constants';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

const pageList = ['all', '1', '2', '3', '4', '5'];

export default function Pagination() {
  const params = useParams();
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    navigate(`${PRIVATE_ROUTES.CHAT}/${page}`);
  };

  return (
    <div className="flex gap-2 p-4">
      {pageList.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 border rounded-lg transition-colors ${
            params.page === page || (!params.page && page === 'all')
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
