const SIZES = { md: "max-w-md", xl: "max-w-7xl" };
export default function Modal({ title, children, footer, onBackdropClick,size = "md"}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center 
        justify-center bg-black/50 p-4" onClick={onBackdropClick}>
      <div className={`w-full max-h-[90vh] ${SIZES[size]} 
        rounded-xl overflow-y-auto
        bg-white p-6 text-gray-900`}
        onClick={e => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
        {children}
        <div className="mt-6 flex justify-end gap-2">{footer}</div>
      </div>
    </div>
  );
}
