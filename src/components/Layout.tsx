import { ConnectButton } from "~/components/ConnectButton"
import { AppSwitcher } from "~/components/AppSwitcher"

export const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <div className="absolute sm:right-10 sm:top-8 top-5 right-6 z-20 flex items-center sm:space-x-6 space-x-4">
        <AppSwitcher />
        <ConnectButton />
      </div>
      {children}
    </>
  )
}
