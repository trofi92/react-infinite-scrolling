import { useEffect, useState } from "react";
import axios from "axios";

export default function useSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    return () => {
      setRestaurants([]);
    };
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios
      .get(
        "https://bananaplate-clone-default-rtdb.firebaseio.com/data/all.json",
        {
          params: { q: query, page: pageNumber },
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        }
      )
      .then((res) => {
        setRestaurants((prevRestaurants) => {
          return [
            ...new Set([
              ...prevRestaurants,
              ...res.data.data.map((x) => x.BZ_NM),
            ]),
          ];
        });
        setHasMore(res.data.data.length > 0);
        setLoading(false);
        // console.log(res.data.data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { restaurants, hasMore, loading, error };
}

// axios({
//   method: "GET",
//   url: "http://openlibrary.org/search.json",
//   params: { q: query, page: pageNumber },
//   cancelToken: new axios.CancelToken((c) => (cancel = c)),
// })
//   .then((res) => {
//     console.log(res.data);
//   })
//   .catch((e) => {
//     if (axios.isCancel(e)) return;
//   });
// return () => cancel();
