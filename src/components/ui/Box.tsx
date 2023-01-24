import { Element } from "react-scroll"

export const Box = ({
  title,
  children,
}: {
  title: string
  children: JSX.Element
}) => {
  return (
    <Element name={title}>
      <div className="sm:w-[800px] w-full text-sm relative sm:rounded text-gray-700 backdrop-blur-md py-6 px-8">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br bg-white opacity-80 sm:rounded-2xl"></div>
        {title && (
          <div className="relative font-medium text-xl mb-4 -mt-1">{title}</div>
        )}
        <div className="relative">{children}</div>
      </div>
    </Element>
  )
}
