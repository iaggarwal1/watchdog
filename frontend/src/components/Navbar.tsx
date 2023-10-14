const Navbar = () => {
  return (
    <>
      <nav className="navbar bg-dark navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">
            WATCHDOG
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link text-white" aria-current="page" href="#">
                  MAP
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  REPORTS
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
