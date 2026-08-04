import {useForm, usePage, Link} from '@inertiajs/react'

export default function ModifierCategory(){
    const {username, category} = usePage().props
    const {data, post, setData, errors} = useForm({
        id: category.id,
        name: category.name,
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
                <div style={{display: 'flex', justifyContent: "space-around"}}>
                    <h2>Modifier la catégorie</h2>
                    <form onSubmit={(e)=>{e.preventDefault(); post("/category/edit/save")}}><input type='text' value={data.name} onChange={(e)=>setData('name', e.target.value)} /><button className='btn-ok'>ok</button></form>
                    {errors.name && <p className='error-text'>{errors.name}</p>}
                </div>
                <Link href="/achats/categories" className='btn-login'>back</Link>
            </div>
        </div>
    )
}
