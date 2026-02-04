import { User } from 'lucide-react';

interface OwnerInfoProps {
  owner: {
    name: string | null;
    avatarUrl: string | null;
  };
}

export default function OwnerInfo({ owner }: OwnerInfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-800 mb-3">Anunciante</h3>
      <div className="flex items-center gap-3">
        {owner.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={owner.avatarUrl}
            alt={owner.name || 'Proprietario'}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <User size={24} className="text-primary-600" />
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">
            {owner.name || 'Proprietario'}
          </p>
          <p className="text-xs text-gray-400">Anuncio proprio</p>
        </div>
      </div>
    </div>
  );
}
