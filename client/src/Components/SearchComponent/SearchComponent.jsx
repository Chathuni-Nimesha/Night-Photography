import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../../Config/Debounce";
import { optimizedMediaUrl } from "../../Config/media";
import { searchUserAction } from "../../Redux/User/Action";
import { SEARCH_USER } from "../../Redux/User/ActionType";
import "./SearchComponent.css";
import SearchUserCard from "./SearchUserCard";

const SearchComponent = ({ setIsSearchVisible }) => {
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);

  const runSearch = useMemo(
    () =>
      debounce((value) => {
        const trimmed = value.trim();
        if (!trimmed) {
          dispatch({ type: SEARCH_USER, payload: [] });
          setPending(false);
          return;
        }
        Promise.resolve(dispatch(searchUserAction({ jwt: token, query: trimmed }))).finally(() => {
          setPending(false);
        });
      }, 400),
    [dispatch, token]
  );

  const results = Array.isArray(user.searchResult) ? user.searchResult : [];
  const trimmed = query.trim();
  const searching = Boolean(trimmed) && (pending || user.searchLoading);

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Search</h2>
        {setIsSearchVisible && (
          <button type="button" className="nl-link" onClick={() => setIsSearchVisible(false)}>
            Close
          </button>
        )}
      </div>
      <label htmlFor="photographer-search" className="nl-label">
        Photographers
      </label>
      <input
        id="photographer-search"
        value={query}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setPending(Boolean(next.trim()));
          runSearch(next);
        }}
        className="search-input"
        type="search"
        placeholder="Search by name or username"
        autoComplete="off"
      />

      <div className="search-results">
        {!trimmed && (
          <div className="nl-empty search-empty">
            <h2>Find photographers</h2>
            <p>Search by name or username. Results appear only from people already on Nightlife.</p>
          </div>
        )}

        {searching && (
          <div aria-busy="true" aria-label="Searching photographers">
            <div className="nl-skeleton" style={{ height: "3.25rem", marginBottom: "0.5rem" }} />
            <div className="nl-skeleton" style={{ height: "3.25rem", marginBottom: "0.5rem" }} />
            <div className="nl-skeleton" style={{ height: "3.25rem" }} />
          </div>
        )}

        {trimmed && user.searchError && !user.searchLoading && (
          <div className="nl-empty search-empty">
            <h2>Search could not finish.</h2>
            <p>Try again in a moment.</p>
            <div className="nl-empty-actions">
              <button
                type="button"
                className="nl-btn-primary"
                onClick={() => dispatch(searchUserAction({ jwt: token, query: trimmed }))}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {trimmed && !user.searchLoading && !user.searchError && results.length === 0 && (
          <div className="nl-empty search-empty">
            <h2>No photographers match.</h2>
            <p>Nothing in Nightlife matches that name or username.</p>
          </div>
        )}

        {trimmed && !user.searchLoading && !user.searchError && results.length > 0 && (
          <ul className="search-list">
            {results.map((item) => (
              <li key={item.id}>
                <SearchUserCard
                  setIsSearchVisible={setIsSearchVisible}
                  username={item.username}
                  image={optimizedMediaUrl(item?.image, { width: 96 })}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
