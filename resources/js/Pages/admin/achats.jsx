import { useForm, usePage, Link } from "@inertiajs/react";

export default function Achat() {

    const { username } = usePage().props;

    const { post } = useForm({});

    function logout(e) {
        e.preventDefault();
        post("/logout");
    }

    return (
        <div className="login-box">

            <div className="profil-1">

                <h1>Bonjour Mr {username}</h1>

                <ul className="navigation">
                    <li><Link href="/">Main</Link></li>
                    <li><Link href="/achats" className="active-link">Achats</Link></li>
                    <li><Link href="/affectations">Affectations</Link></li>
                    <li><Link href="/employers">Employés</Link></li>
                    <li><Link href="/incidents">Incidents</Link></li>
                    <li><Link href="/change-password">Mot de passe</Link></li>
                </ul>

                <form onSubmit={logout}>
                    <button className="btn-logout">
                        Logout
                    </button>
                </form>

            </div>

            <div className="dashboard">

                <h1>Page d'achat</h1>

                <div className="cards">

                    <Link href="/achats/commands" className="card">
                        <h3>Commands</h3>
                        <p className="number">Voir</p>
                    </Link>

                    <Link href="/achats/products" className="card">
                        <h3>Products</h3>
                        <p className="number">Voir</p>
                    </Link>

                    <Link href="/achats/categories" className="card">
                        <h3>Categories</h3>
                        <p className="number">Voir</p>
                    </Link>

                    <Link href="/achats/suppliers" className="card">
                        <h3>Fournisseurs</h3>
                        <p className="number">Voir</p>
                    </Link>

                </div>

            </div>

        </div>
    );
}