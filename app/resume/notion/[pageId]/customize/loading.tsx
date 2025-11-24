export default function CustomizeLoading() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    </div>
  )
}
