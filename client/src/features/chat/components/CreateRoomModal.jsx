import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { roomService } from '../../../shared/services';
import { Button } from '../../../shared/components/ui';
import { XMarkIcon } from '@heroicons/react/24/outline';

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, 'Room name is required')
    .max(50, 'Room name must be less than 50 characters'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  isPrivate: z.boolean().default(false),
});

export default function CreateRoomModal({ onClose, onRoomCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: '',
      isPrivate: false,
    },
  });

  const watchedName = watch('name');
  const watchedDescription = watch('description');

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await roomService.createRoom(data);

      if (response.success) {
        onRoomCreated(response.data.room);
      } else {
        setError(response.error?.message || 'Failed to create room');
      }
    } catch (error) {
      setError('An error occurred while creating the room');
      console.error('Create room error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Create New Room
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Room Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Room Name *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              placeholder="Enter room name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {watchedName?.length || 0}/50 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              id="description"
              placeholder="Enter room description"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {watchedDescription?.length || 0}/200 characters
            </p>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center space-x-2">
            <input
              {...register('isPrivate')}
              type="checkbox"
              id="isPrivate"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-700">
              Make this room private
            </label>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Private rooms require invitation to join
          </p>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Room'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
