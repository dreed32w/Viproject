import {useForm, usePage, Link} from '@inertiajs/react'

export default function ModifierSupplier(){
    const {username, supplier} = usePage().props
    const {post, data, setData, errors} = useForm({
        id: supplier.id,
        company_name: supplier.company_name,
        email: supplier.email,
        telephone: supplier.telephone,
    })
    function logout(e){
        e.preventDefault()
        post('/logout')
    }

    function save(e){
        e.preventDefault()
        post("/supplier/edit/save")
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
                <h1>Modifier le fournisseur</h1>
                <form onSubmit={save}>
                    <label>le nom : </label><input type='text' value={data.company_name} onChange={(e)=>setData("company_name", e.target.value)}/>
                    {errors.company_name && <p className='error-text'>{errors.company_name}</p>}
                    <label>l'email : </label><input type='text' value={data.email} onChange={(e)=>setData("email", e.target.value)}/>
                    {errors.email && <p className='error-text'>{errors.email}</p>}
                    <label>le telephone : </label><input type='text' value={data.telephone} onChange={(e)=>setData("telephone", e.target.value)}/>
                    {errors.telephone && <p className='error-text'>{errors.telephone}</p>}
                    <button className='btn-login'>Modifier</button>
                </form>
                <Link href="/achats/suppliers" className='btn-login'>back</Link>
            </div>
        </div>
    )
}
