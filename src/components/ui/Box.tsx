export const Box = ({
  title,
  children,
}: {
  title: string
  children: JSX.Element
}) => {
  return (
    <>
      <div className="sm:w-[800px] w-full text-sm relative sm:rounded-3xl text-gray-700 border-2 border-gray-100 backdrop-blur-md py-6 px-8">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br bg-white opacity-80 sm:rounded-3xl"></div>
        <div className="relative font-medium text-xl mb-4">{title}</div>
        <div className="relative">{children}</div>
      </div>
    </>
  )
}
