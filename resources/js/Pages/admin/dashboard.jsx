import { useForm, usePage, Link } from "@inertiajs/react";

export default function Dashboard() {

    const { info, username } = usePage().props;

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
                    <li><Link href="/" className="active-link">Main</Link></li>
                    <li><Link href="/achats">Achats</Link></li>
                    <li><Link href="/affectations">Affectations</Link></li>
                    <li><Link href="/employers">Employés</Link></li>
                    <li><Link href="/incidents">Incidents</Link></li>
                    <li><Link href="/change-password">Mot de passe</Link></li>
                </ul>
                <form onSubmit={logout}>
                    <button className="btn-logout">Logout</button>
                </form>

            </div>

            <div className="dashboard">

                <div className="toolbar">
                    <h1>Bonjour Mr {username}, bienvenue</h1>
                </div>

                <div className="cards">

                    <div className="card">
                        <h3>Total produict</h3>
                        <p className="number">{info.serials}</p>
                    </div>

                    <div className="card">
                        <h3>produict Disponibles</h3>
                        <p className="number">{info.available_serials}</p>
                    </div>

                    <div className="card">
                        <h3>product Attribués</h3>
                        <p className="number">{info.assigned_serials}</p>
                    </div>

                    <div className="card">
                        <h3>Hors Service</h3>
                        <p className="number">{info.hors_service_serials}</p>
                    </div>

                    <div className="card">
                        <h3>Employés</h3>
                        <p className="number">{info.employers}</p>
                    </div>

                    <div className="card">
                        <h3>Fournisseurs</h3>
                        <p className="number">{info.suppliers}</p>
                    </div>

                    <div className="card">
                        <h3>Catégories</h3>
                        <p className="number">{info.categories}</p>
                    </div>

                    <div className="card">
                        <h3>Product types</h3>
                        <p className="number">{info.products}</p>
                    </div>

                    <div className="card">
                        <h3>Commandes en attente</h3>
                        <p className="number">{info.pending_commands}</p>
                    </div>

                    <div className="card">
                        <h3>Commandes approuvées</h3>
                        <p className="number">{info.approved_commands}</p>
                    </div>

                    <div className="card">
                        <h3>Commandes rejetées</h3>
                        <p className="number">{info.rejected_commands}</p>
                    </div>

                    <div className="card">
                        <h3>Incidents en attente</h3>
                        <p className="number">{info.pending_incidents}</p>
                    </div>

                    <div className="card">
                        <h3>Incidents en réparation</h3>
                        <p className="number">{info.repairing_incidents}</p>
                    </div>

                    <div className="card">
                        <h3>Incidents résolus</h3>
                        <p className="number">{info.solved_incidents}</p>
                    </div>

                </div>

            </div>

        </div>
    );
}
