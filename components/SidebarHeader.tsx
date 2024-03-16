import { SiOpenaigym } from "react-icons/si";
import ThemeToggle from "./ThemeToggle";
import MainLogo from "./MainLogo";
const SidebarHeader = () => {
  return (
    <div className="flex items-center mb-4 gap-4 px-4">
      {/* <SiOpenaigym className="w-10 h-10 text-primary" /> */}
      <div className="w-10 h-10 max-w-10 text-primary">
        <MainLogo />
      </div>
      <h2 className="text-m font-extrabold text-primary mr-auto">
        WanderlustGPT
      </h2>
      <ThemeToggle />
    </div>
  );
};
export default SidebarHeader;
