import {useForm, usePage, Link} from '@inertiajs/react'
import {useState} from 'react'

export default function Suppliers(){
    const [showFen, setShowFen] = useState(true);
    const {username, suppliers, flash, errors} = usePage().props
    const {post, setData} = useForm({
        id:''
    })

    const [search, setSearch] = useState("");
    const suppliersFiltered = suppliers.filter(s=>
        s.company_name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    function logout(e){
        e.preventDefault()
        post('/logout')
    }

    return(
        <div className='login-box'>
            <div className='profil-1'>
                <h1>Bonjour Mr {username}</h1>
                <ul className='navigation'>
                    <li><a href="/" >Main</a></li>
                    <li><a href="/achats" className='active-link'>Achats</a></li>
                    <li><a href="/affectations">Affectations</a></li>
                    <li><a href="/employers">Employés</a></li>
                    <li><a href="/incidents">Incidents</a></li>
                    <li><a href="/change-password">Mot de passe</a></li>
                </ul>
                <form onSubmit={logout} ><button className='btn-logout'>Logout</button></form>
            </div>
            <div className='dashboard'>
                <div className='toolbar'>
                    <h1>Tous les fournisseurs</h1>
                    <a href="/achats/addSupplier" className='btn-login'>Ajouter un fournisseur</a>
                </div>
                <div className='filters-bar'>
                    <input type="text" placeholder="Rechercher par nom ou email..." value={search} onChange={(e)=>setSearch(e.target.value)} />
                </div>
                {flash.success && showFen &&(
                    <div className='sous-fen'>
                        <p style={{color: "var(--success-text)"}}>{flash.success}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>
                            &times; 
                        </button>
                    </div>
                )}
                {errors.used && showFen &&(
                    <div className='sous-fen'>
                        <p className='error-text'>{errors.used}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>
                            &times; 
                        </button>
                    </div>
                )}
                {suppliersFiltered && suppliersFiltered.length > 0 ? 
                    <div className='table-wrap'>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th><th>Téléphone</th><th>Email</th><th>Commandes</th><th>Modifier</th><th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliersFiltered.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.company_name}</td>
                                    <td>{s.telephone}</td>
                                    <td>{s.email}</td>
                                    <td>{s.nb_commands}</td>
                                    
                                    <td><button className='btn-modifier' onClick={()=>{setData("id", s.id); post("/supplier/edit"); }}>Modifier</button></td>
                                    <td><button onClick={()=>{if(confirm("Supprimer ce fournisseur ?")){setData("id", s.id); post("/supplier/delete");} }}>Supprimer</button></td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                    </div>
                : <p className='empty-state'>Aucun fournisseur trouvé.</p> }
                <Link href="/achats" className='btn-login'>back</Link>
            </div>
        </div>
    )
}
