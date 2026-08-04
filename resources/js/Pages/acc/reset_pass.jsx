import { useForm, usePage } from '@inertiajs/react'

export default function ResetPass(){
    const { token } = usePage().props
    const { data, setData, post, errors } = useForm({
        new_pass: '',
        token: token
    })

    function submit(e){
        e.preventDefault()
        post('/ResetPass')
    }

    return(
        <div className='login-box auth-shell'>
            
            <img src='/logo.png'/>
            
            <form onSubmit={submit} className='bigform'>
                <h1>Change Votre mot de passe</h1>
            
                <h2 style={{fontSize: '1.1rem', color: '#666', }}>
                    Entrez un nouveau mot de passe
                </h2>
                <div className="form-group">
                    <label>Nouveau mot de passe :</label>
                    <input 
                        type='password' 
                        value={data.new_pass} 
                        onChange={(e) => setData('new_pass', e.target.value)}
                    />
                    {errors.new_pass && <p className='error-text'>{errors.new_pass}</p>}
                </div>

                <button type="submit" className='btn-login'>Change</button>

            </form>
        </div>
    )
}