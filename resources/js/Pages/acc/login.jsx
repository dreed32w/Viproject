import { useForm, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react';
export default function Login() {
    useEffect(() => {
        window.onpopstate = () => {
            window.location.reload();
        };
    }, [location]);
    const { flash } = usePage().props
    const [showFen, setShowFen] = useState(true);
    const { data, setData, post, errors } = useForm({
        email: '',
        password: ''
    })

    function submit(e) {
        e.preventDefault()
        post('/login')
    }

    return (
        <div className='login-box auth-shell'>
            {flash.success_change && showFen &&(
                    <div className='sous-fen'>
                        <p style={{color: "var(--success-text)"}}>{flash.success_change}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>
                            &times; 
                        </button>
                    </div>
            )}

                <img src='/logo.png'/>

            
            <form onSubmit={submit} className='bigform'>
                <h1>Log-in</h1>
                <div className="form-group">
                    <label>Email : </label>
                    <input type='email' value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    {errors.email && <p className='error-text'>{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label>Password : </label>
                    <input type='password' value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    {errors.password && <p className='error-text'>{errors.password}</p>}
                </div>

                <button type="submit" className='btn-login'>Login</button>
                
                <div className='form-links'>
                    <a href='/SendMail'>mot de pase oblier</a>
                </div>

            </form>
        </div>
    )
}