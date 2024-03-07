import "./styles/SerachBar.css";

const SearchBar = ({ handleSearchCity, setCityName }) => {
  return (
    <>
      <article className="box__input__city">
        <input
          className="input__city"
          type="text"
          placeholder="Ciudad"
          onChange={(e) => setCityName(e.target.value)}
        />
        <span>
          <button className="btn__search__city" onClick={handleSearchCity}>
            Buscar
          </button>
        </span>
      </article>
    </>
  );
};
export default SearchBar;
