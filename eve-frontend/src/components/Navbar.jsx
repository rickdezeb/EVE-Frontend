import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const isProduct = location.pathname === "/productpage" || location.pathname === '/editpage';
    const isEdit = location.pathname === '/editpage';

    const state = location.state || {};
    const file = state.file;

    return (
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-primary box-shadow mb-3">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between align-items-center">
                    <nav aria-label="breadcrumb" className="d-flex">
                        <ol className="breadcrumb bg-primary text-white mb-0">
                            <li className="breadcrumb-item">
                                <NavLink to="/" style={{ color: 'white' }}>
                                    <FontAwesomeIcon icon={faHome} /> Home
                                </NavLink>
                            </li>
                            {isProduct && (
                                <li className="breadcrumb-item">
                                    <NavLink
                                        to="/productpage"
                                        state={file ? { file } : {}}
                                        style={{ color: 'white' }}
                                    >
                                        Product
                                    </NavLink>
                                </li>
                            )}
                            {isEdit && (
                                <li className="breadcrumb-item">
                                    <NavLink to="/editpage" state={state} style={{ color: 'white' }}>
                                        Edit
                                    </NavLink>
                                </li>
                            )}
                        </ol>
                    </nav>

                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <span className="nav-link text-white">Welcome!</span>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
