import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

import Header from "./component/Header";
import Footer from "./component/Footer";
import PreviewLayer from "./component/PreviewLayer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movies/:movieId" element={<PreviewLayer />}></Route>
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path="tvs/:tvId" element={<PreviewLayer />}></Route>
        </Route>
        <Route path="/search" element={<Search />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
