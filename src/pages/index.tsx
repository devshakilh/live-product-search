import SearchBox from '@/components/SearchBox';

export default function Home() {
  return (
    <div className="min-h-screen   bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl  font-bold mb-4">Live Product Search</h1>
        <SearchBox />
      </div>
    </div>
  );
}