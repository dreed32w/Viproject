import { useForm, usePage, Link } from "@inertiajs/react";

export default function AddCommand() {

    const { username, suppliers, categories, products } = usePage().props;

    const { data, setData, post, errors } = useForm({
        supplier_id: "",
        date: "",
        number_command: "",
        products: [
            {
                mode: "new",
                product_id: "",
                name: "",
                brand: "",
                model: "",
                category_id: "",
                quantity: 1,
                unit_price: "",
            }
        ]
    });

    function logout(e) {
        e.preventDefault();
        post("/logout");
    }

    function changeValue(index, key, value) {
        const list = [...data.products];
        list[index][key] = value;
        setData("products", list);
    }

    function changeMode(index, mode) {
        const list = [...data.products];
        list[index] = {
            mode,
            product_id: "",
            name: "",
            brand: "",
            model: "",
            category_id: "",
            quantity: list[index].quantity || 1,
            unit_price: list[index].unit_price || "",
        };
        setData("products", list);
    }

    function selectExistingProduct(index, productId) {
        const product = products.find((p) => String(p.id) === String(productId));
        const list = [...data.products];
        list[index] = {
            ...list[index],
            product_id: productId,
            name: product ? product.name : "",
            brand: product ? product.brand : "",
            model: product ? product.model : "",
            category_id: product ? product.category_id : "",
        };
        setData("products", list);
    }

    function addProduct() {
        setData("products", [
            ...data.products,
            {
                mode: "new",
                product_id: "",
                name: "",
                brand: "",
                model: "",
                category_id: "",
                quantity: 1,
                unit_price: "",
            }
        ]);
    }

    function removeProduct(index) {
        const list = data.products.filter((_, i) => i !== index);
        setData("products", list);
    }

    function save(e) {
        e.preventDefault();
        post("/command/save");
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
                    <button className="btn-logout">Logout</button>
                </form>
            </div>

            <div className="dashboard">

                <h1>Ajouter une commande</h1>

                <form onSubmit={save}>

                    <label>Fournisseur</label>
                    <select value={data.supplier_id} onChange={(e) => setData("supplier_id", e.target.value)}>
                        <option value="">Choisir...</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.company_name}
                            </option>
                        ))}
                    </select>
                    {errors.supplier_id && <p className="error-text">{errors.supplier_id}</p>}

                    <label>Date</label>
                    <input
                        type="date"
                        value={data.date}
                        onChange={(e) => setData("date", e.target.value)}
                    />

                    <label>Numéro de commande</label>
                    <input
                        type="text"
                        value={data.number_command}
                        onChange={(e) => setData("number_command", e.target.value)}
                    />

                    <br />
                    <br />

                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Produit</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Catégorie</th>
                                    <th>Quantité</th>
                                    <th>Prix unitaire</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.products.map((item, index) => (
                                    <tr key={index}>

                                        <td>
                                            <div className="mode-switch">
                                                <button
                                                    type="button"
                                                    className={item.mode === "existing" ? "btn-login" : "btn-modifier"}
                                                    onClick={() => changeMode(index, "existing")}
                                                >
                                                    Existant
                                                </button>
                                                <button
                                                    type="button"
                                                    className={item.mode === "new" ? "btn-login" : "btn-modifier"}
                                                    onClick={() => changeMode(index, "new")}
                                                >
                                                    Nouveau
                                                </button>
                                            </div>
                                        </td>

                                        {item.mode === "existing" ? (
                                            <>
                                                <td>
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => selectExistingProduct(index, e.target.value)}
                                                    >
                                                        <option value="">Choisir...</option>
                                                        {products.map((product) => (
                                                            <option key={product.id} value={product.id}>
                                                                {product.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors[`products.${index}.name`] &&
                                                        <p className="error-text">{errors[`products.${index}.name`]}</p>
                                                    }
                                                </td>
                                                <td>{item.brand}</td>
                                                <td>{item.model}</td>
                                                <td>
                                                    {categories.find((c) => String(c.id) === String(item.category_id))?.name || "-"}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => changeValue(index, "name", e.target.value)}
                                                    />
                                                    {errors[`products.${index}.name`] &&
                                                        <p className="error-text">{errors[`products.${index}.name`]}</p>
                                                    }
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={item.brand}
                                                        onChange={(e) => changeValue(index, "brand", e.target.value)}
                                                    />
                                                    {errors[`products.${index}.brand`] &&
                                                        <p className="error-text">{errors[`products.${index}.brand`]}</p>
                                                    }
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={item.model}
                                                        onChange={(e) => changeValue(index, "model", e.target.value)}
                                                    />
                                                    {errors[`products.${index}.model`] &&
                                                        <p className="error-text">{errors[`products.${index}.model`]}</p>
                                                    }
                                                </td>
                                                <td>
                                                    <select
                                                        value={item.category_id}
                                                        onChange={(e) => changeValue(index, "category_id", e.target.value)}
                                                    >
                                                        <option value="">Choisir...</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors[`products.${index}.category_id`] &&
                                                        <p className="error-text">{errors[`products.${index}.category_id`]}</p>
                                                    }
                                                </td>
                                            </>
                                        )}

                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => changeValue(index, "quantity", e.target.value)}
                                            />
                                            {errors[`products.${index}.quantity`] &&
                                                <p className="error-text">{errors[`products.${index}.quantity`]}</p>
                                            }
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.unit_price}
                                                onChange={(e) => changeValue(index, "unit_price", e.target.value)}
                                            />
                                            {errors[`products.${index}.unit_price`] &&
                                                <p className="error-text">{errors[`products.${index}.unit_price`]}</p>
                                            }
                                        </td>

                                        <td>
                                            {data.products.length > 1 &&
                                                <button type="button" className="off" onClick={() => removeProduct(index)}>
                                                    Supprimer
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <br />

                    <button type="button" className="btn-login" onClick={addProduct}>
                        Ajouter un produit
                    </button>

                    <button type="submit" className="btn-login">Enregistrer</button>
                </form>
                <br />

                <Link href="/achats/commands" className="btn-login">Retour</Link>

            </div>

        </div>
    );
}