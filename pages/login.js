import Head from "next/head";
import { useState, useEffect } from "react";
import Input from "../Components/Input";
import style from '../styles/Login.module.css'
import { useRouter } from 'next/router'
import Link from "next/link";
import Navbar from "../Components/navbar";

function login() {
    let router = useRouter();
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })
    const [loginDisable, setLoginDisable] = useState(false)
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userData.email === '' || userData.password === '') {
            setMessage('Please fill all details...')
        }
        else {
            setLoginDisable(true);
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.message === 'User Login...') {
                        localStorage.setItem('accessToken', res.acccessToken);
                        router.push('/')
                    }
                    else {
                        setMessage(res.message);
                    }
                    setLoginDisable(false);
                    
                })
                .catch((err) => {
                    setMessage('Something went wrong, please try again.');
                    setLoginDisable(false)
                })
        }

    }

    useEffect(() => {
        setMessage('')
    }, [userData])

    useEffect(() => {
        const getAccess = localStorage.getItem('accessToken');
        if(getAccess){
            router.push('/')
        }
      }, [])

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <Navbar />
            <div className={style.LoginCard}>
                <span className={style.heading}>Login</span>
                <form className={style.Form} onSubmit={handleSubmit}>
                    <Input name='email' className={style.input} placeholder='Enter Email Address' type='email' userData={userData} setUserData={setUserData} />
                    <Input name='password' className={style.input} placeholder='Enter Password' type='password' userData={userData} setUserData={setUserData} />
                    <div className={style.btnGroup}>
                        <button disabled={loginDisable} className={style.Button} type="submit">
                            {loginDisable ? <div className={style.loader}></div> : null}
                            <span>Login</span>
                        </button>
                        <Link href='/signup' className={style.Link}>
                            <span>
                                Register
                            </span>
                        </Link>
                    </div>
                </form>
                <span className={style.error}>{message}</span>
            </div>
        </>
    )
}

export default login;