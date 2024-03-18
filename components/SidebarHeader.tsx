import { SiOpenaigym } from "react-icons/si";
import ThemeToggle from "./ThemeToggle";
import MainLogo from "./MainLogo";
const SidebarHeader = () => {
  return (
    <div className="flex items-center mb-4 gap-4 px-4">
      {/* <SiOpenaigym className="w-10 h-10 text-primary" /> */}
      <div className="w-10 h-10 max-w-10 text-primary">
        <div className="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-transparent text-primary text-gray-950">
          <div className="h-9 w-9">
            <MainLogo />
          </div>
        </div>
      </div>
      <h2 className="text-m font-extrabold text-primary mr-auto">
        WanderlustGPT
      </h2>
      <ThemeToggle />
    </div>
  );
};
export default SidebarHeader;
