export default function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container-lowest rounded-2xl border-2 border-dashed border-surface-container-high">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-outline">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="font-headline-sm text-on-surface mb-2">{title}</h3>
      <p className="font-body-md text-on-surface-variant max-w-sm">
        {description}
      </p>
    </div>
  );
}
