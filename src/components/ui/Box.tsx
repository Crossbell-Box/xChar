import { Element } from "react-scroll"
import { UniLink } from "~/components/ui/UniLink"
import { ChevronRightIcon } from "@heroicons/react/20/solid"

export const Box = ({
  title,
  details,
  children,
  titleClassName,
}: {
  title: string
  details?: string
  children: JSX.Element
  titleClassName?: string
}) => {
  return (
    <Element name={title}>
      <div className="sm:w-[800px] w-full text-sm text-gray-700 py-5 px-8">
        {title && (
          <div className="font-medium mb-4 -mt-1 flex justify-between items-center">
            <span className={`text-xl ${titleClassName}`}>{title}</span>
            {details && (
              <UniLink
                href={details}
                className="flex items-center border rounded pl-2 pr-1 hover:text-accent transition-colors"
              >
                <span className="align-middle">More </span>
                <ChevronRightIcon className="w-4 h-4 inline-block align-middle" />
              </UniLink>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </Element>
  )
}
