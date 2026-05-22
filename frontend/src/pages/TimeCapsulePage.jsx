import { MainLayout, Card, Button } from '../components';

export default function TimeCapsulePage() {
  return (
    <MainLayout title="Time Capsule">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-center p-8">
            <p className="text-4xl mb-4">📦</p>
            <h2 className="text-xl font-bold text-primary-dark mb-2">Create New Capsule</h2>
            <p className="text-gray-600 mb-4">
              Tulis surat, simpan memory, atau catat wisdom untuk dibuka di masa depan
            </p>
            <Button variant="primary">Create Capsule</Button>
          </div>
        </Card>

        <Card>
          <div className="text-center p-8">
            <p className="text-4xl mb-4">🔓</p>
            <h2 className="text-xl font-bold text-primary-dark mb-2">My Capsules</h2>
            <p className="text-gray-600 mb-4">
              Kelola capsule yang sudah dibuat dan lihat yang sudah bisa dibuka
            </p>
            <Button variant="secondary">View All</Button>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-xl font-bold text-primary-dark mb-4">📜 Capsule Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-2xl mb-2">💌</p>
            <p className="font-semibold">Letter</p>
            <p className="text-xs text-gray-600 mt-1">Surat untuk diri sendiri</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-2xl mb-2">🎬</p>
            <p className="font-semibold">Memory</p>
            <p className="text-xs text-gray-600 mt-1">Kenang-kenangan indah</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-2xl mb-2">💎</p>
            <p className="font-semibold">Wisdom</p>
            <p className="text-xs text-gray-600 mt-1">Pelajaran yang dipetik</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <p className="text-2xl mb-2">🙏</p>
            <p className="font-semibold">Gratitude</p>
            <p className="text-xs text-gray-600 mt-1">Hal-hal yang disyukuri</p>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}
