export default function ErrorPage({message}: {message: string}) {
  return (
    <>
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-center">{message}</p>
      </div>
    </>
  );
}
