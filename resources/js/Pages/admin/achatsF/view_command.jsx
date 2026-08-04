import { useForm, usePage, Link } from "@inertiajs/react";

export default function ViewCommand() {

    const { username, command, details } = usePage().props;

    const { post } = useForm({});

    function logout(e){
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

                <h1>Détails de la commande</h1>

                <div className="filters-bar">
                    <span>
                        N° de commande :
                        <strong> {command.number_command || "-"}</strong>
                    </span>

                    <span>
                        Fournisseur :
                        <strong> {command.fornisseur?.company_name}</strong>
                    </span>

                    <span>
                        Date :
                        <strong> {command.date || "-"}</strong>
                    </span>

                    <span>
                        Status :
                        <strong> {command.status}</strong>
                    </span>

                    <span>
                        Nombre de produits :
                        <strong> {details.length}</strong>
                    </span>
                </div>

                {details.length > 0 &&
                    <div className="table-wrap">
                        <table>

                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Catégorie</th>
                                    <th>Prix unitaire</th>
                                    <th>Quantité</th>
                                </tr>
                            </thead>

                            <tbody>

                                {details.map((detail) => (

                                    <tr key={detail.id}>
                                        <td>{detail.name}</td>
                                        <td>{detail.brand}</td>
                                        <td>{detail.model}</td>
                                        <td>{detail.category_id}</td>
                                        <td>{detail.price}</td>
                                        <td>{detail.quantity}</td>
                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>
                }
                <Link href="/achats/commands" className="btn-login">Back</Link>

            </div>

        </div>
    );
}