import { ConnectButton } from "~/components/ConnectButton"
import { AppSwitcher } from "~/components/AppSwitcher"

export const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="bg-slate-50">
      <div className="absolute sm:right-10 sm:top-8 top-5 right-6 z-10 flex items-center space-x-6">
        <AppSwitcher />
        <ConnectButton />
      </div>
      {children}
    </div>
  )
}
