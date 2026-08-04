import { useForm, usePage, Link } from "@inertiajs/react";

export default function ChangePass() {

    const { username, success } = usePage().props;

    const { data, setData, post, errors, reset, processing } = useForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    function logout(e) {
        e.preventDefault();
        post("/logout");
    }

    function save(e) {
        e.preventDefault();
        post("/change-password", {
            onSuccess: () => reset(),
        });
    }

    return (
        <div className="login-box">

            <div className="profil-1">

                <h1>Bonjour Mr {username}</h1>

                <ul className="navigation">
                    <li><Link href="/">Main</Link></li>
                    <li><Link href="/achats">Achats</Link></li>
                    <li><Link href="/affectations">Affectations</Link></li>
                    <li><Link href="/employers">Employés</Link></li>
                    <li><Link href="/incidents">Incidents</Link></li>
                    <li><Link href="/change-password" className="active-link">Mot de passe</Link></li>
                </ul>

                <form onSubmit={logout}>
                    <button className="btn-logout">Logout</button>
                </form>

            </div>

            <div className="dashboard">

                <h1>Changer le mot de passe</h1>

                {success && <p className="badge badge-success">{success}</p>}

                <form onSubmit={save} className="bigform">

                    <label>Mot de passe actuel</label>
                    <input
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData("current_password", e.target.value)}
                    />
                    {errors.current_password && <p className="error-text">{errors.current_password}</p>}

                    <label>Nouveau mot de passe</label>
                    <input
                        type="password"
                        value={data.new_password}
                        onChange={(e) => setData("new_password", e.target.value)}
                    />
                    {errors.new_password && <p className="error-text">{errors.new_password}</p>}

                    <label>Confirmer le nouveau mot de passe</label>
                    <input
                        type="password"
                        value={data.new_password_confirmation}
                        onChange={(e) => setData("new_password_confirmation", e.target.value)}
                    />
                    {errors.new_password_confirmation && <p className="error-text">{errors.new_password_confirmation}</p>}

                    <button type="submit" className="btn-login" disabled={processing}>
                        Enregistrer
                    </button>

                </form>

            </div>

        </div>
    );
}
