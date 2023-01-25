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
      <div className="sm:w-[800px] w-full text-sm sm:rounded text-gray-700 py-6 px-8">
        {title && <div className="font-medium text-xl mb-4 -mt-1">{title}</div>}
        <div>{children}</div>
      </div>
    </Element>
  )
}
