import { useForm, usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import StatusBadge from "@/Components/StatusBadge";

export default function Incidents(){

    const { username, incidents } = usePage().props;

    const { post, setData } = useForm({
        id:"",
        status:""
    });

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredIncidents = incidents.filter(incident=>{
        const q = search.toLowerCase();
        const matchSearch = incident.emp_name.toLowerCase().includes(q) || incident.product_name.toLowerCase().includes(q) || incident.serial_number.toLowerCase().includes(q);
        const matchStatus = statusFilter === "" || incident.status === statusFilter;
        return matchSearch && matchStatus;
    });

    function logout(e){
        e.preventDefault();
        post("/logout");
    }

    function changeStatus(id,status){

        setData({
            id:id,
            status:status
        });

        post("/incident/changeStatus");
    }

    return(

        <div className="login-box">

            <div className="profil-1">

                <h1>Bonjour Mr {username}</h1>

                <ul className="navigation">
                    <li><Link href="/">Main</Link></li>
                    <li><Link href="/achats">Achats</Link></li>
                    <li><Link href="/affectations">Affectations</Link></li>
                    <li><Link href="/employers">Employés</Link></li>
                    <li><Link href="/incidents" className="active-link">Incidents</Link></li>
                    <li><Link href="/change-password">Mot de passe</Link></li>
                </ul>

                <form onSubmit={logout}>
                    <button className="btn-logout">Logout</button>
                </form>

            </div>

            <div className="dashboard">

                <h1>Tous les incidents</h1>

                <div className="filters-bar">
                    <input type="text" placeholder="Rechercher par employé, asset ou serial..." value={search} onChange={(e)=>setSearch(e.target.value)} />
                    <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                        <option value="">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="repairing">En réparation</option>
                        <option value="solved">Résolu</option>
                    </select>
                </div>

                {filteredIncidents.length > 0 ?

                    <div className="table-wrap">
                    <table>

                        <thead>

                            <tr>

                                <th>Employé</th>
                                <th>CIN</th>
                                <th>Asset</th>
                                <th>Model</th>
                                <th>Brand</th>
                                <th>Serial</th>
                                <th>Problem</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredIncidents.map((incident)=>(

                                <tr key={incident.id}>

                                    <td>{incident.emp_name}</td>
                                    <td>{incident.cin}</td>

                                    <td>{incident.product_name}</td>
                                    <td>{incident.model}</td>
                                    <td>{incident.brand}</td>
                                    <td>{incident.serial_number}</td>

                                    <td>{incident.problem}</td>
                                    <td>{incident.date}</td>

                                    <td><StatusBadge status={incident.status}/></td>

                                    <td>

                                        {incident.status=="pending" &&
                                            <button className="btn-modifier" onClick={()=>changeStatus(incident.id,"repairing")} > Start repair </button>
                                        }

                                        {incident.status=="repairing" &&
                                            <button className="btn-success" onClick={()=>changeStatus(incident.id,"solved")} > Mark solved </button>
                                        }

                                        {incident.status=="solved" &&
                                            <span style={{color:"var(--success-text)"}}> Waiting employee </span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                :<p className="empty-state">Aucun incident trouvé.</p>
                }
            </div>

        </div>

    );

}