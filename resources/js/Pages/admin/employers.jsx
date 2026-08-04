import {useForm,usePage} from "@inertiajs/react"
import {useState} from "react"

export default function Employers(){
    const [showFen, setShowFen] = useState(true);
    const {username,employers, flash, errors}=usePage().props
    const {setData,post}=useForm({
        id:""
    })

    const [search,setSearch]=useState("")

    function logout(e){
        e.preventDefault()
        post("/logout")
    }

    const filtered=employers.filter(emp=>
        emp.nom.toLowerCase().includes(search.toLowerCase()) ||
        emp.prenom.toLowerCase().includes(search.toLowerCase()) ||
        emp.cin.toLowerCase().includes(search.toLowerCase())

    )

    return(

        <div className="login-box">
            <div className="profil-1">
                <h1>Bonjour Mr {username}</h1>
                <ul className="navigation">
                    <li><a href="/">Main</a></li>
                    <li><a href="/achats">Achats</a></li>
                    <li><a href="/affectations">Affectations</a></li>
                    <li><a href="/employers" className="active-link">Employés</a></li>
                    <li><a href="/incidents">Incidents</a></li>
                    <li><a href="/change-password">Mot de passe</a></li>
                </ul>
                <form onSubmit={logout}>
                    <button className="btn-logout">Logout</button>
                </form>
            </div>

            <div className="dashboard">
                <div className="toolbar">
                    <h1>Tous les employés</h1>
                    <a href="/employer/add" className="btn-login">Ajouter une employer</a>
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
                <div className="filters-bar">
                    <input type="text" placeholder="Rechercher par nom, prénom ou CIN..." value={search} onChange={(e)=>setSearch(e.target.value)} />
                </div>
                {
                    filtered.length>0?

                    <div className="table-wrap">
                    <table>
                        <thead>
                            <tr><th>Nom</th><th>Prénom</th><th>CIN</th><th>Email</th><th>Téléphone</th><th>nombre des produits</th><th>Modifier</th><th>Supprimer</th></tr>
                        </thead>
                        <tbody>

                            {filtered.map(emp=>(

                                <tr key={emp.id}>
                                    <td>{emp.nom}</td>
                                    <td>{emp.prenom}</td>
                                    <td>{emp.cin}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.telephone}</td>
                                    <td>{emp.nb_products}</td>
                                    <td>
                                        <button className="btn-modifier" onClick={()=>{ setData("id",emp.id); post("/employer/edit")}}>Modifier</button>
                                    </td>
                                    <td>
                                        <button onClick={()=>{if(confirm("Supprimer cet employé ?")){setData("id",emp.id); post("/employer/delete")}}}>Supprimer</button>
                                    </td>
                                </tr>

                            ))}

                        </tbody>
                    </table>
                    </div>
                    :<p className="empty-state">Aucun employé trouvé.</p>
                }

            </div>

        </div>

    )

}
