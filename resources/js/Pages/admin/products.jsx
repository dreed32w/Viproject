import { useForm, usePage, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Products() {

    const { username, products, flash } = usePage().props;

    const [showFen, setShowFen] = useState(true);

    const { setData, post, errors } = useForm({
        id: "",
    });

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    function logout(e) {
        e.preventDefault();
        post("/logout");
    }

    const categories = [...new Set(products.map(product => product.category))];

    const filteredProducts = products.filter((product) => {

        const searchOk =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.brand.toLowerCase().includes(search.toLowerCase()) ||
            product.model.toLowerCase().includes(search.toLowerCase());

        const categoryOk =
            category === "" ||
            product.category === category;

        return searchOk && categoryOk;

    });

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
                    <button className="btn-logout">Logout</button>
                </form>

            </div>

            <div className="dashboard">

                <h1>Tous les produits</h1>
                <Link href="/product/add" className="btn-login">Ajouter un produit</Link>
                <div className="filters-bar">

                    <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />

                    <select value={category} onChange={(e) => setCategory(e.target.value)} >
                        <option value="">Toutes les catégories</option>

                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {flash.success && showFen && (
                    <div className="sous-fen">
                        <p style={{ color: "var(--success-text)" }}>{flash.success}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>&times;</button>
                    </div>
                )}

                {errors.used && showFen && (
                    <div className="sous-fen">
                        <p className="error-text">{errors.used}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>&times;</button>
                    </div>
                )}

                {
                    filteredProducts.length > 0 ?
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Brand</th>
                                        <th>Model</th>
                                        <th>Catégorie</th>
                                        <th>Quantité</th>
                                        <th>Disponible</th>
                                        <th>Attribué</th>
                                        <th>Hors service</th>
                                        <th>Modifier</th>
                                        <th>Supprimer</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {

                                        filteredProducts.map((product) => (

                                            <tr key={product.id}>

                                                <td>{product.name}</td>
                                                <td>{product.brand}</td>
                                                <td>{product.model}</td>
                                                <td>{product.category}</td>
                                                <td>{product.quantity}</td>
                                                <td>{product.available}</td>
                                                <td>{product.assigned}</td>                                                
                                                <td>{product.hors_service}</td>

                                                <td>
                                                    <Link href={`/product/edit/${product.id}`} className="btn-modifier">
                                                        Modifier
                                                    </Link>
                                                </td>
                                                <td>
                                                    <button onClick={() => { if (confirm("Supprimer ce produit ?")) { setData("id", product.id); post("/product/delete"); } }} >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        :

                        <p className="empty-state">
                            Aucun produit trouvé.
                        </p>

                }

            </div>

        </div>

    );

}
