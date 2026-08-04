import {useForm,usePage} from "@inertiajs/react"

export default function AddAffectation(){

    const {username,serials,employers,errors}=usePage().props

    const {data,setData,post}=useForm({
        serial:"",
        employer:"",
    })

    function logout(e){
        e.preventDefault()
        post("/logout")
    }

    function save(e){
        e.preventDefault()
        post("/affectation/save")
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

                <h1>Nouvelle Affectation</h1>

                <form onSubmit={save}>

                    <label>Employé</label>

                    <select value={data.employer} onChange={e=>setData("employer",e.target.value)} >
                        <option value="">Choisir</option>

                        {employers.map(emp=>

                            <option key={emp.id} value={emp.id}>
                                {emp.nom} {emp.prenom}
                            </option>

                        )}

                    </select>
                    {errors.employer && <p className="error-text">{errors.employer}</p>}

                    <label>Serial</label>

                    <select value={data.serial} onChange={e=>setData("serial",e.target.value)} >
                        <option value="">Choisir</option>

                        {serials.map(serial=>

                            <option key={serial.id} value={serial.id}>
                                {serial.serial_number} - {serial.product_name} {serial.model} {serial.brand}
                            </option>

                        )}

                    </select>
                    {errors.serial && <p className="error-text">{errors.serial}</p>}

                    <button className="btn-login">Ajouter</button>
                </form>
            </div>
        </div>

    )

}
