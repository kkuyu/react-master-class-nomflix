import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

import Header from "./component/Header";
import Movies from "./component/Movies";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movies/:movieId" element={<Movies />}></Route>
        </Route>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
