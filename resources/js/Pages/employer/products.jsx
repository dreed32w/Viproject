import {useForm, usePage, Link} from "@inertiajs/react"
import {useState} from 'react'
import StatusBadge from '@/Components/StatusBadge'
export default function Dashboard(){
    const [showFen, setShowFen] = useState(true);
    const {products, username, flash} = usePage().props
    const {post, setData} = useForm({
    })

    const [search, setSearch] = useState("");
    const productsFiltered = products.filter(asset=>
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.serial_number.toLowerCase().includes(search.toLowerCase())
    );

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
                    <li><Link href="/MyProducts" className='active-link'>products</Link></li>
                    <li><Link href="/MyIncident" >Incidents</Link></li>
                    
                    <li><Link href="/change-password">Mot de passe</Link></li>
                </ul>
                <form onSubmit={logout}>
                    <button className='btn-logout'>Logout</button>
                </form>
            </div>
            
            <div className='dashboard'>
                <h1>mes products</h1>
                {flash.success_incident && showFen &&(
                    <div className='sous-fen'>
                        <p style={{color: "var(--success-text)"}}>{flash.success_incident}</p>
                        <button className="close-btn" onClick={() => setShowFen(false)}>
                            &times; 
                        </button>
                    </div>
                )}
                <div className='filters-bar'>
                    <input type="text" placeholder="Rechercher par nom ou serial..." value={search} onChange={(e)=>setSearch(e.target.value)} />
                </div>
                {productsFiltered && productsFiltered.length >0 ? 
                    <div className='table-wrap'>
                    <table>
                        <thead>
                        <tr>
                            <th>name</th><th>model</th><th>brand</th><th>serial_number</th><th>status</th><th>date</th><th>signialer</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productsFiltered.map((product)=>
                            <tr key={product.product_id}>
                                <td>{product.name}</td>
                                <td>{product.model}</td>
                                <td>{product.brand}</td>
                                <td>{product.serial_number}</td>
                                <td><StatusBadge status={product.status}/></td>
                                <td>{product.assigned_at}</td>
                                <td>{!product.is_Incident ?
                                    <button onClick={()=>{setData("id", product.product_id);post("/incident/new"); }}>Signialer</button>
                                    : <p style={{color: "red"}}>le produit est signaler</p>
                                    }
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                    :<p className='empty-state'>aucun asset affecter</p>
                }

            </div>
        </div>
    )
}