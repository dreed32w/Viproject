import {useForm, usePage, Link} from '@inertiajs/react'
import {useState} from 'react'

export default function Categories(){
    const [showFen, setShowFen] = useState(true);
    const {username, categories, flash, errors} = usePage().props
    const {post, data, setData} = useForm({
        name: '',
        id: ''
    })
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
                <h1>Les catégories</h1>
                <div className='filters-bar'>
                    <h2>Ajouter une catégorie</h2>
                    <form onSubmit={(e)=>{e.preventDefault(); post("/category/save")}} style={{display:'flex',gap:'10px'}}><input type='text' value={data.name} onChange={(e)=>setData('name', e.target.value)} /><button className='btn-ok'>ok</button></form>
                    {errors.name && <p className='error-text'>{errors.name}</p>}
                </div>
                {errors.used && showFen &&(
                    <div className='sous-fen'>
                        <p className='error-text'>{errors.used}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>
                            &times; 
                        </button>
                    </div>
                )}
                {flash.success && showFen &&(
                    <div className='sous-fen'>
                        <p style={{color : "var(--success-text)"}}>{flash.success}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>
                            &times; 
                        </button>
                    </div>
                )}
                {categories && categories.length > 0 ? 
                    <div className='table-wrap'>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th><th>nombre de produits</th><th>Modifier</th><th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td>{cat.name}</td>
                                    <td>{cat.nb_products}</td>
                                    <td><button className='btn-modifier' onClick={()=>{setData("id", cat.id); post("/category/edit"); }}>Modifier</button></td>
                                    <td><button onClick={()=>{if(confirm("Supprimer cette catégorie ?")){setData("id", cat.id); post("/category/delete");} }}>Supprimer</button></td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                    </div>
                : <p className='empty-state'>Aucune catégorie trouvée.</p> }
                <Link href="/achats" className='btn-login'>back</Link>
            </div>
        </div>
    )
}
