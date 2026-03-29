export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>id: {id}</div>;
}

export function generateStaticParams() {
  return [{ id: 'foo' }, { id: 'bar' }];
}
