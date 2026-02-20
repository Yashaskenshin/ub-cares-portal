export default function Header() {
  return (
    <header className="gradient-header text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🍺</div>
            <div>
              <h1 className="text-3xl font-bold">UB Cares Hub</h1>
              <p className="text-sm text-blue-100">Quality Complaint Management System</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-blue-100">Central Knowledge Repository</p>
            <p className="font-semibold">All Data in One Place</p>
          </div>
        </div>
      </div>
    </header>
  )
}

