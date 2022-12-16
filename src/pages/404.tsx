import { Image } from "~/components/ui/Image"
import Tilt from "react-parallax-tilt"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import { UniLink } from "~/components/ui/UniLink"

dayjs.extend(duration)
dayjs.extend(relativeTime)

export default function HandlePage() {
  return (
    <div className="relative flex flex-col items-center min-h-screen py-20">
      <div className="fixed left-1/2 -translate-x-1/2 top-8 sm:w-[1000px] w-full h-[272px]">
        <Image
          alt="xChar"
          src="/logos/xchar.svg"
          width={1000}
          height={272}
          priority
        />
      </div>
      <div className="space-y-5">
        <Tilt
          className="sm:w-[800px] w-full mx-auto relative p-8 sm:rounded-3xl text-gray-600 border-2 border-gray-50 overflow-hidden backdrop-blur-md"
          glareEnable={true}
          glareMaxOpacity={0.2}
          glareColor="#fff"
          glarePosition="all"
          glareBorderRadius="12px"
          tiltMaxAngleX={5}
          tiltMaxAngleY={5}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-gray-200 opacity-80"></div>
          <div className="relative text-center">
            <Image alt="404" width={416} height={416} src="/404.svg" />
            <p>
              This handle is not yet registered,{" "}
              <UniLink href="/" className="underline">
                go back to the home page
              </UniLink>{" "}
              and try others
            </p>
          </div>
        </Tilt>
      </div>
    </div>
  )
}
