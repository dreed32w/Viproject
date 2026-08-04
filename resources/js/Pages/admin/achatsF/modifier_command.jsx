import { useForm, usePage, Link } from "@inertiajs/react";

export default function ModifierCommand() {

    const { username, command, details, categories } = usePage().props;

    const { data, setData, post } = useForm({
        id: command.id,
        supplier_id: command.supplier_id,
        products: details,
    });

    function logout(e) {
        e.preventDefault();
        post("/logout");
    }

    function changeValue(index, key, value) {
        const list = [...data.products];
        list[index] = {
            ...list[index],
            [key]: value,
        };

        setData("products", list);
    }

    function addProduct() {
        setData("products", [
            ...data.products,
            {
                name: "",
                brand: "",
                model: "",
                category_id: "",
                quantity: 1,
                price: 0,
            },
        ]);
    }

    function removeProduct(index) {
        setData(
            "products",
            data.products.filter((_, i) => i !== index)
        );
    }

    function save(e) {
        e.preventDefault();
        post("/command/edit/save");
    }

    return (
        <div className="login-box">

            <div className="profil-1">

                <h1>Bonjour Mr {username}</h1>

                <ul className="navigation">
                    <li><Link href="/">Main</Link></li>
                    <li><Link href="/achats" className="active-link">Achats</Link></li>
                    <li><Link href="/affectations">Affectations</Link></li>
                    <li><Link href="/achats/products">Products</Link></li>
                    <li><Link href="/employers">Employés</Link></li>
                    <li><Link href="/incidents">Incidents</Link></li>
                    <li><Link href="/change-password">Mot de passe</Link></li>
                </ul>

                <form onSubmit={logout}>
                    <button className="btn-logout">Logout</button>
                </form>

            </div>

            <div className="dashboard">

                <h1>Modifier la commande</h1>

                <form onSubmit={save}>

                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Catégorie</th>
                                    <th>Quantité</th>
                                    <th>Prix unitaire</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.products.map((product, index) => (

                                    <tr key={index}>

                                        <td>
                                            <input type="text" value={product.name} onChange={(e) => changeValue(index, "name", e.target.value)} />
                                        </td>

                                        <td>
                                            <input type="text" value={product.brand} onChange={(e) => changeValue(index, "brand", e.target.value)} />
                                        </td>

                                        <td>
                                            <input type="text" value={product.model} onChange={(e) => changeValue(index, "model", e.target.value)} />
                                        </td>

                                        <td>
                                            <select value={product.category_id} onChange={(e) => changeValue(index, "category_id", e.target.value)}>
                                                <option value="">Choisir...</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={product.quantity}
                                                onChange={(e) =>
                                                    changeValue(index, "quantity", e.target.value)
                                                }
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={product.price}
                                                onChange={(e) =>
                                                    changeValue(index, "price", e.target.value)
                                                }
                                            />
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="off"
                                                onClick={() => removeProduct(index)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>

                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>

                    <br />

                    <button type="button" className="btn-login" onClick={addProduct} >
                        Ajouter un produit
                    </button>

                    <button className="btn-login">
                        Enregistrer
                    </button>
                    <Link href="/achats/commands" className="btn-login" > Retour </Link>
                </form>
            </div>
        </div>
    );
}