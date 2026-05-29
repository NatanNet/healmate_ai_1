import MainLayout from '../components/MainLayout';

export default function GoalsPage() {
  return (
    <MainLayout>
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col min-h-[60vh] items-center justify-center text-center">
        <div className="bg-[#E8F6F6] text-[#22B2B0] w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-bullseye text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-[#113C3A] mb-2">Target Pemulihan</h2>
        <p className="text-gray-500 max-w-md">
          Fitur untuk menetapkan dan melacak tujuan pemulihan emosional harianmu sedang dalam tahap pengembangan.
        </p>
      </div>
    </MainLayout>
  );
}