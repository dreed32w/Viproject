import { useForm, usePage, Link } from "@inertiajs/react";

export default function AddProduct() {

    const { username, categories } = usePage().props;

    const { data, setData, post, errors } = useForm({

        id: '',
        name: '',
        brand: '',
        model: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        quantity: ''

    });

    function logout(e) {
        e.preventDefault();
        post("/logout");
    }

    function save(e) {
        e.preventDefault();
        post("/product/add/save");
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

                <h1>Ajouter un produit</h1>

                <form onSubmit={save}>

                    <label>Nom</label>

                    <input type="text" value={data.name} onChange={(e) => setData("name", e.target.value)} />

                    {errors.name && <p className="error-text">{errors.name}</p>}

                    <label>Brand</label>

                    <input type="text" value={data.brand} onChange={(e) => setData("brand", e.target.value)} />

                    {errors.brand && <p className="error-text">{errors.brand}</p>}

                    <label>Model</label>

                    <input type="text"  value={data.model} onChange={(e) => setData("model", e.target.value)} />

                    {errors.model && <p className="error-text">{errors.model}</p>}
                    
                    <label>Quantite</label>
                    <input type="number" value={data.quantity} onChange={(e)=>setData("quantity", e.target.value)}/>

                    <label>Catégorie</label>

                    <select value={data.category_id} onChange={(e) => setData("category_id", e.target.value)} >
                        <option value="" disabled>Sélectionnez une catégorie</option>
                        {categories.map(category => (

                            <option key={category.id} value={category.id} >
                                {category.name}
                            </option>

                        ))}

                    </select>

                    {errors.category_id &&
                        <p className="error-text">{errors.category_id}</p>
                    }


                    <button className="btn-login"> Ajouter </button>
                    <Link href="/achats/products" className="btn-login">Back</Link>
                </form>

            </div>

        </div>

    );

}