import {useForm, usePage, Link} from "@inertiajs/react"

export default function Dashboard(){
    const {info, username} = usePage().props
    const {post} = useForm({
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
                    <li><Link href="/" className='active-link'>Main</Link></li>
                    <li><Link href="/MyProducts" >products</Link></li>
                    <li><Link href="/MyIncident" >Incidents</Link></li>
                    
                    <li><Link href="/change-password">Mot de passe</Link></li>
                </ul>
                <form onSubmit={logout}>
                    <button className='btn-logout'>Logout</button>
                </form>
            </div>
            
            <div className='dashboard'>
                <div className='toolbar'>
                    <h1>Bonjour Mr {username}, bienvenue</h1>
                </div>
                
                <div className="cards">
                    <div className="card">
                        <h3>tous les produits</h3>
                        <p className="number">{info.nb_products}</p>
                        
                    </div>
                    <div className="card">
                        <h3>les Incidents pending</h3>
                        <p className="number">{info.nb_Incidents_pending}</p>
                    </div>
                    <div className="card">
                        <h3>les Incidents repairing</h3>
                        <p className="number">{info.nb_Incidents_repairing}</p>
                    </div>
                    <div className="card">
                        <h3>les Incidents solved</h3>
                        <p className="number">{info.nb_Incidents_solved}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}