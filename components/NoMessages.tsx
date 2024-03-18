import MainLogo from "./MainLogo";

const NoMessages = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-token-text-primary">
      <div className="relative">
        <div className="mb-3 h-12 w-12">
          <div className="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-transparent text-gray-950 text-primary">
            <div className="h-9 w-9">
              <MainLogo />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5 text-2xl font-medium">How can I help you today?</div>
    </div>
  );
};
export default NoMessages;
