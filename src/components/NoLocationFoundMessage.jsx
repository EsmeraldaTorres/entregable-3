import "./styles/WeatherCard.css";

const NoLocationFoundMessage = () => {
  return (
    <>
      <article className="no__info__message">
        Parece que no hay información de esta ciudad. Intenta escribiendo
        correctamente el nombre de una ciudad para mostrar su información de
        clima
        <div className="no__info__message__loader"></div>
      </article>
    </>
  );
};

export default NoLocationFoundMessage;
