import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen">
      <iframe
        src="/fleet-battle.html"
        title="Fleet Battle - Ultimate Commander"
        style={{ width: "100vw", height: "100vh", border: "none", display: "block" }}
      />
      <Button
        onClick={() => navigate("/citadel")}
        className="absolute top-4 right-4 z-50"
        variant="default"
      >
        Multiplayer
      </Button>
    </div>
  );
};

export default Index;
