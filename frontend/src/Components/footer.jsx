export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-700 py-6">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-2">© {new Date().getFullYear()} Hostel Facilitator. All Rights Reserved.</p>
        <p className="text-sm">Designed for students, job holders & hostel owners in Islamabad.</p>
      </div>
    </footer>
  );
}
