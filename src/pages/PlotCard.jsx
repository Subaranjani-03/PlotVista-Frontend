import "./PlotCard.css";

const PlotCard = ({
  plot,
  mode = "admin",
  onEdit,
  onDelete,
  onBook,
  onMore,
}) => {

  const statusClass = (plot.status || "Available").toLowerCase();

  return (
    <div className="plot-card">

      {/* SIDE BAR */}

      <div className="side-accent">

        <span className="side-id">
          {plot.plotId}
        </span>

        <span className={`side-status ${statusClass}`}>
          <i className="dot"></i>
          {plot.status || "Available"}
        </span>

      </div>

      <div className="card-main">

        {/* IMAGE */}

        <div className="img-wrap">

          <img
            src={
              plot.plotImage ||
              "https://t3.ftcdn.net/jpg/05/04/28/96/360_F_504289605_zehJiK0tCuZLP2MdfFBpcJdOVxKLnXg1.jpg"
            }
            alt={plot.name}
          />

          <div className="img-shade"></div>

          <div className="facing-badge">
            <span className="facing-arrow">↑</span>
            {plot.facing || "North"} Facing
          </div>

          <div className="zone-badge">
            {plot.zone || "Zone A"}
          </div>

        </div>

        {/* HEADER */}

        <div className="card-head">

          <h3 className="plot-title">
            {plot.name}
          </h3>

          <p className="plot-loc">
            <span className="pin">◉</span>
            {plot.location || plot.city || "Chennai"}
          </p>

        </div>

        {/* DETAILS */}

        <div className="divider">
          <span></span>
          <em>DETAILS</em>
          <span></span>
        </div>

        <div className="meta-row">

          <div className="meta-item">
            <span className="meta-label">Area</span>
            <p className="meta-val">{plot.area}</p>
          </div>

          <div className="meta-divider"></div>

          <div className="meta-item">
            <span className="meta-label">Survey</span>
            <p className="meta-val">{plot.survey}</p>
          </div>

          <div className="meta-divider"></div>

          <div className="meta-item">
            <span className="meta-label">Type</span>
            <p className="meta-val">
              {plot.type || "Residential"}
            </p>
          </div>

        </div>

        {/* PRICE */}

        <div className="price-block">

          <div className="price-left">
            <span className="price-label">
              Total Price
            </span>

            <h2 className="price-val">
              ₹ {plot.price}
            </h2>
          </div>

          <div className="price-right">

            <span className="psqft-label">
              per sq.ft
            </span>

            <p className="psqft-val">
              {plot.pricePerSqft || "—"}
            </p>

          </div>

        </div>

        {/* ACTIONS */}

        {mode !== "assigned" && (

          <div className="actions">

            {/* VIEW MODE */}

            {mode === "view" && (
              <>
                <button
                  className="btn-book"
                  onClick={onBook}
                >
                  <i className="fa-solid fa-thumbtack"></i>
                </button>

                <button
                  className="btn-more"
                  onClick={onMore}
                >
                  <i className="fa-solid fa-circle-info"></i>
                </button>
              </>
            )}

            {/* MANAGE MODE */}

            {mode === "manage" && (
              <>
                <button
                  className="btn-edit"
                  onClick={onEdit}
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>

                <button
                  className="btn-delete"
                  onClick={onDelete}
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </>
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default PlotCard;