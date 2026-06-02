export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <div className="page-kicker">Operations Studio</div>
        <h1 className="page-title mt-3">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted md:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}
