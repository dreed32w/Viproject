import {useForm,usePage} from "@inertiajs/react"

export default function AddEmployer(){

    const {username}=usePage().props

    const {data,setData,post,errors}=useForm({
        nom:"",
        prenom:"",
        cin:"",
        email:"",
        telephone:"",
        password:""
    })

    function logout(e){
        e.preventDefault()
        post("/logout")
    }

    function save(e){
        e.preventDefault()
        post("/employer/save")
    }

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

                <h1>Ajouter un Employé</h1>

                <form onSubmit={save}>

                    <label>Nom</label>
                    <input type="text" value={data.nom} onChange={e=>setData("nom",e.target.value)}/>
                    {errors.nom && <p className="error-text">{errors.nom}</p>}

                    <label>Prénom</label>
                    <input type="text" value={data.prenom} onChange={e=>setData("prenom",e.target.value)} />
                    {errors.prenom && <p className="error-text">{errors.prenom}</p>}

                    <label>CIN</label>
                    <input type="text" value={data.cin} onChange={e=>setData("cin",e.target.value)} />
                    {errors.cin && <p className="error-text">{errors.cin}</p>}

                    <label>Email</label>
                    <input type="email" value={data.email} onChange={e=>setData("email",e.target.value)} />
                    {errors.email && <p className="error-text">{errors.email}</p>}

                    <label>Téléphone</label>
                    <input type="text" value={data.telephone} onChange={e=>setData("telephone",e.target.value)} />
                    {errors.telephone && <p className="error-text">{errors.telephone}</p>}

                    <label>Mot de passe</label>
                    <input type="password" value={data.password} onChange={e=>setData("password",e.target.value)} />
                    {errors.password && <p className="error-text">{errors.password}</p>}

                    <button className="btn-login"> Enregistrer </button>

                </form>

            </div>

        </div>

    )

}