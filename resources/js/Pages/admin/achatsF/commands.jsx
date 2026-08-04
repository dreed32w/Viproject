import { useForm, usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import StatusBadge from "@/Components/StatusBadge";

export default function Commands() {

    const [showFen, setShowFen] = useState(true);

    const { username, commands, flash } = usePage().props;

    const { post, setData, errors } = useForm({
        id: "",
    });

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const commandsFiltered = commands.filter((c) => {
        const matchSearch = c.supplier_name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "" || c.status === statusFilter;

        return matchSearch && matchStatus;
    });

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

                <div className="toolbar">
                    <h1>Toutes les commandes</h1>

                    <Link href="/achats/addCommand"className="btn-login">Ajouter une commande</Link>
                </div>
                <div className="filters-bar">
                    <input type="text" placeholder="Rechercher par fournisseur..." value={search} onChange={(e) => setSearch(e.target.value)} />

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} >
                        <option value="">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="approved">Approuvée</option>
                        <option value="rejected">Rejetée</option>
                    </select>

                </div>

                {flash.success && showFen && (
                    <div className="sous-fen">
                        <p style={{ color: "var(--success-text)" }}>{flash.success}</p>

                        <button
                            className="close-btn"
                            onClick={() => setShowFen(false)}
                        >&times;</button>
                    </div>
                )}

                {flash.modifier_success && showFen && (
                    <div className="sous-fen">
                        <p style={{ color: "var(--success-text)" }}>
                            {flash.modifier_success}
                        </p>

                        <button
                            className="close-btn"
                            onClick={() => setShowFen(false)}
                        >&times;</button>
                    </div>
                )}

                {errors.approved && showFen && (
                    <div className="sous-fen">
                        <p style={{ color: "var(--danger-text)" }}>
                            {errors.approved}
                        </p>

                        <button
                            className="close-btn"
                            onClick={() => setShowFen(false)}
                        >&times; </button>
                    </div>
                )}
                {commandsFiltered.length > 0 ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Fornisseur</th>
                                    <th>Numéro de commande</th>
                                    <th>Products</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Voir</th>
                                    <th>Réception</th>
                                    <th>Modifier</th>
                                    <th>Supprimer</th>
                                </tr>

                            </thead>

                            <tbody>

                                {commandsFiltered.map((command) => (

                                    <tr key={command.id}>

                                        <td>{command.id}</td>

                                        <td>{command.supplier_name}</td>
                                        <td>{command.number_command}</td>
                                        <td>{command.products_count}</td>

                                        <td>{command.date}</td>

                                        <td>
                                            <StatusBadge status={command.status} />
                                        </td>

                                        <td>
                                            <Link href={`/command/view/${command.id}`}className="btn-modifier">voir</Link>
                                        </td>

                                        {command.status === "pending" ? (

                                            <td>
                                                <button
                                                    className="btn-success"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "La commande a-t-elle été reçue ?"
                                                            )
                                                        ) {
                                                            setData("id", command.id);
                                                            post("/command/receive");
                                                        }
                                                    }}
                                                >Reçu</button>
                                            </td>

                                        ) : (

                                            <td><span style={{ color: "var(--success-text)", }}>Commande reçue</span></td>
                                        )}
                                        <td>
                                            <button
                                                className="btn-modifier"
                                                onClick={() => {
                                                    setData("id", command.id);
                                                    post("/command/edit");
                                                }}
                                            >Modifier</button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Supprimer cette commande ?"
                                                        )
                                                    ) {
                                                        setData("id", command.id);
                                                        post("/command/delete");
                                                    }
                                                }}
                                            >Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                ) : (
                    <p className="empty-state">Aucune commande trouvée.</p>
                )}
                <Link href="/achats" className="btn-login">Back</Link>
            </div>
        </div>
    );
}