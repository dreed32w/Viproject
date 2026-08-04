import {useForm, usePage, Link} from "@inertiajs/react"

export default function Dashboard(){
    const {id, username} = usePage().props
    const {post, data, setData, errors} = useForm({
        id:id,
        problem:''
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
                    <li><Link href="/" >Main</Link></li>
                    <li><Link href="/MyProducts" >Assets</Link></li>
                    <li><Link href="/MyIncident" className='active-link'>Incidents</Link></li>
                    
                    <li><Link href="/change-password">Mot de passe</Link></li>
                </ul>
                <form onSubmit={logout}>
                    <button className='btn-logout'>Logout</button>
                </form>
            </div>
            
            <div className='dashboard'>
                <h1>ajouter un Incident</h1>
                <form onSubmit={(e)=>{e.preventDefault(); post("/incident/save")}}>
                    <label>entre un description de problem : </label>
                    <textarea value={data.problem} onChange={(e) =>setData("problem", e.target.value)}>

                    </textarea>
                    {errors.problem && <p className="text-error">{errors.problem}</p>}
                    <button className="btn-login">ajouter</button>
                </form>
            </div>
        </div>
    )
}