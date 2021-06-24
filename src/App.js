import React, { useRef, useState, useCallback } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const elementObserved = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
      // console.log(node);
    },
    [hasMore, loading]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <section className="App">
      <h2>Infinite scroll with intersection observer</h2>
      <input
        placeholder="Search a book title"
        type="text"
        value={query}
        onChange={handleSearch}
      />
      {books.map((book, idx) => {
        if (books.length === idx + 1) {
          return (
            <div ref={elementObserved} key={idx}>
              {book}
            </div>
          );
        } else {
          return <div key={idx}>{book}</div>;
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </section>
  );
}

export default App;
