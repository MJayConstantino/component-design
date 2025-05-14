import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gray-200 w-screen h-screen flex justify-center items-center">
      <div className="mt-4">
        <Link to="/act1">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
            Act 1 Page
          </button>
        </Link>
        <Link to="/prelims">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
            Prelims Page
          </button>
        </Link>
        <Link to="/act3">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
            Act 3 Page
          </button>
        </Link>
        <Link to="/midterms">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
            Midterms Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
