import Header from "../../components/Header/Header.js";
import "./Home.css";
import MapTool from "../../components/map/MapTool.js";

const Home = () => {

  return (
    <div>
      <Header />
      <MapTool classNameMap={"homeMap"} />
    </div>
  );
};

export default Home;
