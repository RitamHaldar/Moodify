import '../Styles/Loading.scss';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loader">
        <div className="loader__pulse" />
        <div className="loader__ring" />
      </div>
      <h2 className="loading-text">Finding your rhythm...</h2>
      <div className="brand-dot">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default Loading;
