import {useForm,usePage} from "@inertiajs/react"
import { useState } from "react";
export default function Affectations(){

    const {username,affectations, flash}=usePage().props
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showFen, setShowFen] = useState(true);
    const affectationsFiltered = affectations.filter(aff => {
        const matchSearch = aff.cin.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "all" ? true
                : statusFilter === "returned" ? !!aff.returned_at
                    : !aff.returned_at;

        return matchSearch && matchStatus;
    });
    const {setData,post}=useForm({
        id:""
    })

    function logout(e){
        e.preventDefault()
        post("/logout")
    }

    return(

        <div className="login-box">

            <div className="profil-1">

                <h1>Bonjour Mr {username}</h1>

                <ul className="navigation">
                    <li><a href="/">Main</a></li>
                    <li><a href="/achats">Achats</a></li>
                    <li><a href="/affectations" className="active-link">Affectations</a></li>
                    <li><a href="/employers">Employés</a></li>
                    <li><a href="/incidents">Incidents</a></li>
                    <li><a href="/change-password">Mot de passe</a></li>
                </ul>

                <form onSubmit={logout}>
                    <button className="btn-logout">Logout</button>
                </form>

            </div>

            <div className="dashboard">

                <div className="toolbar">

                    <h1>Toutes les affectations</h1>

                    <a href="/affectation/add" className="btn-login">Ajouter une affectation</a>
                </div>
                <div className="filters-bar">

                    <input type="text" placeholder="Rechercher par CIN..." value={search} onChange={(e)=>setSearch(e.target.value)}/>

                    <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} >
                        <option value="all">Toutes</option>
                        <option value="current">En cours</option>
                        <option value="returned">Retournées</option>
                    </select>

                </div>
                
                {flash.success && showFen &&(
                    <div className='sous-fen'>
                        <p style={{color: "var(--success-text)"}}>{flash.success}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>
                            &times; 
                        </button>
                    </div>
                )}
                {
                   affectations &&  affectations.length>0?
                    <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Serial</th>
                                <th>Employé</th>
                                <th>CIN</th>
                                <th>Date</th>
                                <th>Retour date</th>
                                <th>Statut</th>
                                <th>Roteur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {affectationsFiltered.map((aff)=>(
                                <tr key={aff.id}>
                                    <td>{aff.product_name}</td>
                                    <td>{aff.serial_number}</td>
                                    <td>{aff.emp_name}</td>
                                    <td>{aff.cin}</td>
                                    <td>{aff.assigned_at}</td>
                                    <td>{aff.returned_at ?? "-"}</td>
                                    <td><span className={`badge ${aff.returned_at ? "badge-neutral" : "badge-info"}`}>{aff.returned_at ? "Retournée" : "En cours"}</span></td>
                                    <td>{!aff.returned_at ?
                                        <button onClick={() => {if(confirm("Retourner cet asset ?")){setData("id", aff.id);post("/affectation/return");}}}>Retour</button>
                                        :<span style={{color: "var(--gray-500)"}}>—</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>

                    :<p className="empty-state">Aucune affectation trouvée.</p>
                }

            </div>

        </div>

    )

}