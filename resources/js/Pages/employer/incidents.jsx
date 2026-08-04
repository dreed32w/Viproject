import {useForm, usePage, Link} from "@inertiajs/react"
import {useState} from 'react'
import StatusBadge from '@/Components/StatusBadge'
export default function Incidents(){
    const [showFen, setShowFen] = useState(true);
    const {incidents, username, flash} = usePage().props
    const {post, setData} = useForm({
    })

    const [statusFilter, setStatusFilter] = useState("");
    const incidentsFiltered = incidents.filter(incident=>
        statusFilter === "" || incident.status === statusFilter
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
                    <li><Link href="/" >Main</Link></li>
                    <li><Link href="/MyProducts" >products</Link></li>
                    <li><Link href="/MyIncident" className='active-link'>Incidents</Link></li>
                    
                    <li><Link href="/change-password">Mot de passe</Link></li>
                </ul>
                <form onSubmit={logout}>
                    <button className='btn-logout'>Logout</button>
                </form>
            </div>
            
            {flash.success_res && showFen &&(
                    <div className='sous-fen'>
                        <p style={{color: "var(--success-text)"}}>{flash.success_res}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>
                            &times; 
                        </button>
                    </div>
                )}
            <div className='dashboard'>
                <h1>mes incidents</h1>
                <div className='filters-bar'>
                    <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                        <option value="">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="repairing">En réparation</option>
                        <option value="solved">Résolu</option>
                    </select>
                </div>
                
                {incidentsFiltered && incidentsFiltered.length >0 ? 
                    <div className='table-wrap'>
                    <table>
                        <thead>
                        <tr>
                            <th>name</th><th>model</th><th>brand</th><th>serial_number</th><th>problem</th><th>date</th><th>status</th><th>confirmer resoulation</th>
                        </tr>
                        </thead>
                        <tbody>
                        {incidentsFiltered.map((incident)=>
                            <tr key={incident.id}>
                                <td>{incident.product_name}</td>
                                <td>{incident.product_model}</td>
                                <td>{incident.product_brand}</td>
                                <td>{incident.serial_number}</td>
                                <td>{incident.problem}</td>
                                <td>{incident.date}</td>
                                <td><StatusBadge status={incident.status}/></td>
                                {incident.status == "solved" ?
                                    <td><button className="btn-success" onClick={()=>{if(confirm("vous confirmer la resoulation  ? "))setData("id", incident.id);post("/confirm/resoulation"); }}>confirmer la resoulation</button></td>
                                    : <td><span style={{color: "var(--warning-text)"}}>non solved</span></td>
                                }
                                
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                    :<p className='empty-state'>aucun incident</p>
                }

            </div>
        </div>
    )
}