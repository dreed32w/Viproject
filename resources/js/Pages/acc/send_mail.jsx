import { useForm, usePage } from '@inertiajs/react'
import {useState} from 'react'

export default function SendMail(){
    const { flash } = usePage().props
    const [showFen, setShowFen] = useState(true);

    const { data, setData, post, errors } = useForm({
        email: ''
    })

    function submit(e){
        e.preventDefault()
        post('/SendMail')
    }

    return(
        <div className='login-box auth-shell' >
            
            <img src='/logo.png'/>
            <form onSubmit={submit} className='bigform'>
                <h2 style={{fontSize: '1.2rem',color: '#444',fontWeight: '600',lineHeight: '1.5'}}>
                    Nous vous enverrons un lien de récupération par email
                </h2>
                {flash.success_envoyee && showFen &&(
                    <div className='sous-fen'>
                        <p>{flash.success_envoyee}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>
                            &times; 
                        </button>
                    </div>
                )}

                <div className="form-group">
                    <label>Entrez l'email :</label>
                    <input 
                        type="email" 
                        value={data.email} 
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p className='error-text'>{errors.email}</p>}
                </div>

                <button type="submit" className='btn-login'>Envoyer</button>

            </form>
        </div>
    )
}